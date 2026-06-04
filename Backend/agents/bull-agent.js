const { generateVeniceResponse } = require('../services/venice-service');

class BullAgent {
  constructor() {
    this.systemPrompt = `You are the Bull Agent, an Aggressive Portfolio Manager.
Your Objective: Maximize returns.
Your Behavior: Seek upside. Favor growth assets. Identify strong narratives.
Your Output: Bullish recommendations.
Always look for the highest growth potential and be optimistic about the market.`;
  }

  async generateProposal(inputs, committeeContext, conversationHistory) {
    const userPrompt = `Generate a bullish investment proposal based on these inputs: ${JSON.stringify(inputs)}. Focus on maximum growth.`;
    return await generateVeniceResponse(this.systemPrompt, userPrompt, committeeContext, conversationHistory);
  }

  async reviseProposal(criticism, inputs, committeeContext, conversationHistory) {
    const userPrompt = `The Bear Agent has criticized the proposal with the following reasoning: "${criticism}". 
Please revise the bullish proposal to address these concerns while still aiming to maximize returns. Inputs: ${JSON.stringify(inputs)}`;
    return await generateVeniceResponse(this.systemPrompt, userPrompt, committeeContext, conversationHistory);
  }

  async vote(committeeContext, conversationHistory) {
    const userPrompt = `Review the final compromise portfolio and provide your vote. Output your vote as the recommendation (e.g. "VOTE: YES" or "VOTE: NO").`;
    return await generateVeniceResponse(this.systemPrompt, userPrompt, committeeContext, conversationHistory);
  }
}

module.exports = { BullAgent };
