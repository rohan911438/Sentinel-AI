// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// Minimal interface for SentinelPolicyManager
interface ISentinelPolicyManager {
    function validateTradeAmount(uint256 amount) external view returns (bool, string memory);
    function validateToken(address token) external view returns (bool, string memory);
    function validateCommitteeConsensus(uint256 approvals) external view returns (bool, string memory);
    function recordTradeExecution(bytes32 decisionId, address token, uint256 amount) external;
}

// Minimal interface for SentinelAgentRegistry
interface ISentinelAgentRegistry {
    function checkAuthorization(address agent, uint256 amount) external view returns (bool, string memory);
}

/**
 * @title SentinelExecutionVault
 * @dev Controlled treasury and execution vault for Sentinel AI. 
 * Securely holds approved assets and acts as the controlled source of execution capital.
 */
contract SentinelExecutionVault is Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    ISentinelPolicyManager public policyManager;
    ISentinelAgentRegistry public agentRegistry;

    struct ExecutionRecord {
        address agent;
        address token;
        uint256 amount;
        address recipient;
        uint256 timestamp;
    }

    ExecutionRecord[] public executionHistory;

    // --- Events ---
    event DepositReceived(address indexed token, address indexed from, uint256 amount);
    event WithdrawalProcessed(address indexed token, address indexed to, uint256 amount);
    event ExecutionApproved(address indexed agent, address indexed token, uint256 amount, address recipient);
    event ExecutionRejected(address indexed agent, address indexed token, uint256 amount, string reason);
    event EmergencyPauseActivated(address by);
    event EmergencyPauseRemoved(address by);
    event PolicyManagerUpdated(address newAddress);
    event AgentRegistryUpdated(address newAddress);
    event CommitteeDecisionExecuted(string decisionId, address agent, uint256 amount);

    /**
     * @dev Constructor
     * @param initialOwner The address of the Smart Account owner
     * @param _policyManager Address of the deployed SentinelPolicyManager
     * @param _agentRegistry Address of the deployed SentinelAgentRegistry
     */
    constructor(
        address initialOwner,
        address _policyManager,
        address _agentRegistry
    ) Ownable(initialOwner) {
        policyManager = ISentinelPolicyManager(_policyManager);
        agentRegistry = ISentinelAgentRegistry(_agentRegistry);
    }

    // --- User Fund Management ---

    /**
     * @dev Deposit tokens into the execution vault.
     */
    function deposit(address token, uint256 amount) external whenNotPaused nonReentrant {
        require(amount > 0, "Amount must be > 0");
        
        // Ensure token is allowed by policy
        (bool isValidToken, ) = policyManager.validateToken(token);
        require(isValidToken, "Token not allowed by policy");

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        emit DepositReceived(token, msg.sender, amount);
    }

    /**
     * @dev Withdraw tokens back to the owner.
     */
    function withdraw(address token, uint256 amount, address to) external onlyOwner nonReentrant {
        require(amount > 0, "Amount must be > 0");
        require(to != address(0), "Cannot withdraw to zero address");

        IERC20(token).safeTransfer(to, amount);
        emit WithdrawalProcessed(token, to, amount);
    }

    // --- AI Execution Flow ---

    /**
     * @dev Core execution function called by the AI's on-chain execution agent or relayer.
     * Evaluates constraints from the Agent Registry and Policy Manager before transferring funds.
     */
    function executeTransfer(
        string calldata decisionId,
        address executingAgent,
        address token,
        uint256 amount,
        address recipient,
        uint256 committeeApprovals
    ) external nonReentrant whenNotPaused {
        require(msg.sender == executingAgent, "Caller must be agent");
        require(amount > 0, "Amount must be > 0");
        require(recipient != address(0), "Invalid recipient");
        require(IERC20(token).balanceOf(address(this)) >= amount, "Insufficient vault balance");

        // We restrict this to be callable only by the owner (or the registered execution agent logic)
        // For hackathon purposes, the Smart Account or Execution Agent acts as the caller.
        
        // 1. Validate Committee Consensus
        (bool consensusValid, string memory consensusReason) = policyManager.validateCommitteeConsensus(committeeApprovals);
        if (!consensusValid) {
            emit ExecutionRejected(executingAgent, token, amount, consensusReason);
            revert(consensusReason);
        }

        // 2. Validate Token Policy
        (bool tokenValid, string memory tokenReason) = policyManager.validateToken(token);
        if (!tokenValid) {
            emit ExecutionRejected(executingAgent, token, amount, tokenReason);
            revert(tokenReason);
        }

        // 3. Validate Trade Amount Policy
        (bool amountValid, string memory amountReason) = policyManager.validateTradeAmount(amount);
        if (!amountValid) {
            emit ExecutionRejected(executingAgent, token, amount, amountReason);
            revert(amountReason);
        }

        // 4. Validate Agent Authorization (Registry)
        (bool authValid, string memory authReason) = agentRegistry.checkAuthorization(executingAgent, amount);
        if (!authValid) {
            emit ExecutionRejected(executingAgent, token, amount, authReason);
            revert(authReason);
        }

        // 5. Record the execution in the policy manager
        bytes32 decisionBytes = keccak256(abi.encodePacked(decisionId));
        policyManager.recordTradeExecution(decisionBytes, token, amount);

        // 6. Record Audit Trail
        executionHistory.push(ExecutionRecord({
            agent: executingAgent,
            token: token,
            amount: amount,
            recipient: recipient,
            timestamp: block.timestamp
        }));

        // 7. Execute the Transfer
        IERC20(token).safeTransfer(recipient, amount);
        emit ExecutionApproved(executingAgent, token, amount, recipient);
        emit CommitteeDecisionExecuted(decisionId, executingAgent, amount);
    }

    // --- Emergency Controls ---

    /**
     * @dev Halts all deposits and execution. Withdrawals by owner remain possible if we added logic for it,
     * but standard behavior pauses most interactions.
     */
    function emergencyPause() external onlyOwner {
        _pause();
        emit EmergencyPauseActivated(msg.sender);
    }

    /**
     * @dev Resumes vault operations.
     */
    function emergencyUnpause() external onlyOwner {
        _unpause();
        emit EmergencyPauseRemoved(msg.sender);
    }

    // --- Configuration ---

    function updatePolicyManager(address newAddress) external onlyOwner {
        require(newAddress != address(0), "Zero address");
        policyManager = ISentinelPolicyManager(newAddress);
        emit PolicyManagerUpdated(newAddress);
    }

    function updateAgentRegistry(address newAddress) external onlyOwner {
        require(newAddress != address(0), "Zero address");
        agentRegistry = ISentinelAgentRegistry(newAddress);
        emit AgentRegistryUpdated(newAddress);
    }
}
