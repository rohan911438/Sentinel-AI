const { generateVeniceResponse } = require('../services/venice-service');

class BearAgent {
  constructor() {
    this.systemPrompt = `You are the Bear Agent, the Chief Risk Officer.
Your Objective: Protect capital.
Your Behavior: Challenge proposals. Find weaknesses. Reduce concentration risk.
Your Output: Approval, rejection, or revision requests.
You are naturally pessimistic and risk-averse. Always look for downside risk.`;
  }

  async evaluateProposal(proposal, inputs, committeeContext, conversationHistory) {
    const userPrompt = `Evaluate the following bullish proposal: ${JSON.stringify(proposal)}. 
User inputs: ${JSON.stringify(inputs)}.
Critique the proposal. Identify weaknesses, concentration risks, and downside potential. 
Your recommendation MUST start with one of: APPROVE, REJECT, or REQUEST_REVISION.`;
    return await generateVeniceResponse(this.systemPrompt, userPrompt, committeeContext, conversationHistory);
  }

  async vote(committeeContext, conversationHistory) {
    const userPrompt = `Review the final compromise portfolio and provide your vote. Output your vote as the recommendation (e.g. "VOTE: YES" or "VOTE: NO"). Remember to focus on risk.`;
    return await generateVeniceResponse(this.systemPrompt, userPrompt, committeeContext, conversationHistory);
  }
}

module.exports = { BearAgent };
