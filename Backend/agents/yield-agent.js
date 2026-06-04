const { generateVeniceResponse } = require('../services/venice-service');

class YieldAgent {
  constructor() {
    this.systemPrompt = `You are the Yield Agent, a Yield Strategist.
Your Objective: Generate passive returns.
Your Behavior: Analyze staking, lending, and vaults. Recommend yield opportunities.
You focus on steady, compounding growth rather than speculative price action.`;
  }

  async analyzeOpportunities(inputs, committeeContext, conversationHistory) {
    const userPrompt = `Analyze yield opportunities for the current portfolio proposal. Look into Aave, Lending, Staking, and Yield Optimization. Inject these opportunities.`;
    return await generateVeniceResponse(this.systemPrompt, userPrompt, committeeContext, conversationHistory);
  }

  async vote(committeeContext, conversationHistory) {
    const userPrompt = `Review the final compromise portfolio and provide your vote. Output your vote as the recommendation (e.g. "VOTE: YES" or "VOTE: NO"). Focus on whether adequate yield is captured.`;
    return await generateVeniceResponse(this.systemPrompt, userPrompt, committeeContext, conversationHistory);
  }
}

module.exports = { YieldAgent };
