// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SentinelPolicyManager
 * @dev The core governance and risk management contract for Sentinel AI.
 * This contract acts as the onchain source of truth for all execution policies
 * enforced by the AI committee and execution agents. 
 * The Backend Enforcement Engine will query this contract before building EIP-7710 bundles.
 */
contract SentinelPolicyManager is Ownable {
    // --- State Variables ---
    uint256 public maxTradeSize;
    uint256 public dailySpendLimit;
    uint256 public riskThreshold; // e.g., 1-100 score where 100 is max risk
    bool public autoRebalanceEnabled;
    uint256 public minimumCommitteeApprovals;

    // Tracking daily spend limits (Token Address => Last Reset Timestamp)
    // For simplicity in this demo, daily spend limit resets are tracked globally per epoch
    uint256 public currentDayEpoch;
    uint256 public dailyAmountSpent;

    mapping(address => bool) public allowedTokens;
    mapping(bytes32 => bool) public executedTrades;

    address public executionVault;

    // --- Events ---
    event PolicyUpdated(string parameter, uint256 newValue);
    event AutoRebalanceChanged(bool isEnabled);
    event TokenAdded(address indexed token);
    event TokenRemoved(address indexed token);
    event RiskThresholdChanged(uint256 newThreshold);
    event GovernanceTransferred(address indexed previousOwner, address indexed newOwner);

    // Validation Events (Note: View functions cannot emit events. These are kept for on-chain 
    // state-changing execution tracking if the contract is upgraded to intercept trades later)
    event TradeValidated(address indexed token, uint256 amount);
    event TradeRejected(address indexed token, uint256 amount, string reason);

    /**
     * @dev Constructor initializes the policy constraints.
     * @param initialOwner The address of the Smart Account owner
     */
    constructor(address initialOwner) Ownable(initialOwner) {
        maxTradeSize = 1000 * 10**6; // e.g., 1000 USDC
        dailySpendLimit = 5000 * 10**6; // e.g., 5000 USDC
        riskThreshold = 75; // Max allowed risk score
        autoRebalanceEnabled = true;
        minimumCommitteeApprovals = 3;
        
        currentDayEpoch = block.timestamp / 1 days;
    }

    // --- Admin Setters ---

    function updateMaxTradeSize(uint256 _maxTradeSize) external onlyOwner {
        maxTradeSize = _maxTradeSize;
        emit PolicyUpdated("maxTradeSize", _maxTradeSize);
    }

    function updateDailySpendLimit(uint256 _dailySpendLimit) external onlyOwner {
        dailySpendLimit = _dailySpendLimit;
        emit PolicyUpdated("dailySpendLimit", _dailySpendLimit);
    }

    function updateRiskThreshold(uint256 _riskThreshold) external onlyOwner {
        require(_riskThreshold <= 100, "Risk threshold must be <= 100");
        riskThreshold = _riskThreshold;
        emit RiskThresholdChanged(_riskThreshold);
    }

    function setAutoRebalance(bool _enabled) external onlyOwner {
        autoRebalanceEnabled = _enabled;
        emit AutoRebalanceChanged(_enabled);
    }

    function setMinimumCommitteeApprovals(uint256 _minimumApprovals) external onlyOwner {
        require(_minimumApprovals > 0, "Must be > 0");
        minimumCommitteeApprovals = _minimumApprovals;
        emit PolicyUpdated("minimumCommitteeApprovals", _minimumApprovals);
    }

    function addAllowedToken(address _token) external onlyOwner {
        require(_token != address(0), "Invalid token address");
        require(!allowedTokens[_token], "Token already allowed");
        allowedTokens[_token] = true;
        emit TokenAdded(_token);
    }

    function removeAllowedToken(address _token) external onlyOwner {
        allowedTokens[_token] = false;
        emit TokenRemoved(_token);
    }

    function transferGovernance(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        address oldOwner = owner();
        _transferOwnership(newOwner);
        emit GovernanceTransferred(oldOwner, newOwner);
    }

    function setExecutionVault(address _vault) external onlyOwner {
        executionVault = _vault;
    }

    // --- Internal Reset Logic ---
    function _checkAndResetDailySpend() internal {
        uint256 today = block.timestamp / 1 days;
        if (today > currentDayEpoch) {
            currentDayEpoch = today;
            dailyAmountSpent = 0;
        }
    }

    // --- View/Validation Functions for Backend (Read-Only) ---

    /**
     * @dev Validates if a trade amount respects the max trade size and daily spend limits.
     * Note: Calling this as a view won't update the `dailyAmountSpent`.
     */
    function validateTradeAmount(uint256 amount) external view returns (bool isValid, string memory reason) {
        if (amount > maxTradeSize) {
            return (false, "Amount exceeds maxTradeSize");
        }
        
        // Calculate effective daily spend based on epoch
        uint256 effectiveSpent = (block.timestamp / 1 days > currentDayEpoch) ? 0 : dailyAmountSpent;
        if (effectiveSpent + amount > dailySpendLimit) {
            return (false, "Amount exceeds dailySpendLimit");
        }

        return (true, "Valid");
    }

    /**
     * @dev Validates if the target token is explicitly whitelisted.
     */
    function validateToken(address token) external view returns (bool isValid, string memory reason) {
        if (!allowedTokens[token]) {
            return (false, "Token is not whitelisted");
        }
        return (true, "Valid");
    }

    /**
     * @dev Validates if the aggregate risk score generated by the AI Committee is within safe bounds.
     */
    function validateRiskScore(uint256 score) external view returns (bool isValid, string memory reason) {
        if (score > riskThreshold) {
            return (false, "Risk score exceeds maximum threshold");
        }
        return (true, "Valid");
    }

    /**
     * @dev Validates if the orchestration committee reached the minimum required consensus.
     */
    function validateCommitteeConsensus(uint256 approvals) external view returns (bool isValid, string memory reason) {
        if (approvals < minimumCommitteeApprovals) {
            return (false, "Insufficient committee approvals");
        }
        return (true, "Valid");
    }

    // --- State-Modifying Execution Tracker (Optional for future on-chain interception) ---
    /**
     * @dev If Sentinel AI integrates this contract as an active forwarder, this function tracks spend.
     */
    function recordTradeExecution(bytes32 decisionId, address token, uint256 amount) external {
        require(msg.sender == owner() || msg.sender == executionVault, "Unauthorized");
        require(!executedTrades[decisionId], "Trade already executed");
        
        executedTrades[decisionId] = true;

        _checkAndResetDailySpend();
        require(amount <= maxTradeSize, "Exceeds max trade size");
        require(dailyAmountSpent + amount <= dailySpendLimit, "Exceeds daily spend limit");
        require(allowedTokens[token], "Token not allowed");

        dailyAmountSpent += amount;
        emit TradeValidated(token, amount);
    }
}
