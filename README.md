<h1 align="center">Sentinel AI</h1>

<p align="center">
  <strong>Autonomous AI Portfolio Manager powered by Multi-Agent Consensus, MetaMask Smart Accounts, ERC-7715 Permissions, ERC-7710 Delegation, x402 Payments, and 1Shot Relayer Infrastructure.</strong>
</p>

<p align="center">
  <a href="#live-demo">Live Demo</a> •
  <a href="#video-demo">Video Demo</a> •
  <a href="#smart-contracts">Smart Contracts</a>
</p>

---

## Problem Statement

Modern crypto portfolio management suffers from several critical challenges:
* **Fragmented Tooling:** Users juggle multiple platforms for research, execution, and monitoring.
* **Manual Research:** Analyzing endless streams of news, onchain data, and tokenomics is exhausting.
* **Security Risks:** Directly exposing main wallet keys to trading platforms is dangerous.
* **Permission Management:** Granular control over what external entities can do is virtually nonexistent.
* **Constant Monitoring Requirements:** The 24/7 nature of crypto markets creates high cognitive load and burnout.

## Solution

**Sentinel AI** introduces an autonomous onchain investment committee. Instead of relying on a single fallible bot, Sentinel AI leverages a team of specialized AI agents that research, debate, validate, and execute investment decisions. Through MetaMask Smart Accounts and ERC-7715 permissions, users delegate scoped authority to this committee, allowing it to act on their behalf while strictly adhering to user-defined risk parameters and spending limits.

## Why Sentinel AI is the Need of the Hour

As the crypto market matures, the velocity and complexity of information are scaling exponentially:
1. **AI Agents are the New Users:** We are shifting from human-centric to agent-centric blockchains. The infrastructure to safely delegate funds to AI is required *today*.
2. **Defeating the "Single Point of AI Failure":** Large Language Models hallucinate. Trusting a single AI agent with your portfolio is financially reckless. Sentinel AI’s debate-and-consensus model is a necessary evolution to keep AI accountable.
3. **The Rise of Intent-Based Execution:** Users want outcomes (e.g., "maximize safe yield"), not the friction of gas tokens, bridging, and manual signing. Integrating 1Shot API abstracts away this friction, matching the UX expectations of Web2.
4. **Data Monopolization:** High-quality alpha is hidden behind paywalls. Sentinel AI’s use of x402 allows autonomous agents to stream micropayments for premium intelligence, leveling the playing field for retail investors.

## Why Sentinel AI is Different

Unlike existing solutions, Sentinel AI employs a **Multi-Agent Consensus** model:

| Feature | Traditional Trackers | Trading Bots | Copy Trading | Robo Advisors | Single-Agent AI | **Sentinel AI** |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Analysis Depth** | Manual | Technical only | Leader-dependent | Pre-set models | High but biased | **Multi-perspective Debate** |
| **Execution** | Manual | Automated | Automated | Automated | Automated | **Consensus-driven** |
| **Risk Control** | None | Stop-losses | Trust leader | Rigid | Variable | **ERC-7715 Scoped Permissions** |
| **Adaptability** | N/A | Low | Medium | Low | Medium | **High (Committee Intelligence)** |

A multi-agent committee is mathematically and practically superior because it removes single points of failure in reasoning. The Bull Agent pushes for growth, the Bear Agent demands risk mitigation, and the Neutral Agent synthesizes the optimal path.

---

## Hackathon Track Coverage

### Best Agent
Sentinel AI is not just one agent, but a cohesive committee of specialized intelligence:
* **Bull Agent:** Searches for upside potential, market catalysts, and momentum.
* **Bear Agent:** Identifies risks, bearish divergences, and fundamental flaws.
* **Yield Agent:** Analyzes DeFi protocols for the best risk-adjusted APYs.
* **Onchain Agent:** Monitors whale movements, smart money flows, and contract security.
* **Neutral Agent:** Synthesizes the debate and proposes the final action.
* **Execution Agent:** Formats transactions and interacts with the 1Shot Relayer.

### Best A2A Coordination
Our Agent-to-Agent (A2A) architecture is the core of Sentinel AI:
* **Structured Communication:** Agents communicate via a shared context window.
* **Debate Workflow:** Proposals are actively challenged by opposing agents.
* **Consensus Mechanism:** Actions are only taken when the Neutral Agent achieves committee consensus.
* **Decision Propagation:** Verified decisions are securely passed to the Execution Agent.
* **Redelegation Model:** Authority is seamlessly passed down the agent hierarchy securely.

