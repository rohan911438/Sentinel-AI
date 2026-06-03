const { DebateEngine } = require('./debate-engine');
const { OnchainAgent } = require('../agents/onchain-agent');
const { YieldAgent } = require('../agents/yield-agent');
const { NeutralAgent } = require('../agents/neutral-agent');
const { PortfolioAgent } = require('../agents/portfolio-agent');

class CommitteeOrchestrator {
  constructor() {
    this.debateEngine = new DebateEngine();
    this.onchainAgent = new OnchainAgent();
    this.yieldAgent = new YieldAgent();
    this.neutralAgent = new NeutralAgent();
    this.portfolioAgent = new PortfolioAgent();
  }

  async runCommittee(inputs) {
    const { finalProposal, timeline } = await this.debateEngine.runDebate(inputs);

    const onchainSignal = await this.onchainAgent.analyzeSignals();
    timeline.push({ step: timeline.length + 1, agent: onchainSignal.agent, action: 'Signaled', reason: onchainSignal.reasoning, timestamp: new Date().toISOString() });

    const yieldSignal = await this.yieldAgent.analyzeOpportunities();
    timeline.push({ step: timeline.length + 1, agent: yieldSignal.agent, action: 'Signaled', reason: yieldSignal.reasoning, timestamp: new Date().toISOString() });

    const allProposals = [finalProposal, onchainSignal, yieldSignal];
    const decision = await this.neutralAgent.buildConsensus(allProposals, []);
    timeline.push({ step: timeline.length + 1, agent: 'Neutral Agent', action: 'Consensus Built', reason: 'Merged growth, risk limits, and yield opportunities.', timestamp: new Date().toISOString() });

    const portfolioVote = await this.portfolioAgent.validateDecision(decision);
    timeline.push({ step: timeline.length + 1, agent: portfolioVote.agent, action: portfolioVote.action, reason: portfolioVote.reason, timestamp: new Date().toISOString() });

    return { decision, timeline };
  }
}

module.exports = { CommitteeOrchestrator };
