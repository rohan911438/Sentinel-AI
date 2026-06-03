class NeutralAgent {
  async buildConsensus(proposals, votes) {
    return {
      finalAllocation: { ETH: 40, BTC: 20, USDC: 30, AAVE: 10 },
      expectedReturn: 12.8,
      riskScore: 'Medium',
      confidenceScore: 87
    };
  }
}

module.exports = { NeutralAgent };