### Best x402 + ERC-7710
We push the boundaries of smart accounts and machine economies:
* **Smart Accounts:** Built natively on MetaMask's advanced account abstractions.
* **ERC-7715 Permissions:** Users grant the committee strict spending and interaction limits.
* **ERC-7710 Delegation:** The primary controller delegates specific execution rights to session keys used by the Execution Agent.
* **Research Budget:** The committee has an autonomous sub-budget.
* **Autonomous Premium Data:** Agents use x402 to autonomously pay for paywalled APIs and premium intelligence reports needed for their debates.

### Best Use of 1Shot Permissionless Relayer
We completely abstract gas and transaction complexities:
* **Stablecoin Gas Payments:** The system pays for its autonomous actions using stablecoins.
* **Relayed Execution:** The Execution Agent submits formatted payloads to 1Shot.
* **Transaction Lifecycle:** Fully monitored and logged by the onchain agent.
* **Permissioned Execution Model:** 1Shot only accepts transactions that have cleared the ERC-7715 policy limits.

### Best Use of Venice AI
Venice AI powers the brain of Sentinel AI. We utilize Venice AI's uncensored, high-performance inference for:
* Agent reasoning and persona maintenance.
* Generating rigorous, multi-turn debates between the Bull and Bear agents.
* Deep investment analysis based on real-time data feeds.
* Autonomous decision support without centralized AI guardrails interfering with financial logic.

---

## System Architecture

```mermaid
graph TD
    User([User]) -->|Configures| Wallet[MetaMask Wallet]
    Wallet -->|Deploys/Controls| SA[Smart Account]
    SA -->|Grants| Perms[ERC-7715 Permissions]
    Perms -->|Creates| Sess[Session Account]
    Sess -->|ERC-7710| Redel[Redelegation]
    
    subgraph AI_Layer [AI Layer]
        MAC[Multi-Agent Committee]
        MAC -->|Debates| Venice[Venice AI Inference]
        Venice -->|Consensus| MAC
        MAC -->|x402| Prem[Premium Intelligence Layer]
        MAC -->|Proposes| Cons[Consensus Layer]
    end
    
    Redel --> MAC
    Cons -->|Validates| PE[Policy Engine]
    PE -->|Approves| Exec[Execution Layer]
    Exec -->|Payload| Relayer[1Shot Relayer]
    Relayer -->|Executes| Chain[(Blockchain)]
    
    subgraph Contracts_Layer [Contracts]
        Chain --> SPM[SentinelPolicyManager]
        Chain --> SAR[SentinelAgentRegistry]
        Chain --> SEV[SentinelExecutionVault]
    end
```

---

## Multi-Agent Architecture

### Bull Agent
* **Role:** The eternal optimist. Focuses on growth, momentum, and catalysts.
* **Inputs:** Social sentiment, TVL growth, bullish news, technical breakouts.
* **Outputs:** Investment proposals, counter-arguments to the Bear.
* **Decisions:** "Buy", "Hold", "Increase Position".
* **Interactions:** Actively debates the Bear Agent; requests data from the Onchain Agent.

### Bear Agent
* **Role:** The risk manager. Focuses on downside protection and systemic risks.
* **Inputs:** Macro headwinds, bearish divergences, unlock schedules, FUD.
* **Outputs:** Risk warnings, proposals to short or hedge, counter-arguments to the Bull.
* **Decisions:** "Sell", "Hedge", "Reduce Risk".
* **Interactions:** Challenges the Bull Agent's proposals.

### Yield Agent
* **Role:** The farmer. Seeks optimal, safe yield opportunities.
* **Inputs:** Protocol APYs, impermanent loss metrics, contract audits.
* **Outputs:** Staking/LP proposals.
* **Decisions:** "Stake", "Unstake", "Rebalance LP".
* **Interactions:** Collaborates with the Onchain Agent to verify yields.

### Onchain Agent
* **Role:** The data scientist. Deals purely in blockchain facts.
* **Inputs:** Mempool data, DEX volumes, wallet tracking, contract ABIs.
* **Outputs:** Factual data reports, security alerts.
* **Decisions:** "Safe to interact", "Malicious contract detected".
* **Interactions:** Provides factual grounding for the Bull, Bear, and Yield agents.

### Neutral Agent
* **Role:** The judge. Synthesizes arguments and makes the final call.
* **Inputs:** Debate transcripts from Bull/Bear, data from Onchain/Yield.
* **Outputs:** Final Consensus Document, Execution Payload Draft.
* **Decisions:** "Approve Proposal", "Reject Proposal".
* **Interactions:** Mediates the debate; signals the Execution Agent.

