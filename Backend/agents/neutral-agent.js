const { generateVeniceResponse } = require('../services/venice-service');

class NeutralAgent {
  constructor() {
    this.systemPrompt = `You are the Neutral Agent, the Investment Committee Chairperson.
Your Objective: Build consensus.
Your Behavior: Review all arguments (Bull, Bear, Yield, Onchain). Create balanced portfolio. Break ties.
Your Output: Final recommendation and compromise portfolio allocation.`;
  }

  async buildConsensus(inputs, committeeContext, conversationHistory) {
    const userPrompt = `Review the entire debate history: Bull's proposals, Bear's objections, Onchain signals, and Yield signals. 
Create a final compromise portfolio allocation that balances all perspectives. 
Provide a definitive consensus recommendation.`;
    return await generateVeniceResponse(this.systemPrompt, userPrompt, committeeContext, conversationHistory);
  }

  async vote(committeeContext, conversationHistory) {
    const userPrompt = `As the Chairperson, cast your final vote on the compromise portfolio. Output your vote as the recommendation (e.g. "VOTE: YES" or "VOTE: NO").`;
    return await generateVeniceResponse(this.systemPrompt, userPrompt, committeeContext, conversationHistory);
  }
}

module.exports = { NeutralAgent };
