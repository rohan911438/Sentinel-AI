// smart-account-service.js
// Simulated SDK for MetaMask Smart Accounts (ERC-4337) and Advanced Permissions (ERC-7715)

class SmartAccountService {
  constructor() {
    this.storageKey = 'sentinel_smart_account';
    this.permissionsKey = 'sentinel_permissions';
  }

  // Gets the current state from localStorage
  getState() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : {
      isConnected: false,
      isSmartAccount: false,
      eoaAddress: null,
      smartAccountAddress: null,
      sessionAccountAddress: null,
      network: 'Ethereum Mainnet'
    };
  }

  saveState(state) {
    localStorage.setItem(this.storageKey, JSON.stringify(state));
  }

  // 1. User connects wallet (MetaMask)
  async connectWallet() {
    return new Promise(async (resolve, reject) => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }]
          });
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          if (accounts && accounts.length > 0) {
            const state = this.getState();
            state.eoaAddress = accounts[0];
            state.isConnected = true;
            this.saveState(state);
            resolve(state);
          } else {
            reject(new Error("No accounts returned"));
          }
        } catch (error) {
          console.error("MetaMask connection error", error);
          reject(error);
        }
      } else {
        alert("MetaMask extension not found. Please install MetaMask to continue.");
        reject(new Error("MetaMask not found"));
      }
    });
  }

  // 2. Upgrade Account Flow
  async upgradeToSmartAccount() {
    return new Promise(resolve => {
      setTimeout(() => {
        const state = this.getState();
        if (!state.isConnected) throw new Error("Wallet not connected");
        
        // Generate deterministic-looking Smart Account and Session Account
        state.isSmartAccount = true;
        state.smartAccountAddress = '0xSA' + state.eoaAddress.substring(4);
        state.sessionAccountAddress = '0xSESS' + Array.from({length: 36}, () => Math.floor(Math.random() * 16).toString(16)).join('');
        
        this.saveState(state);
        resolve(state);
      }, 1500); // Simulate transaction delay
    });
  }

  // ERC-7715 Permissions
  getPermissions() {
    const data = localStorage.getItem(this.permissionsKey);
    return data ? JSON.parse(data) : {
      granted: false,
      maxPortfolioSize: 0,
      maxDailyAllocation: 0,
      maxSingleTrade: 0,
      maxDailySpend: 0,
      autoRebalancing: false,
      contextData: null
    };
  }

  async grantPermissions(limits) {
    return new Promise(resolve => {
      setTimeout(() => {
        const perms = {
          granted: true,
          ...limits,
          contextData: {
            permissionContext: '0xPC' + Date.now().toString(16),
            delegationManager: '0xDM88888888888888888888888888888888888888',
            expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
          }
        };
        localStorage.setItem(this.permissionsKey, JSON.stringify(perms));
        resolve(perms);
      }, 1200); // Simulate MM approval popup
    });
  }

  disconnect() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.permissionsKey);
  }
}

// Export as a global singleton for the vanilla HTML UI
window.SmartAccountService = new SmartAccountService();