### Execution Agent
* **Role:** The operator. Translates consensus into blockchain state changes.
* **Inputs:** Consensus Document, ABI parameters.
* **Outputs:** Signed UserOperations or Relayer Payloads.
* **Decisions:** Gas price optimization, routing selection.
* **Interactions:** Interacts exclusively with the 1Shot Relayer and ERC-7710 session keys.

---

## A2A Coordination Workflow

```mermaid
sequenceDiagram
    participant U as User
    participant R as Research Agent
    participant D as Debate Engine
    participant C as Consensus Engine
    participant V as Risk Validator
    participant E as Execution Agent
    participant B as Blockchain
    
    U->>R: Initiate Strategy Request
    R->>D: Provide Market Context
    Note over D: Bull vs Bear Argumentation
    D->>D: Counter Arguments Generated
    D->>C: Submit Debate Transcript
    C->>V: Neutral Agent Proposes Action
    V->>E: ERC-7715 Policy Check Passed
    E->>B: 1Shot Relayer Execution
    B-->>U: Success Notification
```

---

## MetaMask Smart Accounts Integration

Sentinel AI leverages the cutting edge of Account Abstraction via MetaMask:
* **Smart Account Creation:** Users deploy a modular smart account seamlessly.
* **Permission Management:** Users maintain absolute sovereign control, granting granular permissions to the AI.
* **Session Accounts:** The AI uses temporary, scoped session keys, eliminating the need to expose the user's main private key.
* **Advanced Permissions:** Restrictions on which contracts the AI can touch and how much value it can move.
* **Delegation Architecture:** The primary owner delegates execution rights safely to the Agent Registry.

---

## ERC-7715 Advanced Permissions

Security is paramount. Sentinel AI uses ERC-7715 to enforce:
* **Permission Grants:** Cryptographically verifiable rulesets.
* **Spending Limits:** E.g., "The AI can only trade up to $500 per day."
* **Risk Controls:** "The AI can only interact with whitelisted Uniswap pools."
* **Autonomous Execution:** Once permissions are set, the AI acts independently within the sandbox, requiring no further user signatures.

---

## ERC-7710 Redelegation

Sentinel AI uses advanced redelegation:
* **Agent Permission Delegation:** The user delegates authority to the Sentinel Hub, which redelegates specific tasks to individual agents (e.g., the Yield Agent gets staking authority, but not trading authority).
* **Session Authority:** Time-bound keys that expire automatically.
* **Security Model:** Compartmentalized risk. If one agent is compromised, the system remains secure.
* **Why Redelegation Matters:** It allows for a hierarchy of automated intelligence without compromising the root account's security.

---

## x402 Autonomous Payments

AI needs data. Sentinel AI gives agents a wallet:
* **Agent-Owned Research Budget:** The committee has a designated balance for operations.
* **Premium Market Intelligence:** Agents use x402 protocols to pay per-request for high-tier APIs, news feeds, and sentiment analysis.
* **Automated Payment Flows:** Machine-to-machine streaming payments.
* **Delegated Spending Permissions:** Governed by ERC-7715 limits to prevent budget drain.

---

## 1Shot Permissionless Relayer

Execution is frictionless:
* **Gas Abstraction:** Users and agents never worry about native gas tokens.
* **Stablecoin Payments:** Transaction fees are paid in USDC/USDT via the 1Shot infrastructure.
* **Relayed Transactions:** The Execution Agent simply signs the intent; 1Shot handles the onchain reality.
* **Transaction Tracking:** Built-in mempool monitoring ensures transactions don't get stuck.

---

## Smart Contracts

The Sentinel AI infrastructure relies on a set of core smart contracts deployed on the **Base Sepolia Testnet**.

