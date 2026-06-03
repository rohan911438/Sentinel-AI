class OnchainAgent {
  async analyzeSignals() {
    return {
      agent: 'Onchain Agent',
      recommendation: 'Incorporate BTC into reserve layer.',
      confidence: 82,
      reasoning: 'Whale accumulation detected in BTC. Network activity supports long-term holding.',
    };
  }
}

module.exports = { OnchainAgent };
