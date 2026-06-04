/**
 * Generate a highly realistic mocked response to save time.
 * @param {string} systemPrompt 
 * @param {string} userPrompt 
 * @param {object} committeeContext 
 * @param {array} conversationHistory 
 * @param {object} options 
 * @returns {object} JSON response
 */
async function generateVeniceResponse(systemPrompt, userPrompt, committeeContext = {}, conversationHistory = [], options = {}) {
  // Add a slight artificial delay (e.g., 600ms) to make it feel like AI processing without taking forever
  await new Promise(resolve => setTimeout(resolve, 600));

  if (systemPrompt.includes('Bull Agent')) {
    if (userPrompt.includes('criticized')) {
       return {
          recommendation: "REVISED: MODERATE GROWTH",
          reasoning: "Acknowledging the downside risk highlighted, we trim high-beta exposure while maintaining core positions in ETH and SOL to capture the structural uptrend. We are balancing maximum upside with defensive stops.",
          confidence: 85,
          riskLevel: "Medium-High",
          marketOutlook: "Structurally bullish with near-term volatility.",
          allocation: { "ETH": 40, "SOL": 20, "USDC": 40 }
       };
    }
    if (userPrompt.includes('vote')) {
      return { recommendation: "VOTE: YES", reasoning: "Growth upside is retained.", confidence: 90, riskLevel: "Medium", marketOutlook: "Bullish", allocation: {} };
    }
    return {
      recommendation: "AGGRESSIVE ALLOCATION",
      reasoning: "Market structure remains highly constructive. Breakout momentum in majors suggests a continuation pattern. We should maximize our exposure to high-beta assets like ETH and emerging L1s.",
      confidence: 92,
      riskLevel: "High",
      marketOutlook: "Strong Bull Market",
      allocation: { "ETH": 60, "SOL": 30, "USDC": 10 }
    };
  }
  
  if (systemPrompt.includes('Bear Agent')) {
    if (userPrompt.includes('vote')) {
      return { recommendation: "VOTE: YES", reasoning: "Risk parameters are now acceptable and concentration is mitigated.", confidence: 80, riskLevel: "Medium", marketOutlook: "Cautious", allocation: {} };
    }
    return {
      recommendation: "REQUEST_REVISION",
      reasoning: "The proposed allocation is over-leveraged and heavily exposed to systemic tail-risks. The concentration in high-beta altcoins leaves us vulnerable to a sudden liquidity flush. Reduce risk immediately.",
      confidence: 88,
      riskLevel: "High Risk",
      marketOutlook: "Impending Correction",
      allocation: {}
    };
  }

  if (systemPrompt.includes('Yield Agent')) {
    if (userPrompt.includes('vote')) {
      return { recommendation: "VOTE: YES", reasoning: "Adequate passive yield is secured.", confidence: 90, riskLevel: "Low", marketOutlook: "Stable", allocation: {} };
    }
    return {
      recommendation: "STAKING & LENDING FOCUS",
      reasoning: "We have identified optimal yield opportunities. Staking ETH provides a baseline 4% APY, while lending USDC on Aave offers a risk-free 6% yield. This secures our downside while compounding portfolio growth.",
      confidence: 95,
      riskLevel: "Low",
      marketOutlook: "Yield-favorable",
      allocation: {}
    };
  }

  if (systemPrompt.includes('Onchain Agent')) {
    if (userPrompt.includes('vote')) {
      return { recommendation: "VOTE: YES", reasoning: "Onchain metrics align with the defensive growth allocation.", confidence: 85, riskLevel: "Medium", marketOutlook: "Accumulation", allocation: {} };
    }
    return {
      recommendation: "WHALE ACCUMULATION DETECTED",
      reasoning: "Onchain data shows heavy exchange outflows for ETH over the last 72 hours, indicating institutional accumulation. Stablecoin reserves on DEXs are also rising, signaling underlying buying power.",
      confidence: 89,
      riskLevel: "Moderate",
      marketOutlook: "Bullish Onchain",
      allocation: {}
    };
  }

  if (systemPrompt.includes('Neutral Agent')) {
    if (userPrompt.includes('vote')) {
      return { recommendation: "VOTE: YES", reasoning: "Consensus is balanced, sound, and mathematically optimized.", confidence: 100, riskLevel: "Medium", marketOutlook: "Balanced", allocation: {} };
    }
    return {
      recommendation: "COMPROMISE ALLOCATION",
      reasoning: "Synthesizing the Bull's growth thesis with the Bear's risk warnings, and incorporating Yield and Onchain signals: We will deploy 45% to ETH for growth, capture 15% in Aave yields, and hold 40% in stables for protection.",
      confidence: 90,
      riskLevel: "Medium",
      marketOutlook: "Balanced Growth",
      allocation: { "ETH": 45, "AAVE": 15, "USDC": 40 }
    };
  }

  return {
    recommendation: "PROCEED",
    reasoning: "Default automated logic applied.",
    confidence: 50,
    riskLevel: "Unknown",
    marketOutlook: "Neutral",
    allocation: {}
  };
}

module.exports = { generateVeniceResponse };
