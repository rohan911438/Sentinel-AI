import { AgentProposal, AgentVote, DebateEvent, StrategyInputs } from './types';
import { BullAgent } from '../agents/bull-agent';
import { BearAgent } from '../agents/bear-agent';

export class DebateEngine {
  private bullAgent: BullAgent;
  private bearAgent: BearAgent;
  public timeline: DebateEvent[] = [];
  private step: number = 1;

  constructor() {
    this.bullAgent = new BullAgent();
    this.bearAgent = new BearAgent();
  }

  private addEvent(agent: string, action: string, reason: string) {
    this.timeline.push({
      step: this.step++,
      agent,
      action,
      reason,
      timestamp: new Date().toISOString()
    });
  }

  public async runDebate(inputs: StrategyInputs): Promise<{ finalProposal: AgentProposal, timeline: DebateEvent[] }> {
    // 1. Bull generates initial proposal
    let currentProposal = await this.bullAgent.generateProposal(inputs);
    this.addEvent(currentProposal.agent, 'Proposed', currentProposal.reasoning);

    // 2. Bear evaluates
    const bearVote = await this.bearAgent.evaluateProposal(currentProposal, inputs);
    this.addEvent(bearVote.agent, bearVote.action, bearVote.reason);

    // 3. Handle Rejection (Debate logic)
    if (bearVote.action === 'REJECT') {
      currentProposal = await this.bullAgent.reviseProposal(bearVote.reason);
      this.addEvent(currentProposal.agent, 'Revised', currentProposal.reasoning);
    }

    return { finalProposal: currentProposal, timeline: this.timeline };
  }
}
