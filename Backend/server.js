require('dotenv').config({ path: '../.env' });
const http = require('http');
const { CommitteeOrchestrator } = require('./committee/committee-orchestrator');
const { EnforcementEngine, enforcementLogs } = require('./committee/enforcement-engine');

const PORT = 3000;
let activeDelegations = [];

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/api/delegation' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        activeDelegations = JSON.parse(body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, count: activeDelegations.length }));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else if (req.url === '/api/delegation' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(activeDelegations));
  } else if (req.url === '/api/enforcement/logs' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(enforcementLogs));
  } else if (req.url === '/api/debate' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const inputs = body ? JSON.parse(body) : { investmentAmount: 500000, riskLevel: 'moderate', investmentHorizon: '6 months' };
        
        // Pass activeDelegations to inputs for x402 research
        inputs.activeDelegations = activeDelegations;

        const orchestrator = new CommitteeOrchestrator();
        const result = await orchestrator.runCommittee(inputs);
        
        // --- PHASE 5: ENFORCEMENT ENGINE ---
        const engine = new EnforcementEngine();
        const enforcementResult = engine.validateDecision(result.decision, activeDelegations);
        result.enforcement = enforcementResult;
        // -----------------------------------

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (error) {
        console.error('Error executing debate:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message || 'Internal Server Error' }));
      }
    });
  } else if (req.url === '/api/premium-market-signals' && req.method === 'GET') {
    // x402 Payment Verification
    const paymentReceipt = req.headers['x-payment-receipt'] || req.headers['x-402-payment-receipt'];
    
    if (!paymentReceipt) {
      res.writeHead(402, {
        'Content-Type': 'application/json',
        'x-402-payment-required': 'true',
        'x-402-payment-token': '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // USDC on Base Sepolia
        'x-402-payment-amount': '10000', // 0.01 USDC (6 decimals)
        'x-402-payment-destination': '0xDE1E6A7E00000000000000000000000000000000' // Sentinel AI Treasury
      });
      return res.end(JSON.stringify({ 
        error: 'Payment Required', 
        message: 'Premium intelligence requires a 0.01 USDC payment via x402.' 
      }));
    }

    // Payment provided - return premium payload
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      data: {
        whaleAccumulationAlerts: ['0xAbC... accumulates 500k ETH', '0xDEF... swaps 10M USDC for WBTC'],
        dexVolumeTrends: { 'Uniswap V3': '+15%', 'Aerodrome': '+45%' },
        stablecoinInflows: '+1.2B USD',
        protocolTvlChanges: { 'Aave V3': '+5%', 'Compound': '-2%' },
        yieldOpportunities: [
          { protocol: 'Aave', asset: 'USDC', apy: '8.5%' },
          { protocol: 'Aerodrome', asset: 'WETH/USDC', apy: '24.2%' }
        ],
        marketSentimentScore: 82 // Bullish
      }
    }));
  } else if (req.url === '/api/smart-account/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      isConnected: true,
      isSmartAccount: true,
      smartAccountAddress: "0xSA1234567890abcdef1234567890abcdef123456",
      sessionAccountAddress: "0xSESSabcdef1234567890abcdef1234567890abcd"
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Sentinel AI Backend running on http://127.0.0.1:${PORT}`);
});
