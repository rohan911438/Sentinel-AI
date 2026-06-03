class BullAgent {
  async generateProposal(inputs) {
    return {
      agent: 'Bull Agent',
      recommendation: 'Increase ETH allocation to 60%.',
      confidence: 85,
      reasoning: 'Strong momentum and technical breakouts suggest heavy growth weighting.',
      proposedAllocation: { ETH: 60, BTC: 20, USDC: 10, AAVE: 10 }
    };
  }

  async reviseProposal(rejectionReason) {
    return {
      agent: 'Bull Agent',
      recommendation: 'Reduce ETH to 40%. Increase USDC to 30%.',
      confidence: 90,
      reasoning: `Acknowledging risk constraints: ${rejectionReason}. Scaling back aggressive growth.`,
      proposedAllocation: { ETH: 40, BTC: 20, USDC: 30, AAVE: 10 }
    };
  }
}

module.exports = { BullAgent };
