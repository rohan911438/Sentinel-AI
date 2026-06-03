class BearAgent {
  async evaluateProposal(proposal, inputs) {
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

module.exports = { BearAgent };
