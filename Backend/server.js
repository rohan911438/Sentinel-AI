const http = require('http');
const { CommitteeOrchestrator } = require('./committee/committee-orchestrator');

const PORT = 3000;

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

  if (req.url === '/api/debate' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const inputs = body ? JSON.parse(body) : { investmentAmount: 500000, riskLevel: 'moderate', investmentHorizon: '6 months' };
        
        const orchestrator = new CommitteeOrchestrator();
        const { decision, timeline } = await orchestrator.runCommittee(inputs);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ decision, timeline }));
      } catch (error) {
        console.error('Error executing debate:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Sentinel AI Backend running on http://127.0.0.1:${PORT}`);
});
