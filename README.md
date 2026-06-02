# Sentinel AI — Autonomous Investment Committee

>A focused README describing architecture, stack, frontend design, workflow, demo steps, and prize-track strategy for the Sentinel AI Investment Committee (an autonomous, on-chain AI Investment Committee using MetaMask Smart Accounts, Venice AI, and agent-to-agent coordination).

---

## Overview

Sentinel AI is an autonomous on-chain investment committee composed of specialized AI agents that debate, propose, vote, and execute portfolio decisions through MetaMask Smart Accounts and permissioned relayers. The product emphasizes agent-to-agent (A2A) coordination, on-chain signals, continuous autonomy, and safe execution limits set by the user.

This README captures the recommended architecture, component responsibilities, frontend pages and flows, tech stack, demo workflow, and a focused prize-track strategy.

---

## Product Positioning

Sentinel AI — "An autonomous on-chain investment committee powered by AI agents."  
Shift the narrative from "AI tells you what to buy" to:  
"A team of specialized AI fund managers debate, vote, execute, and continuously manage your portfolio using MetaMask Smart Accounts."

This positioning highlights agent intelligence, A2A coordination, Venice AI usage, and real on-chain execution.

---

## Final Architecture (conceptual)

USER
  |
  V
MetaMask Smart Account
  |
  V
Session Manager
  |
  V
Intent Router
  |
  V
===============================================
          INVESTMENT COMMITTEE (Agent Layer)
===============================================
  Bull Agent
  Bear Agent
  Neutral Agent
  Onchain Agent
  Yield Agent
===============================================
          A2A NEGOTIATION LAYER
===============================================
  Proposal -> CounterProposal -> RiskChallenge -> Revision -> Voting
===============================================
        PORTFOLIO DECISION ENGINE
===============================================
  Portfolio Constructor
  Risk Validator
  Compliance Validator
===============================================
          EXECUTION LAYER
===============================================
  Execution Agent
  MetaMask Smart Accounts
  1Shot Relayer
===============================================
           AUTONOMOUS LOOP
===============================================
  Rebalance Trigger
  Market Event Trigger
  Risk Trigger

---

## Key Architectural Improvements (why they matter)

- Session Manager: persists user risk profile, history, and spending limits so decisions are stateful across runs and Smart Account permissions are meaningful.
- Onchain Agent: reads on-chain signals (whale flows, DEX volume, TVL, stablecoin inflows) to produce signals unavailable to off-chain-only systems.
- Structured A2A Negotiation: proposals, counter-proposals, reasoned rejections and revisions passed as formal messages between agents; this explicitly demonstrates coordination.
- Rebalance Triggers (not separate monitor): triggers re-inject intents into the pipeline for a cleaner autonomous loop.
- x402 / ERC-7710 Payments: enable micropayments for premium data used by the Onchain Agent (improves prize eligibility).

---

## Component Details

- Session Manager
  - Persists: risk profile, budget, maximum trade, history of decisions and votes, opt-in toggles (auto rebalance).
  - Sample schema:

```json
{
  "risk":"moderate",
  "investment":500,
  "max_trade":100,
  "history":[]
}
```

- Intent Router
  - Turns user intent and session data into structured tasks for the committee (e.g., build allocation for $500, moderate risk, 6-month horizon).

- Agent Layer
  - Bull Agent: seeks upside; proposes aggressive allocations.
  - Bear Agent: protects capital; vetoes or reduces exposure when risk rises.
  - Neutral Agent: provides compromise proposals and tie-breaking votes.
  - Onchain Agent: ingests on-chain telemetry (wallet flows, DEX volume, TVL) and premium data (via paid feeds/x402 if needed).
  - Yield Agent: finds yield opportunities across lending, staking, vaults.

- A2A Negotiation Layer
  - Message types: Proposal, CounterProposal, RiskChallenge, Revision, Vote, Rationale.
  - Flow: proposal -> challenge/reject -> revision -> vote -> final decision.

- Portfolio Decision Engine
  - Inputs: all agent proposals, onchain signals, session constraints
  - Outputs: proposed allocation object and confidence/risk metadata.

- Execution Layer
  - Execution Agent composes transactions respecting session limits (max trade, slippage) and uses 1Shot Relayer + Smart Accounts for permissioned, UX-friendly execution.

---

## A2A Protocol (example messages)

