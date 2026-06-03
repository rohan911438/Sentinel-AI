export interface AgentProposal {
  agent: string;
  recommendation: string;
  confidence: number;
  reasoning: string;
  proposedAllocation?: PortfolioAllocation;
}

export interface AgentVote {
  agent: string;
  action: 'APPROVE' | 'REJECT' | 'REQUEST_REVISION';
  reason: string;
}

export interface PortfolioAllocation {
  ETH: number;
  BTC: number;
  USDC: number;
  AAVE: number;
}

export interface CommitteeDecision {
  finalAllocation: PortfolioAllocation;
  expectedReturn: number;
  riskScore: 'Low' | 'Medium' | 'High';
  confidenceScore: number;
}

export interface DebateEvent {
  step: number;
  agent: string;
  action: string;
  reason: string;
  timestamp: string;
}

export interface StrategyInputs {
  investmentAmount: number;
  riskLevel: 'low' | 'moderate' | 'high';
  investmentHorizon: string;
}
