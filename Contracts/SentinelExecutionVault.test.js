const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SentinelExecutionVault", function () {
  let PolicyManager, policyManager;
  let AgentRegistry, agentRegistry;
  let ExecutionVault, vault;
  let MockToken, mockToken;
  
  let owner, execAgent, recipient, nonOwner;
  const EXECUTION_AGENT_ROLE = ethers.id("EXECUTION_AGENT");

  beforeEach(async function () {
    [owner, execAgent, recipient, nonOwner] = await ethers.getSigners();

    // 1. Deploy Policy Manager
    PolicyManager = await ethers.getContractFactory("SentinelPolicyManager");
    policyManager = await PolicyManager.deploy(owner.address);

    // 2. Deploy Agent Registry
    AgentRegistry = await ethers.getContractFactory("SentinelAgentRegistry");
    agentRegistry = await AgentRegistry.deploy(owner.address);

    // 3. Deploy Execution Vault
    ExecutionVault = await ethers.getContractFactory("SentinelExecutionVault");
    vault = await ExecutionVault.deploy(owner.address, policyManager.target, agentRegistry.target);

    // 4. Deploy Mock ERC20 Token
    MockToken = await ethers.getContractFactory("MockERC20");
    mockToken = await MockToken.deploy("USD Coin", "USDC", ethers.parseUnits("100000", 6));

    // --- Setup Valid Ecosystem State ---
    
    // Set execution vault on Policy Manager
    await policyManager.setExecutionVault(vault.target);

    // Add Token to Policy Manager Allowed List
    await policyManager.addAllowedToken(mockToken.target);
    
    // Register Execution Agent in Registry
    await agentRegistry.registerAgent(execAgent.address, "Execution Agent", EXECUTION_AGENT_ROLE, 5);
    
    // Assign sufficient delegation limit to Execution Agent
    const futureExpiry = Math.floor(Date.now() / 1000) + 86400; // +1 day
    await agentRegistry.assignDelegation(execAgent.address, ethers.parseUnits("10000", 6), futureExpiry);
  });

  describe("Deposits and Withdrawals", function () {
    it("Should allow deposit of allowed token", async function () {
      const amount = ethers.parseUnits("1000", 6);
      
      // Approve vault to spend owner's tokens
      await mockToken.approve(vault.target, amount);
      
      await expect(vault.deposit(mockToken.target, amount))
        .to.emit(vault, "DepositReceived")
        .withArgs(mockToken.target, owner.address, amount);
        
      expect(await mockToken.balanceOf(vault.target)).to.equal(amount);
    });

    it("Should revert deposit if token is not allowed", async function () {
      const MockToken2 = await ethers.getContractFactory("MockERC20");
      const badToken = await MockToken2.deploy("Bad Token", "BAD", 10000);
      
      const amount = 100;
      await badToken.approve(vault.target, amount);
      
      await expect(vault.deposit(badToken.target, amount))
        .to.be.revertedWith("Token not allowed by policy");
    });

    it("Should allow owner to withdraw", async function () {
      const amount = ethers.parseUnits("1000", 6);
      await mockToken.approve(vault.target, amount);
      await vault.deposit(mockToken.target, amount);
      
      const initialBal = await mockToken.balanceOf(recipient.address);
      
      await expect(vault.withdraw(mockToken.target, amount, recipient.address))
        .to.emit(vault, "WithdrawalProcessed")
        .withArgs(mockToken.target, recipient.address, amount);
        
      expect(await mockToken.balanceOf(recipient.address)).to.equal(initialBal + amount);
      expect(await mockToken.balanceOf(vault.target)).to.equal(0);
    });

    it("Should revert withdrawal from non-owner", async function () {
      await expect(
        vault.connect(nonOwner).withdraw(mockToken.target, 100, recipient.address)
      ).to.be.revertedWithCustomError(vault, "OwnableUnauthorizedAccount");
    });
  });

  describe("Emergency Pause", function () {
    it("Should pause deposits and executions when emergency pause is active", async function () {
      await vault.emergencyPause();
      
      const amount = ethers.parseUnits("100", 6);
      await mockToken.approve(vault.target, amount);
      
      await expect(vault.deposit(mockToken.target, amount))
        .to.be.revertedWithCustomError(vault, "EnforcedPause");
        
      await expect(
        vault.executeTransfer(execAgent.address, mockToken.target, amount, recipient.address, 3)
      ).to.be.revertedWithCustomError(vault, "EnforcedPause");
    });

    it("Should resume operations when unpaused", async function () {
      await vault.emergencyPause();
      await vault.emergencyUnpause();
      
      const amount = ethers.parseUnits("100", 6);
      await mockToken.approve(vault.target, amount);
      await expect(vault.deposit(mockToken.target, amount)).to.not.be.reverted;
    });
  });

  describe("Execution Transfer Validation", function () {
    beforeEach(async function () {
      // Seed vault with 5000 USDC
      const seedAmount = ethers.parseUnits("5000", 6);
      await mockToken.approve(vault.target, seedAmount);
      await vault.deposit(mockToken.target, seedAmount);
    });

    it("Should execute transfer when all policies and authorizations pass", async function () {
      const transferAmount = ethers.parseUnits("100", 6); // Within maxTradeSize (1000)
      const approvals = 3; // Minimum approvals met
      const decisionId = "DECISION_1";
      
      const initialRecipientBal = await mockToken.balanceOf(recipient.address);
      
      await expect(vault.connect(execAgent).executeTransfer(decisionId, execAgent.address, mockToken.target, transferAmount, recipient.address, approvals))
        .to.emit(vault, "ExecutionApproved")
        .withArgs(execAgent.address, mockToken.target, transferAmount, recipient.address)
        .and.to.emit(vault, "CommitteeDecisionExecuted")
        .withArgs(decisionId, execAgent.address, transferAmount);
        
      expect(await mockToken.balanceOf(recipient.address)).to.equal(initialRecipientBal + transferAmount);
    });

    it("Should reject execution if committee consensus is insufficient", async function () {
      const transferAmount = ethers.parseUnits("100", 6);
      const approvals = 1; // Fails minimum (3)
      const decisionId = "DECISION_2";
      
      await expect(
        vault.connect(execAgent).executeTransfer(decisionId, execAgent.address, mockToken.target, transferAmount, recipient.address, approvals)
      ).to.be.revertedWith("Insufficient committee approvals");
    });

    it("Should reject execution if trade amount exceeds Policy Manager max size", async function () {
      const transferAmount = ethers.parseUnits("2000", 6); // Max is 1000
      const decisionId = "DECISION_3";
      
      await expect(
        vault.connect(execAgent).executeTransfer(decisionId, execAgent.address, mockToken.target, transferAmount, recipient.address, 3)
      ).to.be.revertedWith("Amount exceeds maxTradeSize");
    });

    it("Should reject execution if agent is not authorized in Registry", async function () {
      // nonOwner is not registered as an agent
      const transferAmount = ethers.parseUnits("100", 6);
      const decisionId = "DECISION_4";
      
      await expect(
        vault.connect(nonOwner).executeTransfer(decisionId, nonOwner.address, mockToken.target, transferAmount, recipient.address, 3)
      ).to.be.revertedWith("Agent not registered");
    });

    it("Should reject execution if token is revoked from allowed list", async function () {
      const transferAmount = ethers.parseUnits("100", 6);
      const decisionId = "DECISION_5";
      
      // Revoke the token
      await policyManager.removeAllowedToken(mockToken.target);
      
      await expect(
        vault.connect(execAgent).executeTransfer(decisionId, execAgent.address, mockToken.target, transferAmount, recipient.address, 3)
      ).to.be.revertedWith("Token is not whitelisted");
    });
  });
});
