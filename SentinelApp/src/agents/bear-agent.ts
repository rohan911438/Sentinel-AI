import { AgentProposal, AgentVote, StrategyInputs } from '../committee/types';

export class BearAgent {
  public async evaluateProposal(proposal: AgentProposal, inputs: StrategyInputs): Promise<AgentVote> {
    if (proposal.proposedAllocation && proposal.proposedAllocation.ETH > 50 && inputs.riskLevel === 'moderate') {
      return {
        agent: 'Bear Agent',
        action: 'REJECT',
        reason: 'ETH volatility exceeds moderate risk threshold. Portfolio concentration too high.'
      };
    }
    
    return {
      agent: 'Bear Agent',
      action: 'APPROVE',
      reason: 'Risk parameters are acceptable.'
    };
  }
}