- Proposal:
  - { from: "Bull", allocation: {ETH:70, USDC:30}, rationale: "ETF inflows" }
- CounterProposal:
  - { from: "Bear", action: "REJECT", reason: "concentration risk", suggested_revision: {ETH:50, BTC:20, USDC:30} }
- Vote:
  - { from: "Neutral", vote: "APPROVE", reasons: ["diversified", "within risk limits"] }

Structured messages allow reproducible debate logs for judges to inspect.

---

## Frontend Design and Pages

Design principle: Bloomberg Terminal meets ChatGPT — dense data + clear debate timeline and actions.

- Landing Page
  - Hero: "Your Personal AI Investment Committee"
  - CTA: Connect Wallet

- Dashboard
  - Portfolio value, change %, allocation cards, quick actions (rebalance, withdraw)

- Committee Live View (demo centerpiece)
  - Live scrolling debate: each agent's latest message, proposal, and vote
  - UI: timeline with message bubbles, color-coded agents, expand-to-read rationale

- Strategy Page
  - Form: investment amount, risk profile, horizon
  - Start committee (kick off debate)

- Execution Page
  - Shows: proposed allocation, expected yield, risk score
  - Button: Execute (opens MetaMask Smart Account approval flow)

- Governance Page
  - Manage Smart Account permissions: Max capital, max single trade, auto rebalance toggle

UX notes:
- Show structured proposal diff views (before/after allocation)
- Allow live rewind of debate log for judges
- Use micro-animations for proposals and vote results (Framer Motion)

---

## Demo Workflow (concise steps)

1. Connect MetaMask.
2. Create Smart Account (grant bounded permissions: e.g. max $500, max trade $100, slippage 2%).
3. Set strategy: Moderate Risk, $500 budget, 6-month horizon.
4. Committee starts: Live A2A negotiation and revision.
5. Vote passes; Execution Agent submits through 1Shot Relayer.
6. Transaction relayed -> Smart Account -> Blockchain; gas paid via stablecoin if configured.
7. Portfolio appears on Dashboard.
8. Rebalance triggers on drift or market events; new intent flows through the pipeline.

---

## Tech Stack

- Frontend: Next.js, Tailwind CSS, shadcn/ui, Framer Motion.
- Agent Orchestration: LangGraph (or similar orchestration layer), Venice AI for reasoning.
- Blockchain: MetaMask Smart Accounts Kit, 1Shot Relayer; x402 / ERC-7710 for micropayments.
- Data: DefiLlama, CoinGecko; optional premium feeds via x402.
- Database: Supabase (session data, proposals, audit logs).
- Deployment: Vercel (frontend), serverless functions for brokered calls and webhook handlers.

---

## Prize Track Strategy

Primary targets (high probability):
- Best Agent — demonstrate multiple specialized agents + Venice AI integration.
- Best A2A Coordination — structured proposals, counter-proposals, voting, and logs.
- Best Use of Venice AI — Venice used across market analysis, debate generation, and voting rationale.

Secondary targets:
- Best Use of 1Shot Relayer — show relayed transactions and Smart Account upgrade.
- Best x402 + ERC-7710 — add a small x402 micropayment flow: Execution Agent or Onchain Agent pays for premium signals.

This approach gives exposure to most of the hackathon prize pool with minimal extra work.

---

## Implementation Next Steps (recommended)

1. Implement Session Manager tables in Supabase and an API to persist session state.
2. Wire MetaMask Smart Account flows and implement bounded permission UI.
3. Implement a simple A2A message bus (queue in DB or pub/sub) to pass Proposal/CounterProposal messages.
4. Integrate Venice AI for each agent's analysis and proposal generation.
5. Add Onchain Agent feeds (DefiLlama + optional premium feeds via x402) and a simple rule-based parser for signals.
6. Build Committee Live View and a demo script that runs through a full debate -> vote -> execute flow.

---

## Files and Logs

Keep an auditable log of all A2A messages and vote results (store in DB). Judges will expect to inspect debate transcripts.

---

## Contact / Notes

This README is intended as the product and architecture blueprint for the hackathon pitch and implementation. If you want, I can scaffold the Next.js frontend layout, the Supabase schema for the Session Manager and message bus, or example LangGraph flows for the Agent orchestration.

---

Created for the Sentinel AI: Autonomous Investment Committee concept.