| Contract Name | Description | Base Sepolia Address | Verification Link |
| :--- | :--- | :--- | :--- |
| **SentinelPolicyManager** | Stores and validates ERC-7715 rules and user-defined risk parameters. | `0x0000000000000000000000000000000000000000` | [View on Basescan](https://sepolia.basescan.org/) |
| **SentinelAgentRegistry** | Whitelists and manages authorized agent session keys. | `0x0000000000000000000000000000000000000000` | [View on Basescan](https://sepolia.basescan.org/) |
| **SentinelExecutionVault** | Holds trading capital isolated from the main holdings, secured by policy limits. | `0x0000000000000000000000000000000000000000` | [View on Basescan](https://sepolia.basescan.org/) |

*(Note: Replace the `0x00...` addresses with your actual deployed contract addresses).*

### Contract Details

**SentinelPolicyManager**
* **Purpose:** Stores and validates user-defined risk parameters and ERC-7715 rules.
* **Security Controls:** Only modifiable by the root MetaMask wallet owner.
* **Events:** Emits logs for every policy update and violation attempt.
* **Ownership Model:** ERC-4337 compliant owner structure.

**SentinelAgentRegistry**
* **Purpose:** Whitelists authorized agent session keys.
* **Security Controls:** Can revoke an agent's access instantly.
* **Events:** `AgentAdded`, `AgentRevoked`.
* **Ownership Model:** Governed by the main Smart Account.

**SentinelExecutionVault**
* **Purpose:** Holds the trading capital isolated from the user's main holdings.
* **Security Controls:** Hardcoded integration with `SentinelPolicyManager`.
* **Events:** `TradeExecuted`, `YieldHarvested`.
* **Ownership Model:** Controlled jointly by user and authorized agents.

---

## Workflow Example

**Scenario:** User invests $1000 with a "Moderate Risk" profile.

1. **Research:** The Onchain Agent identifies a dip in ETH price and a spike in DeFi stablecoin yields. The agents use x402 to buy a premium sentiment report.
2. **Debate:** 
   * *Bull Agent:* "ETH is oversold. We should buy $500 ETH."
   * *Bear Agent:* "Macro is uncertain. Keep 80% in stables."
   * *Yield Agent:* "Aave is paying 8% on USDC. Let's park the stables there."
3. **Consensus:** The Neutral Agent decides: Buy $300 ETH, deposit $700 in Aave USDC.
4. **Validation:** `SentinelPolicyManager` confirms this transaction is under the $1000 limit and interacts with whitelisted contracts (Uniswap, Aave).
5. **Execution:** Execution Agent signs the payload. 1Shot Relayer pays gas in USDC and executes the transactions.
6. **Monitoring:** Onchain agent verifies the new balances and sets up alerts for the next cycle.

---

## Security Model

Sentinel AI is designed with defense-in-depth:
* **Policy Controls:** Hardcoded logic prevents malicious or hallucinated agent actions.
* **Spending Limits:** Absolute daily/weekly caps on value movement.
* **Permission Scopes:** Whitelisted contract addresses only.
* **Emergency Controls:** A single click from the user revokes all session keys instantly.
* **Smart Account Protections:** Audited base contracts with multisig capabilities.

---

## Tech Stack

**Frontend:**
* Next.js
* TypeScript
* Tailwind CSS

**Backend:**
* Node.js
* Express

**Blockchain:**
* MetaMask Smart Accounts
* ERC-7715 (Advanced Permissions)
* ERC-7710 (Delegation)
* 1Shot API
* Base Sepolia Testnet

**AI Layer:**
* Venice AI (Inference & Reasoning)

**Payments:**
* x402 (Machine-to-Machine Payments)

**Smart Contracts:**
* Solidity
* OpenZeppelin

---

## Competitive Analysis

| Feature | Sentinel AI | Traditional Bots | TradingView Alerts | Portfolio Trackers |
| :--- | :--- | :--- | :--- | :--- |
| **Intelligence** | High (Multi-Agent) | Low (If/Then) | None (Manual) | None (Display) |
| **Execution** | Fully Autonomous | Semi-Auto | Manual | N/A |
| **Gas Management** | Abstracted (1Shot) | Native Only | N/A | N/A |
| **Permissions** | Scoped (ERC-7715) | Full API Keys | N/A | Read-Only API |

**Advantages:** Sentinel AI is the only platform that combines high-level reasoning (Venice AI), robust security (MetaMask/ERC-7715), and frictionless execution (1Shot).

---

## Future Roadmap

* **Q3 2024:** Cross-chain execution capabilities across EVM L2s.
* **Q4 2024:** Institutional strategies and multi-wallet aggregated management.
* **Q1 2025:** DAO governance integrations for treasury management.
* **Q2 2025:** Advanced offchain risk engines and ZK-coprocessors.

---

## Installation Guide

```bash
# Clone the repository
git clone https://github.com/brotherhood/sentinel-ai.git

# Navigate to directory
cd sentinel-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Venice AI, 1Shot, and RPC keys to .env

# Run local development server
npm run dev
```

---

## Deployment Guide

1. Deploy the Smart Contracts:
   ```bash
   npx hardhat run scripts/deploy.ts --network base-sepolia
   ```
2. Build the Frontend:
   ```bash
   npm run build
   ```
3. Deploy to Vercel/Netlify.
4. Configure your MetaMask Smart Account via the frontend interface.

---

## Team

**BROTHERHOOD**
* **Rohan Kumar** - Solo Developer, AI/Web3 Architect

---

## Acknowledgements

* **MetaMask** for pioneering Account Abstraction and Smart Accounts.
* **1Shot API** for seamless relayer infrastructure.
* **Venice AI** for powerful, uncensored inference.
* **HackQuest** for hosting an incredible Dev Cook Off.
