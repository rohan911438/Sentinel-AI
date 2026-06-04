
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';

export default function Landing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  function handleConnect() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 2000);
  }

  const onConnect = handleConnect;

  return (
    <>
      {loading && <Loading />}
      <div className="orbit"></div>
  <div className="wrap">
    <header className="topbar">
      <div className="brand"><span className="brand-mark"></span>Sentinel AI</div>
      <nav className="nav" aria-label="Primary">
        <a href="#how-it-works">How It Works</a>
        <a href="#committee">Committee</a>
        <a href="#signals">Signals</a>
        <a href="#features">Features</a>
      </nav>
      <div className="button-row">
        <button className="button ghost" id="demo-top">View Demo</button>
        <button className="button primary" onClick={onConnect}>Connect Wallet</button>
      </div>
    </header>

    <section className="hero">
      <div className="hero-copy panel">
        <span className="eyebrow">Institutional AI Platform</span>
        <h1>Your Autonomous AI Investment Committee</h1>
        <p className="subhead">A team of AI agents that debate, vote, and execute investment decisions on your behalf. Sentinel AI combines market context, onchain flows, risk controls, and execution logic into a single operating layer for modern portfolios.</p>

        <div className="hero-actions">
          <button className="button primary" id="connect">Connect Wallet</button>
          <button className="button ghost" id="demo">View Demo</button>
        </div>

        <div className="hero-metrics">
          <div className="metric"><strong>5 Agents</strong><span>Parallel committee analysis across momentum, risk, flow, yield, and balance.</span></div>
          <div className="metric"><strong>24/7</strong><span>Continuous monitoring of volatility, liquidity, and position drift.</span></div>
          <div className="metric"><strong>99.4%</strong><span>Execution reliability across automated portfolio actions and rebalances.</span></div>
        </div>
      </div>

      <div className="hero-visual panel" aria-hidden="true">
        <div className="visual-stack">
          <div className="visual-header">
            <strong>AI Committee</strong>
            <span className="live">Live Debate</span>
          </div>

          <div className="orbital">
            <div className="ring"></div>
            <div className="ring r2"></div>
            <div className="node bull"></div>
            <div className="node bear"></div>
            <div className="node neutral"></div>
            <div className="node onchain"></div>
            <div className="node yield"></div>

            <div className="visual-card">
              <h3>Committee Readout</h3>
              <div className="mini-grid">
                <div className="mini"><b>Bull</b><span>Momentum expansion and breakout confirmation.</span></div>
                <div className="mini"><b>Bear</b><span>Volatility elevated. Hedge ratios tightening.</span></div>
                <div className="mini"><b>Neutral</b><span>Vote balanced. Preserve capital efficiency.</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div className="marquee">
      <div className="marquee-track">
        <span><strong>Real-time committee debate</strong> • Agent consensus before execution</span>
        <span><strong>Onchain flow intelligence</strong> • Wallet clusters, liquidity, routing</span>
        <span><strong>Risk-aware rebalancing</strong> • Drawdown, volatility, concentration checks</span>
        <span><strong>Autonomous execution</strong> • Built-in guardrails for every action</span>
        <span><strong>Real-time committee debate</strong> • Agent consensus before execution</span>
        <span><strong>Onchain flow intelligence</strong> • Wallet clusters, liquidity, routing</span>
        <span><strong>Risk-aware rebalancing</strong> • Drawdown, volatility, concentration checks</span>
        <span><strong>Autonomous execution</strong> • Built-in guardrails for every action</span>
      </div>
    </div>

    <main className="content">
      <section className="section" id="how-it-works">
        <div className="section-head">
          <div>
            <h2>How It Works</h2>
            <p className="lead">The platform ingests market context, lets each agent argue a distinct thesis, and converts the final committee vote into guarded execution actions.</p>
          </div>
        </div>
        <div className="step-list">
          <article className="step-card"><strong>Connect Wallet</strong><p>Login is simulated here for preview. In production, the wallet becomes the portfolio identity layer.</p></article>
          <article className="step-card"><strong>Set Risk Profile</strong><p>Define volatility bands, drawdown ceilings, and allocation constraints before any action can be executed.</p></article>
          <article className="step-card"><strong>Agents Debate</strong><p>Momentum, risk, balance, flow, and yield agents each publish a thesis with evidence and confidence scoring.</p></article>
          <article className="step-card"><strong>Committee Votes</strong><p>A weighted vote produces the final portfolio instruction, with dissent captured for auditability.</p></article>
          <article className="step-card"><strong>Portfolio Executes</strong><p>Orders route through a controlled execution layer with slippage checks and post-trade validation.</p></article>
        </div>
      </section>

      <section className="section" id="committee">
        <div className="section-head">
          <div>
            <h2>AI Committee</h2>
            <p className="lead">Each agent owns a narrow mandate. That separation keeps the system explainable and prevents any single signal from dominating the portfolio.</p>
          </div>
        </div>
        <div className="grid-5">
          <article className="agent-card"><div className="committee-name"><strong>Bull Agent</strong><span>Momentum</span></div><p>Looks for breakouts, trend continuation, and high-conviction growth setups.</p><div className="vote">Vote: Buy</div></article>
          <article className="agent-card"><div className="committee-name"><strong>Bear Agent</strong><span>Risk</span></div><p>Raises hedges when volatility expands or correlation spikes across holdings.</p><div className="vote amber">Vote: Hedge</div></article>
          <article className="agent-card"><div className="committee-name"><strong>Neutral Agent</strong><span>Balance</span></div><p>Prevents overreaction by moderating extremes and enforcing portfolio discipline.</p><div className="vote">Vote: Hold</div></article>
          <article className="agent-card"><div className="committee-name"><strong>Onchain Agent</strong><span>Flow</span></div><p>Tracks wallet activity, liquidity changes, and capital rotation across venues.</p><div className="vote green">Vote: Accumulate</div></article>
          <article className="agent-card"><div className="committee-name"><strong>Yield Agent</strong><span>Income</span></div><p>Searches for efficient carry, stable yield, and capital-efficient allocations.</p><div className="vote pink">Vote: Rotate</div></article>
        </div>
      </section>

      <section className="section" id="signals">
        <div className="section-head">
          <div>
            <h2>Portfolio Signal Engine</h2>
            <p className="lead">Sentinel AI combines market price action, onchain context, and policy constraints into a single decision surface that reads like a senior investment memo.</p>
          </div>
        </div>
        <div className="timeline">
          <div className="timeline-list">
            <div className="timeline-item"><div className="timeline-time">T+00</div><div><strong>Market scan begins</strong><div className="timeline-desc">Price momentum, liquidity depth, news tone, and cross-asset context are ingested every cycle.</div></div></div>
            <div className="timeline-item"><div className="timeline-time">T+04</div><div><strong>Agent theses are generated</strong><div className="timeline-desc">Each agent produces a readable thesis, not just a raw score, so every vote can be audited later.</div></div></div>
            <div className="timeline-item"><div className="timeline-time">T+09</div><div><strong>Consensus is computed</strong><div className="timeline-desc">The committee compares conviction, confidence, and policy alignment before deciding whether to act.</div></div></div>
            <div className="timeline-item"><div className="timeline-time">T+15</div><div><strong>Execution is gated</strong><div className="timeline-desc">The final route must pass risk checks, slippage thresholds, and account constraints before it executes.</div></div></div>
          </div>

          <div className="signal-list">
            <div className="signal-row"><div><strong>Momentum strength</strong><span>Trend expansion across liquid assets</span></div><div className="signal-bar"><i style={{ width: '82%' }}></i></div></div>
            <div className="signal-row"><div><strong>Risk pressure</strong><span>Volatility clustering and drawdown watch</span></div><div className="signal-bar warn"><i style={{ width: '43%' }}></i></div></div>
            <div className="signal-row"><div><strong>Onchain inflow</strong><span>Large wallet accumulation and transfer flow</span></div><div className="signal-bar info"><i style={{ width: '67%' }}></i></div></div>
            <div className="signal-row"><div><strong>Yield opportunity</strong><span>Capital-efficient rotation into income</span></div><div className="signal-bar"><i style={{ width: '58%' }}></i></div></div>
          </div>
        </div>
      </section>

      <section className="section" id="features">
        <div className="section-head">
          <div>
            <h2>Features</h2>
            <p className="lead">The product is designed to feel like a premium institutional terminal while staying simple enough to read in one pass.</p>
          </div>
        </div>
        <div className="grid-2">
          <article className="feature-card"><strong>Multi-Agent Intelligence</strong><p>Specialized agents produce different viewpoints so the committee can balance growth, defense, and yield in a coherent process.</p></article>
          <article className="feature-card"><strong>Real-Time Portfolio Monitoring</strong><p>Account health, position drift, and market context are monitored continuously rather than only at rebalance time.</p></article>
          <article className="feature-card"><strong>Smart Account Automation</strong><p>Execution logic can react to committee votes, thresholds, and recurring policy schedules without manual intervention.</p></article>
          <article className="feature-card"><strong>Autonomous Rebalancing</strong><p>When conditions shift, the system can trim, rotate, hedge, or hold based on predefined risk rules.</p></article>
          <article className="feature-card"><strong>Institutional Risk Controls</strong><p>Concentration limits, slippage caps, and maximum exposure rules keep automation inside a governed operating range.</p></article>
          <article className="feature-card"><strong>Readable Audit Trail</strong><p>Every decision is explainable, timestamped, and structured for review by humans or downstream systems.</p></article>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>Operating Metrics</h2>
            <p className="lead">A clearer view of what Sentinel AI is designed to protect: capital, speed, and discipline.</p>
          </div>
        </div>
        <div className="stats-grid">
          <article className="metric-card"><strong>Risk-Gated</strong><p>Every trade is checked against policy constraints before execution.</p></article>
          <article className="metric-card"><strong>Fast Signal Cycle</strong><p>Debate, vote, and order generation happen in a compact decision loop.</p></article>
          <article className="metric-card"><strong>Audit Ready</strong><p>Human-readable reasoning is preserved for oversight and review.</p></article>
          <article className="metric-card"><strong>Institutional Tone</strong><p>Built to feel like a private investment desk, not a consumer dashboard.</p></article>
        </div>
      </section>
    </main>

    <footer className="footer">
      <span>© <span id="year"></span> Sentinel AI</span>
      <span>Institutional-grade autonomous investment platform</span>
    </footer>
  </div>

  <div className="overlay" id="overlay" aria-hidden="true">
    <div className="loader">
      <div className="spinner"></div>
      <h3>Connecting Sentinel Committee</h3>
      <p>Secure session initialization in progress</p>
    </div>
  </div>

  <script src="/wallet-bundle.js"></script>
  
+
    </>
  );
}
