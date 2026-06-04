const { generateVeniceResponse } = require('../services/venice-service');
const { fetchPremiumSignals } = require('../services/x402-service');

class YieldAgent {
  constructor() {
    this.systemPrompt = `You are the Yield Agent, a Yield Strategist.
Your Objective: Generate passive returns.
Your Behavior: Analyze staking, lending, and vaults. Recommend yield opportunities.
You focus on steady, compounding growth rather than speculative price action.`;
  }

  async analyzeOpportunities(inputs, committeeContext, conversationHistory) {
    let premiumContext = "";
    try {
      const activeDelegations = inputs.activeDelegations || [];
      const researchDelegation = activeDelegations.find(d => d.agentName === 'Research Agent');
      
      const signals = await fetchPremiumSignals(researchDelegation);
      if (signals && signals.success) {
        premiumContext = `\n[PREMIUM X402 INTELLIGENCE ACQUIRED]:\n` +
          `- Yield Opportunities: ${JSON.stringify(signals.data.yieldOpportunities)}\n` +
          `- Protocol TVL Changes: ${JSON.stringify(signals.data.protocolTvlChanges)}\n`;
        
        committeeContext.x402Events = committeeContext.x402Events || [];
        committeeContext.x402Events.push(`Yield Agent purchased premium market intelligence via x402 for 0.01 USDC.`);
      }
    } catch (e) {
      console.error("Failed to acquire premium yield intelligence:", e);
    }

    const userPrompt = `Analyze yield opportunities for the current portfolio proposal. Look into Aave, Lending, Staking, and Yield Optimization. Inject these opportunities. ${premiumContext}`;
    return await generateVeniceResponse(this.systemPrompt, userPrompt, committeeContext, conversationHistory);
  }

  async vote(committeeContext, conversationHistory) {
    const userPrompt = `Review the final compromise portfolio and provide your vote. Output your vote as the recommendation (e.g. "VOTE: YES" or "VOTE: NO"). Focus on whether adequate yield is captured.`;
    return await generateVeniceResponse(this.systemPrompt, userPrompt, committeeContext, conversationHistory);
  }
}

module.exports = { YieldAgent };
