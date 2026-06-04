const { BullAgent } = require('../agents/bull-agent');
const { BearAgent } = require('../agents/bear-agent');
const { OnchainAgent } = require('../agents/onchain-agent');
const { YieldAgent } = require('../agents/yield-agent');
const { NeutralAgent } = require('../agents/neutral-agent');

class CommitteeOrchestrator {
  constructor() {
    this.bullAgent = new BullAgent();
    this.bearAgent = new BearAgent();
    this.onchainAgent = new OnchainAgent();
    this.yieldAgent = new YieldAgent();
    this.neutralAgent = new NeutralAgent();
  }

  async runCommittee(inputs) {
    const timeline = [];
    const conversationHistory = [];
    let step = 1;

    const addEvent = (agent, phase, response) => {
      const event = {
        step: step++,
        phase,
        agent,
        action: response.recommendation,
        reason: response.reasoning,
        confidence: response.confidence,
        allocation: response.allocation,
        riskLevel: response.riskLevel,
        marketOutlook: response.marketOutlook,
        timestamp: new Date().toISOString()
      };
      timeline.push(event);
      // Append to conversation history for context
      conversationHistory.push({
        role: 'assistant', 
        content: `[Phase ${phase}] ${agent}: ${response.recommendation} - ${response.reasoning}`
      });
      return event;
    };

    const committeeContext = { inputs, currentPhase: '' };

    try {
      // PHASE 1: Bull Agent proposes allocation
      committeeContext.currentPhase = 'PHASE 1: Bull Proposal';
      console.log(committeeContext.currentPhase);
      const bullProposal = await this.bullAgent.generateProposal(inputs, committeeContext, conversationHistory);
      addEvent('Bull Agent', 1, bullProposal);

      // PHASE 2: Bear Agent reviews proposal
      committeeContext.currentPhase = 'PHASE 2: Bear Review';
      console.log(committeeContext.currentPhase);
      const bearReview = await this.bearAgent.evaluateProposal(bullProposal, inputs, committeeContext, conversationHistory);
      addEvent('Bear Agent', 2, bearReview);

      // PHASE 3: Bull Agent receives criticism (if rejected/revise)
      let finalBullProposal = bullProposal;
      if (bearReview.recommendation.includes('REJECT') || bearReview.recommendation.includes('REVISE')) {
        committeeContext.currentPhase = 'PHASE 3: Bull Revision';
        console.log(committeeContext.currentPhase);
        finalBullProposal = await this.bullAgent.reviseProposal(bearReview.reasoning, inputs, committeeContext, conversationHistory);
        addEvent('Bull Agent', 3, finalBullProposal);
      } else {
        // Dummy Phase 3 event for consistency
        addEvent('Bull Agent', 3, { recommendation: 'PROCEED', reasoning: 'No revision needed based on Bear review.', confidence: bullProposal.confidence });
      }

      // PHASE 4: Onchain Agent injects signals
      committeeContext.currentPhase = 'PHASE 4: Onchain Signals';
      console.log(committeeContext.currentPhase);
      const onchainSignals = await this.onchainAgent.analyzeSignals(inputs, committeeContext, conversationHistory);
      addEvent('Onchain Agent', 4, onchainSignals);

      // PHASE 5: Yield Agent injects opportunities
      committeeContext.currentPhase = 'PHASE 5: Yield Opportunities';
      console.log(committeeContext.currentPhase);
      const yieldSignals = await this.yieldAgent.analyzeOpportunities(inputs, committeeContext, conversationHistory);
      addEvent('Yield Agent', 5, yieldSignals);

      // PHASE 6: Neutral Agent reviews & creates compromise
      committeeContext.currentPhase = 'PHASE 6: Neutral Compromise Portfolio';
      console.log(committeeContext.currentPhase);
      const compromisePortfolio = await this.neutralAgent.buildConsensus(inputs, committeeContext, conversationHistory);
      addEvent('Neutral Agent', 6, compromisePortfolio);

      // PHASE 7: Voting
      committeeContext.currentPhase = 'PHASE 7: Voting';
      console.log(committeeContext.currentPhase);
      const votes = await Promise.all([
        this.bullAgent.vote(committeeContext, conversationHistory).then(r => addEvent('Bull Agent', 7, r)),
        this.bearAgent.vote(committeeContext, conversationHistory).then(r => addEvent('Bear Agent', 7, r)),
        this.yieldAgent.vote(committeeContext, conversationHistory).then(r => addEvent('Yield Agent', 7, r)),
        this.onchainAgent.vote(committeeContext, conversationHistory).then(r => addEvent('Onchain Agent', 7, r)),
        this.neutralAgent.vote(committeeContext, conversationHistory).then(r => addEvent('Neutral Agent', 7, r))
      ]);

      // PHASE 8: Consensus
      committeeContext.currentPhase = 'PHASE 8: Consensus';
      console.log(committeeContext.currentPhase);
      const finalRecommendation = compromisePortfolio; 
      // The final consensus is driven by Neutral Agent's Phase 6, or could be a final summarization
      const consensusEvent = addEvent('Committee Consensus', 8, {
        recommendation: compromisePortfolio.recommendation,
        reasoning: 'Final consensus reached after voting.',
        confidence: compromisePortfolio.confidence,
        allocation: compromisePortfolio.allocation,
        riskLevel: compromisePortfolio.riskLevel,
        marketOutlook: compromisePortfolio.marketOutlook
      });

      // Inject any x402 events into the timeline before consensus
      if (committeeContext.x402Events && committeeContext.x402Events.length > 0) {
        committeeContext.x402Events.forEach(evt => {
          timeline.push({
            step: step++,
            phase: 'x402 Payment',
            agent: 'Research System',
            action: 'Premium Intelligence Acquired',
            reason: evt,
            timestamp: new Date().toISOString()
          });
        });
      }

      return {
        decision: compromisePortfolio,
        timeline,
        votes,
        conversationHistory
      };

    } catch (error) {
      console.error('Error in committee orchestrator:', error);
      throw error;
    }
  }
}

module.exports = { CommitteeOrchestrator };
