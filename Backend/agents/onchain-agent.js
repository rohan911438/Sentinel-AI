const { generateVeniceResponse } = require('../services/venice-service');
const { fetchPremiumSignals } = require('../services/x402-service');

class OnchainAgent {
  constructor() {
    this.systemPrompt = `You are the Onchain Agent, a Blockchain Intelligence Analyst.
Your Objective: Analyze onchain behavior.
Your Behavior: Look for Whale activity, Liquidity shifts, TVL changes, DEX volume, Wallet movements.
Your Output: Bullish or bearish signals based on simulated onchain data.`;
  }

  async analyzeSignals(inputs, committeeContext, conversationHistory) {
    let premiumContext = "";
    try {
      const activeDelegations = inputs.activeDelegations || [];
      const researchDelegation = activeDelegations.find(d => d.agentName === 'Research Agent');
      
      const signals = await fetchPremiumSignals(researchDelegation);
      if (signals && signals.success) {
        premiumContext = `\n[PREMIUM X402 INTELLIGENCE ACQUIRED]:\n` +
          `- Whale Alerts: ${signals.data.whaleAccumulationAlerts.join(', ')}\n` +
          `- DEX Volume: ${JSON.stringify(signals.data.dexVolumeTrends)}\n` +
          `- Stablecoin Inflows: ${signals.data.stablecoinInflows}\n` +
          `- Protocol TVL: ${JSON.stringify(signals.data.protocolTvlChanges)}\n` +
          `- Sentiment Score: ${signals.data.marketSentimentScore}\n`;
        
        // Log event for the frontend timeline
        committeeContext.x402Events = committeeContext.x402Events || [];
        committeeContext.x402Events.push(`Onchain Agent purchased premium market intelligence via x402 for 0.01 USDC.`);
      }
    } catch (e) {
      console.error("Failed to acquire premium intelligence:", e);
    }

    const userPrompt = `Generate onchain signals relevant to the current debate. Provide examples like Whale accumulation, Stablecoin inflows, Liquidity growth, or Risk warnings. ${premiumContext}`;
    return await generateVeniceResponse(this.systemPrompt, userPrompt, committeeContext, conversationHistory);
  }

  async vote(committeeContext, conversationHistory) {
    const userPrompt = `Review the final compromise portfolio and provide your vote. Output your vote as the recommendation (e.g. "VOTE: YES" or "VOTE: NO"). Base it on your onchain perspective.`;
    return await generateVeniceResponse(this.systemPrompt, userPrompt, committeeContext, conversationHistory);
  }
}

module.exports = { OnchainAgent };
