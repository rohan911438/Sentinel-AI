import { AgentProposal } from '../committee/types';

export class OnchainAgent {
  public async analyzeSignals(): Promise<AgentProposal> {
    return {
      agent: 'Onchain Agent',
      recommendation: 'Incorporate BTC into reserve layer.',
      confidence: 82,
      reasoning: 'Whale accumulation detected in BTC. Network activity supports long-term holding.',
    };
  }
}
