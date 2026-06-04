import { StrategyInputs, DebateEvent, CommitteeDecision, AgentProposal, AgentVote } from './types';
import { DebateEngine } from './debate-engine';
import { OnchainAgent } from '../agents/onchain-agent';
import { YieldAgent } from '../agents/yield-agent';
import { NeutralAgent } from '../agents/neutral-agent';
import { PortfolioAgent } from '../agents/portfolio-agent';
import { VotingEngine } from './voting-engine';

export class CommitteeOrchestrator {
  private debateEngine = new DebateEngine();
  private onchainAgent = new OnchainAgent();
  private yieldAgent = new YieldAgent();
  private neutralAgent = new NeutralAgent();
  private portfolioAgent = new PortfolioAgent();
  private votingEngine = new VotingEngine();

  public async runCommittee(inputs: StrategyInputs): Promise<{ decision: CommitteeDecision, timeline: DebateEvent[] }> {
    // 1. Core Debate
    const { finalProposal, timeline } = await this.debateEngine.runDebate(inputs);

    // 2. Auxiliary Insights
    const onchainSignal = await this.onchainAgent.analyzeSignals();
    timeline.push({ step: timeline.length + 1, agent: onchainSignal.agent, action: 'Signaled', reason: onchainSignal.reasoning, timestamp: new Date().toISOString() });

    const yieldSignal = await this.yieldAgent.analyzeOpportunities();
    timeline.push({ step: timeline.length + 1, agent: yieldSignal.agent, action: 'Signaled', reason: yieldSignal.reasoning, timestamp: new Date().toISOString() });

    // 3. Consensus Building
    const allProposals = [finalProposal, onchainSignal, yieldSignal];
    const decision = await this.neutralAgent.buildConsensus(allProposals, []);
    timeline.push({ step: timeline.length + 1, agent: 'Neutral Agent', action: 'Consensus Built', reason: 'Merged growth, risk limits, and yield opportunities.', timestamp: new Date().toISOString() });

    // 4. Final Validation
    const portfolioVote = await this.portfolioAgent.validateDecision(decision);
    timeline.push({ step: timeline.length + 1, agent: portfolioVote.agent, action: portfolioVote.action, reason: portfolioVote.reason, timestamp: new Date().toISOString() });

    return { decision, timeline };
  }
}
