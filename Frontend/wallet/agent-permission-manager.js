// agent-permission-manager.js
// Simulates the Agent Redelegation Architecture using MetaMask redelegatePermissionContext

class AgentPermissionManager {
  constructor() {
    this.storageKey = 'sentinel_agent_delegations';
  }

  getDelegations() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  // Uses redelegatePermissionContext to pass limited authority down the chain
  async redelegateToAgents(sessionAccountAddress) {
    return new Promise(resolve => {
      setTimeout(() => {
        // Human -> Smart Account -> Session Account -> Agent
        const baseContext = '0xPC' + Date.now().toString(16);
        
        const delegations = [
          {
            agentName: 'Bull Agent',
            agentWallet: '0xBA11111111111111111111111111111111111111',
            delegationChain: `${sessionAccountAddress} -> 0xBA11...`,
            permissions: ['Propose Allocation'],
            allowedAmount: '0 USDC',
            expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            remainingAllowance: '0 USDC'
          },
          {
            agentName: 'Yield Agent',
            agentWallet: '0xYA22222222222222222222222222222222222222',
            delegationChain: `${sessionAccountAddress} -> 0xYA22...`,
            permissions: ['Allocate to Lending'],
            allowedAmount: '20 USDC',
            expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            remainingAllowance: '20 USDC'
          },
          {
            agentName: 'Execution Agent',
            agentWallet: '0xEA33333333333333333333333333333333333333',
            delegationChain: `${sessionAccountAddress} -> 0xEA33...`,
            permissions: ['Execute Approved Trades'],
            allowedAmount: '100 USDC (Daily Cap)',
            expiry: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
            remainingAllowance: '100 USDC'
          }
        ];

        localStorage.setItem(this.storageKey, JSON.stringify(delegations));
        resolve(delegations);
      }, 800); // Simulate redelegation signing
    });
  }
}

window.AgentPermissionManager = new AgentPermissionManager();
