const { BullAgent } = require('../agents/bull-agent');
const { BearAgent } = require('../agents/bear-agent');

class DebateEngine {
  constructor() {
    this.bullAgent = new BullAgent();
    this.bearAgent = new BearAgent();
    this.timeline = [];
    this.step = 1;
  }

  addEvent(agent, action, reason) {
    this.timeline.push({
      step: this.step++,
      agent,
      action,
      reason,
      timestamp: new Date().toISOString()
    });
  }

  async runDebate(inputs) {
    let currentProposal = await this.bullAgent.generateProposal(inputs);
    this.addEvent(currentProposal.agent, 'Proposed', currentProposal.reasoning);

    const bearVote = await this.bearAgent.evaluateProposal(currentProposal, inputs);
    this.addEvent(bearVote.agent, bearVote.action, bearVote.reason);

    if (bearVote.action === 'REJECT') {
      currentProposal = await this.bullAgent.reviseProposal(bearVote.reason);
      this.addEvent(currentProposal.agent, 'Revised', currentProposal.reasoning);
    }

    return { finalProposal: currentProposal, timeline: this.timeline };
  }
}

module.exports = { DebateEngine };
