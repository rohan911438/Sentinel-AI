import React from 'react'

function AgentBubble({ name }) {
  return (
    <div className="agent-bubble">
      <div className="agent-name">{name}</div>
      <div className="agent-message" />
    </div>
  )
}

export default function Hero({ onConnect }) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <h1>Your Autonomous AI Investment Committee</h1>
        <p className="sub">A team of AI agents that debate, vote, and execute investment decisions on your behalf.</p>
        <div className="hero-ctas">
          <button className="btn btn-primary" onClick={onConnect}>Connect Wallet</button>
          <button className="btn btn-ghost">View Demo</button>
        </div>
      </div>

      <div className="hero-visual" aria-hidden>
        <div className="glass-panel">
          <div className="agents-row">
            <AgentBubble name="Bull Agent" />
            <AgentBubble name="Bear Agent" />
            <AgentBubble name="Neutral Agent" />
            <AgentBubble name="Onchain Agent" />
            <AgentBubble name="Yield Agent" />
          </div>
        </div>
      </div>
    </section>
  )
}
