import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import Loading from '../components/Loading'

export default function Landing() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  function handleConnect() {
    setLoading(true)
    // simulate elegant 2s loading
    setTimeout(() => {
      setLoading(false)
      navigate('/dashboard')
    }, 2000)
  }

  return (
    <div className="page-root">
      {loading && <Loading />}
      <header className="site-header">
        <div className="brand">Sentinel AI</div>
        <nav className="nav-actions">
          <button className="btn btn-ghost">View Demo</button>
        </nav>
      </header>

      <main className="container">
        <Hero onConnect={handleConnect} />

        <section className="how-it-works">
          <h3>How It Works</h3>
          <ol>
            <li>Connect Wallet</li>
            <li>Set Risk Profile</li>
            <li>AI Committee Debates</li>
            <li>Portfolio Executes</li>
            <li>Autonomous Rebalancing</li>
          </ol>
        </section>

        <section className="committee">
          <h3>AI Committee</h3>
          <div className="agent-grid">
            <div className="agent-card">Bull Agent</div>
            <div className="agent-card">Bear Agent</div>
            <div className="agent-card">Neutral Agent</div>
            <div className="agent-card">Onchain Agent</div>
            <div className="agent-card">Yield Agent</div>
          </div>
        </section>

        <section className="features">
          <h3>Features</h3>
          <ul>
            <li>Multi Agent Intelligence</li>
            <li>Real-Time Portfolio Monitoring</li>
            <li>Smart Account Automation</li>
            <li>Autonomous Rebalancing</li>
            <li>Institutional Risk Controls</li>
          </ul>
        </section>
      </main>

      <footer className="site-footer">
        <div>© {new Date().getFullYear()} Sentinel AI — Institutional grade AI investing</div>
      </footer>
    </div>
  )
}
