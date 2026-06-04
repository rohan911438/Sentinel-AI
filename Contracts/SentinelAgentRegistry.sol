// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SentinelAgentRegistry
 * @dev Manages AI agent identities, permissions, delegation mappings, and execution authority.
 * Acts as the onchain record of every agent participating in Sentinel AI.
 */
contract SentinelAgentRegistry is Ownable {
    // --- Roles ---
    bytes32 public constant BULL_AGENT = keccak256("BULL_AGENT");
    bytes32 public constant BEAR_AGENT = keccak256("BEAR_AGENT");
    bytes32 public constant YIELD_AGENT = keccak256("YIELD_AGENT");
    bytes32 public constant ONCHAIN_AGENT = keccak256("ONCHAIN_AGENT");
    bytes32 public constant EXECUTION_AGENT = keccak256("EXECUTION_AGENT");
    bytes32 public constant SESSION_ACCOUNT = keccak256("SESSION_ACCOUNT");

    enum Status { Unregistered, Active, Revoked, Expired }

    struct AgentRecord {
        address agentAddress;
        string agentName;
        bytes32 agentRole;
        Status status;
        uint256 delegatedLimit;
        uint256 expiryTimestamp;
        uint256 permissionLevel;
    }

    // Mapping from agent address to their record
    mapping(address => AgentRecord) public agents;

    // Optional: Array to keep track of all registered agent addresses for frontend enumeration
    address[] public allAgents;

    // --- Events ---
    event AgentRegistered(address indexed agentAddress, string agentName, bytes32 agentRole);
    event AgentRevoked(address indexed agentAddress);
    event DelegationAssigned(address indexed agentAddress, uint256 newLimit, uint256 expiry);
    event DelegationExpired(address indexed agentAddress);
    event PermissionUpdated(address indexed agentAddress, uint256 newLevel);
    event AgentStatusChanged(address indexed agentAddress, Status newStatus);

    /**
     * @dev Constructor
     * @param initialOwner The address of the Smart Account owner
     */
    constructor(address initialOwner) Ownable(initialOwner) {}

    // --- Admin Setters ---

    /**
     * @dev Registers a new agent in the system.
     */
    function registerAgent(
        address _agentAddress,
        string calldata _agentName,
        bytes32 _agentRole,
        uint256 _permissionLevel
    ) external onlyOwner {
        require(_agentAddress != address(0), "Invalid agent address");
        require(agents[_agentAddress].status == Status.Unregistered, "Agent already exists");
        require(
            _agentRole == BULL_AGENT ||
            _agentRole == BEAR_AGENT ||
            _agentRole == YIELD_AGENT ||
            _agentRole == ONCHAIN_AGENT ||
            _agentRole == EXECUTION_AGENT ||
            _agentRole == SESSION_ACCOUNT,
            "Invalid role"
        );

        agents[_agentAddress] = AgentRecord({
            agentAddress: _agentAddress,
            agentName: _agentName,
            agentRole: _agentRole,
            status: Status.Active,
            delegatedLimit: 0,
            expiryTimestamp: 0,
            permissionLevel: _permissionLevel
        });

        allAgents.push(_agentAddress);

        emit AgentRegistered(_agentAddress, _agentName, _agentRole);
        emit AgentStatusChanged(_agentAddress, Status.Active);
    }

    /**
     * @dev Deactivates/Revokes an agent permanently.
     */
    function deactivateAgent(address _agentAddress) external onlyOwner {
        _requireRegistered(_agentAddress);
        agents[_agentAddress].status = Status.Revoked;
        agents[_agentAddress].delegatedLimit = 0; // Clear limits on revocation
        emit AgentRevoked(_agentAddress);
        emit AgentStatusChanged(_agentAddress, Status.Revoked);
    }

    /**
     * @dev Assigns a delegation limit and expiry to an active agent.
     */
    function assignDelegation(
        address _agentAddress,
        uint256 _delegatedLimit,
        uint256 _expiryTimestamp
    ) external onlyOwner {
        _requireRegistered(_agentAddress);
        require(agents[_agentAddress].status == Status.Active, "Agent is not active");
        require(_expiryTimestamp > block.timestamp, "Expiry must be in the future");

        agents[_agentAddress].delegatedLimit = _delegatedLimit;
        agents[_agentAddress].expiryTimestamp = _expiryTimestamp;

        emit DelegationAssigned(_agentAddress, _delegatedLimit, _expiryTimestamp);
    }

    /**
     * @dev Revokes delegation limits from an active agent.
     */
    function revokeDelegation(address _agentAddress) external onlyOwner {
        _requireRegistered(_agentAddress);
        agents[_agentAddress].delegatedLimit = 0;
        agents[_agentAddress].expiryTimestamp = 0;
        emit DelegationAssigned(_agentAddress, 0, 0);
    }

    /**
     * @dev Updates the permission level of an active agent.
     */
    function updatePermissionLevel(address _agentAddress, uint256 _newLevel) external onlyOwner {
        _requireRegistered(_agentAddress);
        require(agents[_agentAddress].status == Status.Active, "Agent is not active");
        
        agents[_agentAddress].permissionLevel = _newLevel;
        emit PermissionUpdated(_agentAddress, _newLevel);
    }

    // --- View & Validation Functions ---

    /**
     * @dev Checks if an agent is authorized for a given action amount (Read Only).
     */
    function checkAuthorization(address _agentAddress, uint256 _requiredAmount) external view returns (bool isValid, string memory reason) {
        AgentRecord memory record = agents[_agentAddress];

        if (record.status == Status.Unregistered) {
            return (false, "Agent not registered");
        }
        if (record.status == Status.Revoked) {
            return (false, "Agent is revoked");
        }
        
        // Check Expiry
        if (record.expiryTimestamp > 0 && block.timestamp >= record.expiryTimestamp) {
            return (false, "Delegation expired");
        }

        if (record.status == Status.Expired) {
            return (false, "Delegation expired");
        }

        // Check Limit
        if (_requiredAmount > record.delegatedLimit) {
            return (false, "Amount exceeds delegated limit");
        }

        return (true, "Authorized");
    }

    /**
     * @dev Lazily updates expiry status to emit events if an agent is expired.
     */
    function updateExpiry(address _agentAddress) external {
        AgentRecord memory record = agents[_agentAddress];
        if (record.status == Status.Active && record.expiryTimestamp > 0 && block.timestamp >= record.expiryTimestamp) {
            agents[_agentAddress].status = Status.Expired;
            emit DelegationExpired(_agentAddress);
            emit AgentStatusChanged(_agentAddress, Status.Expired);
        }
    }

    /**
     * @dev Retrieves agent details for frontend visualization.
     */
    function getAgent(address _agentAddress) external view returns (
        string memory name,
        bytes32 role,
        Status status,
        uint256 limit,
        uint256 expiry,
        uint256 permissionLevel
    ) {
        AgentRecord memory record = agents[_agentAddress];
        return (
            record.agentName,
            record.agentRole,
            record.status,
            record.delegatedLimit,
            record.expiryTimestamp,
            record.permissionLevel
        );
    }

    /**
     * @dev Internal helper to enforce an agent is registered.
     */
    function _requireRegistered(address _agentAddress) internal view {
        require(agents[_agentAddress].status != Status.Unregistered, "Agent not registered");
    }

    /**
     * @dev Get total count of agents for frontend iteration.
     */
    function getAgentsCount() external view returns (uint256) {
        return allAgents.length;
    }
}
