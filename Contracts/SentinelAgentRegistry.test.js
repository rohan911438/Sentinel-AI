const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SentinelAgentRegistry", function () {
  let SentinelAgentRegistry;
  let registry;
  let owner;
  let nonOwner;
  let execAgent;
  let bullAgent;

  const BULL_AGENT_ROLE = ethers.id("BULL_AGENT");
  const EXECUTION_AGENT_ROLE = ethers.id("EXECUTION_AGENT");

  beforeEach(async function () {
    [owner, nonOwner, execAgent, bullAgent] = await ethers.getSigners();

    SentinelAgentRegistry = await ethers.getContractFactory("SentinelAgentRegistry");
    registry = await SentinelAgentRegistry.deploy(owner.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await registry.owner()).to.equal(owner.address);
    });

    it("Should initialize with zero agents", async function () {
      expect(await registry.getAgentsCount()).to.equal(0);
    });
  });

  describe("Agent Registration", function () {
    it("Should allow owner to register an agent", async function () {
      await expect(registry.registerAgent(execAgent.address, "Execution Agent 1", EXECUTION_AGENT_ROLE, 5))
        .to.emit(registry, "AgentRegistered")
        .withArgs(execAgent.address, "Execution Agent 1", EXECUTION_AGENT_ROLE);
      
      const record = await registry.agents(execAgent.address);
      expect(record.agentName).to.equal("Execution Agent 1");
      expect(record.status).to.equal(1); // 1 = Active
      expect(record.permissionLevel).to.equal(5);
      expect(await registry.getAgentsCount()).to.equal(1);
    });

    it("Should revert if non-owner tries to register an agent", async function () {
      await expect(
        registry.connect(nonOwner).registerAgent(bullAgent.address, "Bull", BULL_AGENT_ROLE, 3)
      ).to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");
    });

    it("Should revert if agent is already registered", async function () {
      await registry.registerAgent(execAgent.address, "Exec", EXECUTION_AGENT_ROLE, 5);
      await expect(
        registry.registerAgent(execAgent.address, "Exec 2", EXECUTION_AGENT_ROLE, 5)
      ).to.be.revertedWith("Agent already exists");
    });
  });

  describe("Delegation and Permissions", function () {
    beforeEach(async function () {
      await registry.registerAgent(execAgent.address, "Execution Agent 1", EXECUTION_AGENT_ROLE, 5);
    });

    it("Should allow owner to assign delegation", async function () {
      const futureExpiry = Math.floor(Date.now() / 1000) + 86400; // +1 day
      
      await expect(registry.assignDelegation(execAgent.address, 1000, futureExpiry))
        .to.emit(registry, "DelegationAssigned")
        .withArgs(execAgent.address, 1000, futureExpiry);
      
      const record = await registry.agents(execAgent.address);
      expect(record.delegatedLimit).to.equal(1000);
      expect(record.expiryTimestamp).to.equal(futureExpiry);
    });

    it("Should revert delegation if expiry is in the past", async function () {
      const pastExpiry = Math.floor(Date.now() / 1000) - 100;
      
      await expect(
        registry.assignDelegation(execAgent.address, 1000, pastExpiry)
      ).to.be.revertedWith("Expiry must be in the future");
    });

    it("Should allow owner to revoke delegation", async function () {
      await registry.revokeDelegation(execAgent.address);
      
      const record = await registry.agents(execAgent.address);
      expect(record.delegatedLimit).to.equal(0);
      expect(record.expiryTimestamp).to.equal(0);
    });

    it("Should allow owner to update permission level", async function () {
      await expect(registry.updatePermissionLevel(execAgent.address, 10))
        .to.emit(registry, "PermissionUpdated")
        .withArgs(execAgent.address, 10);
      
      const record = await registry.agents(execAgent.address);
      expect(record.permissionLevel).to.equal(10);
    });
  });

  describe("Agent Deactivation", function () {
    beforeEach(async function () {
      await registry.registerAgent(bullAgent.address, "Bull Agent", BULL_AGENT_ROLE, 2);
    });

    it("Should allow owner to deactivate agent", async function () {
      await expect(registry.deactivateAgent(bullAgent.address))
        .to.emit(registry, "AgentRevoked")
        .withArgs(bullAgent.address)
        .and.to.emit(registry, "AgentStatusChanged")
        .withArgs(bullAgent.address, 2); // 2 = Revoked
      
      const record = await registry.agents(bullAgent.address);
      expect(record.status).to.equal(2);
      expect(record.delegatedLimit).to.equal(0);
    });
  });

  describe("Authorization Validation", function () {
    it("checkAuthorization: Should reject unregistered agents", async function () {
      const [isValid, reason] = await registry.checkAuthorization(nonOwner.address, 100);
      expect(isValid).to.be.false;
      expect(reason).to.equal("Agent not registered");
    });

    it("checkAuthorization: Should pass for active agent within limits", async function () {
      await registry.registerAgent(execAgent.address, "Exec", EXECUTION_AGENT_ROLE, 5);
      const futureExpiry = Math.floor(Date.now() / 1000) + 86400;
      await registry.assignDelegation(execAgent.address, 500, futureExpiry);

      const [isValid, reason] = await registry.checkAuthorization(execAgent.address, 100);
      expect(isValid).to.be.true;
      expect(reason).to.equal("Authorized");
    });

    it("checkAuthorization: Should reject if amount exceeds limit", async function () {
      await registry.registerAgent(execAgent.address, "Exec", EXECUTION_AGENT_ROLE, 5);
      const futureExpiry = Math.floor(Date.now() / 1000) + 86400;
      await registry.assignDelegation(execAgent.address, 500, futureExpiry);

      const [isValid, reason] = await registry.checkAuthorization(execAgent.address, 600);
      expect(isValid).to.be.false;
      expect(reason).to.equal("Amount exceeds delegated limit");
    });

    it("checkAuthorization: Should reject if revoked", async function () {
      await registry.registerAgent(execAgent.address, "Exec", EXECUTION_AGENT_ROLE, 5);
      await registry.deactivateAgent(execAgent.address);

      const [isValid, reason] = await registry.checkAuthorization(execAgent.address, 0);
      expect(isValid).to.be.false;
      expect(reason).to.equal("Agent is revoked");
    });

    it("checkAuthorization: Should reject and lazy-update if expired", async function () {
      await registry.registerAgent(execAgent.address, "Exec", EXECUTION_AGENT_ROLE, 5);
      // We need to simulate time travel for expiry
      const currentBlock = await ethers.provider.getBlock("latest");
      const futureExpiry = currentBlock.timestamp + 10;
      await registry.assignDelegation(execAgent.address, 500, futureExpiry);

      // Fast forward time
      await ethers.provider.send("evm_increaseTime", [20]);
      await ethers.provider.send("evm_mine");

      // We actually send the TX to trigger state change
      const tx = await registry.updateExpiry(execAgent.address);
      await tx.wait();

      // Now check state
      const record = await registry.agents(execAgent.address);
      expect(record.status).to.equal(3); // 3 = Expired
      
      const [isValid, reason] = await registry.checkAuthorization(execAgent.address, 100);
      expect(isValid).to.be.false;
    });
  });
});
