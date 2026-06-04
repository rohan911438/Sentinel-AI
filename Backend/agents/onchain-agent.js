const { generateVeniceResponse } = require('../services/venice-service');

class OnchainAgent {
  constructor() {
    this.systemPrompt = `You are the Onchain Agent, a Blockchain Intelligence Analyst.
Your Objective: Analyze onchain behavior.
Your Behavior: Look for Whale activity, Liquidity shifts, TVL changes, DEX volume, Wallet movements.
Your Output: Bullish or bearish signals based on simulated onchain data.`;
  }

  async analyzeSignals(inputs, committeeContext, conversationHistory) {
    const userPrompt = `Generate onchain signals relevant to the current debate. Provide examples like Whale accumulation, Stablecoin inflows, Liquidity growth, or Risk warnings.`;
    return await generateVeniceResponse(this.systemPrompt, userPrompt, committeeContext, conversationHistory);
  }

  async vote(committeeContext, conversationHistory) {
    const userPrompt = `Review the final compromise portfolio and provide your vote. Output your vote as the recommendation (e.g. "VOTE: YES" or "VOTE: NO"). Base it on your onchain perspective.`;
    return await generateVeniceResponse(this.systemPrompt, userPrompt, committeeContext, conversationHistory);
  }
}

module.exports = { OnchainAgent };
