const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SentinelPolicyManager", function () {
  let SentinelPolicyManager;
  let policyManager;
  let owner;
  let nonOwner;
  let allowedToken;
  let unauthorizedToken;

  beforeEach(async function () {
    [owner, nonOwner, allowedToken, unauthorizedToken] = await ethers.getSigners();

    SentinelPolicyManager = await ethers.getContractFactory("SentinelPolicyManager");
    policyManager = await SentinelPolicyManager.deploy(owner.address);
    // await policyManager.deployed(); // older ethers v5

    // Add initial allowed token
    await policyManager.addAllowedToken(allowedToken.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await policyManager.owner()).to.equal(owner.address);
    });

    it("Should set the default policy values", async function () {
      expect(await policyManager.maxTradeSize()).to.equal(1000 * 10**6);
      expect(await policyManager.dailySpendLimit()).to.equal(5000 * 10**6);
      expect(await policyManager.riskThreshold()).to.equal(75);
      expect(await policyManager.autoRebalanceEnabled()).to.equal(true);
      expect(await policyManager.minimumCommitteeApprovals()).to.equal(3);
    });
  });

  describe("Admin Policy Updates", function () {
    it("Should allow owner to update max trade size", async function () {
      await expect(policyManager.updateMaxTradeSize(2000 * 10**6))
        .to.emit(policyManager, "PolicyUpdated")
        .withArgs("maxTradeSize", 2000 * 10**6);
      expect(await policyManager.maxTradeSize()).to.equal(2000 * 10**6);
    });

    it("Should prevent non-owner from updating max trade size", async function () {
      await expect(policyManager.connect(nonOwner).updateMaxTradeSize(2000))
        .to.be.revertedWithCustomError(policyManager, "OwnableUnauthorizedAccount"); // openzeppelin v5 error
    });

    it("Should allow owner to update risk threshold", async function () {
      await expect(policyManager.updateRiskThreshold(50))
        .to.emit(policyManager, "RiskThresholdChanged")
        .withArgs(50);
      expect(await policyManager.riskThreshold()).to.equal(50);
    });

    it("Should revert if risk threshold is set > 100", async function () {
      await expect(policyManager.updateRiskThreshold(101)).to.be.revertedWith("Risk threshold must be <= 100");
    });

    it("Should allow owner to add and remove allowed tokens", async function () {
      // Add
      await expect(policyManager.addAllowedToken(unauthorizedToken.address))
        .to.emit(policyManager, "TokenAdded")
        .withArgs(unauthorizedToken.address);
      
      let [isValid, ] = await policyManager.validateToken(unauthorizedToken.address);
      expect(isValid).to.be.true;

      // Remove
      await expect(policyManager.removeAllowedToken(unauthorizedToken.address))
        .to.emit(policyManager, "TokenRemoved")
        .withArgs(unauthorizedToken.address);
      
      [isValid, ] = await policyManager.validateToken(unauthorizedToken.address);
      expect(isValid).to.be.false;
    });

    it("Should allow governance transfer", async function () {
      await expect(policyManager.transferGovernance(nonOwner.address))
        .to.emit(policyManager, "GovernanceTransferred")
        .withArgs(owner.address, nonOwner.address);
      
      expect(await policyManager.owner()).to.equal(nonOwner.address);
    });
  });

  describe("Validation Functions (Read-Only)", function () {
    it("validateTradeAmount: Should pass for valid amount", async function () {
      const [isValid, reason] = await policyManager.validateTradeAmount(500 * 10**6);
      expect(isValid).to.be.true;
      expect(reason).to.equal("Valid");
    });

    it("validateTradeAmount: Should fail if amount exceeds maxTradeSize", async function () {
      const [isValid, reason] = await policyManager.validateTradeAmount(1500 * 10**6);
      expect(isValid).to.be.false;
      expect(reason).to.equal("Amount exceeds maxTradeSize");
    });

    it("validateTradeAmount: Should fail if amount exceeds dailySpendLimit", async function () {
      // Lower the daily spend limit for the test
      await policyManager.updateDailySpendLimit(800 * 10**6);
      
      const [isValid, reason] = await policyManager.validateTradeAmount(900 * 10**6);
      expect(isValid).to.be.false;
      expect(reason).to.equal("Amount exceeds dailySpendLimit");
    });

    it("validateToken: Should pass for allowed token", async function () {
      const [isValid, reason] = await policyManager.validateToken(allowedToken.address);
      expect(isValid).to.be.true;
    });

    it("validateToken: Should fail for unauthorized token", async function () {
      const [isValid, reason] = await policyManager.validateToken(unauthorizedToken.address);
      expect(isValid).to.be.false;
      expect(reason).to.equal("Token is not whitelisted");
    });

    it("validateRiskScore: Should pass for safe risk score", async function () {
      const [isValid, ] = await policyManager.validateRiskScore(50);
      expect(isValid).to.be.true;
    });

    it("validateRiskScore: Should fail for high risk score", async function () {
      const [isValid, reason] = await policyManager.validateRiskScore(80); // threshold is 75
      expect(isValid).to.be.false;
      expect(reason).to.equal("Risk score exceeds maximum threshold");
    });

    it("validateCommitteeConsensus: Should pass for sufficient approvals", async function () {
      const [isValid, ] = await policyManager.validateCommitteeConsensus(4);
      expect(isValid).to.be.true;
    });

    it("validateCommitteeConsensus: Should fail for insufficient approvals", async function () {
      const [isValid, reason] = await policyManager.validateCommitteeConsensus(2);
      expect(isValid).to.be.false;
      expect(reason).to.equal("Insufficient committee approvals");
    });
  });

  describe("Execution Tracking", function () {
    it("Should record valid trade execution and increment daily spend", async function () {
      const decisionId = ethers.id("DECISION_1");
      await expect(policyManager.recordTradeExecution(decisionId, allowedToken.address, 500 * 10**6))
        .to.emit(policyManager, "TradeValidated")
        .withArgs(allowedToken.address, 500 * 10**6);
      
      expect(await policyManager.dailyAmountSpent()).to.equal(500 * 10**6);
    });

    it("Should revert execution if amount exceeds max trade size", async function () {
      const decisionId = ethers.id("DECISION_2");
      await expect(policyManager.recordTradeExecution(decisionId, allowedToken.address, 1500 * 10**6))
        .to.be.revertedWith("Exceeds max trade size");
    });

    it("Should revert execution if cumulative amount exceeds daily limit", async function () {
      await policyManager.recordTradeExecution(ethers.id("1"), allowedToken.address, 800 * 10**6);
      await policyManager.recordTradeExecution(ethers.id("2"), allowedToken.address, 800 * 10**6);
      await policyManager.recordTradeExecution(ethers.id("3"), allowedToken.address, 800 * 10**6);
      await policyManager.recordTradeExecution(ethers.id("4"), allowedToken.address, 800 * 10**6);
      await policyManager.recordTradeExecution(ethers.id("5"), allowedToken.address, 800 * 10**6);
      await policyManager.recordTradeExecution(ethers.id("6"), allowedToken.address, 800 * 10**6);
      
      // Total 4800, next 800 exceeds 5000
      await expect(policyManager.recordTradeExecution(ethers.id("7"), allowedToken.address, 800 * 10**6))
        .to.be.revertedWith("Exceeds daily spend limit");
    });

    it("Should revert execution for unauthorized token", async function () {
      const decisionId = ethers.id("DECISION_8");
      await expect(policyManager.recordTradeExecution(decisionId, unauthorizedToken.address, 100 * 10**6))
        .to.be.revertedWith("Token not allowed");
    });
  });
});
