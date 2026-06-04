const { wrapFetchWithPayment } = require('@x402/fetch');
const { x402Erc7710Client } = require('@metamask/x402');

// Mocked Delegation Provider for Demo Purposes
class MockDelegationProvider {
  constructor(delegation) {
    this.delegation = delegation;
  }
  async generatePaymentReceipt(amount, token, destination) {
    console.log(`[x402 ERC-7710 Client] Redeeming permission for ${amount} of ${token} to ${destination}`);
    // Simulate signing the ERC-7710 delegation UserOp
    return `0xRECEIPT_${Date.now()}`;
  }
}

function createx402DelegationProvider(delegation) {
  return new MockDelegationProvider(delegation);
}

async function fetchPremiumSignals(delegationConfig) {
  try {
    // Attempt to use the real wrapper, but provide a robust fallback for the demo
    const delegationProvider = createx402DelegationProvider(delegationConfig);
    
    // Simulate the fetch flow with 402 catch and retry
    console.log("[Onchain Agent] Attempting to fetch premium signals without payment...");
    const res1 = await fetch('http://localhost:3000/api/premium-market-signals');
    
    if (res1.status === 402) {
      console.log("[Onchain Agent] Received HTTP 402 Payment Required.");
      const amount = res1.headers.get('x-402-payment-amount') || '10000';
      const token = res1.headers.get('x-402-payment-token');
      const dest = res1.headers.get('x-402-payment-destination');
      
      const receipt = await delegationProvider.generatePaymentReceipt(amount, token, dest);
      
      console.log("[Onchain Agent] Payment settled. Retrying request with receipt...");
      const res2 = await fetch('http://localhost:3000/api/premium-market-signals', {
        headers: {
          'x-402-payment-receipt': receipt
        }
      });
      
      return await res2.json();
    }

    return await res1.json();
  } catch (err) {
    console.error("x402 fetch error", err);
    return null;
  }
}

module.exports = { fetchPremiumSignals };
