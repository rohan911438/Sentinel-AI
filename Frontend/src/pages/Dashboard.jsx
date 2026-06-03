import React from 'react'

export default function Dashboard() {
  return (
    <div className="dashboard-root">
      <header className="dash-header">
        <div className="brand">Sentinel AI</div>
      </header>
      <main className="dash-main">
        <h1>Dashboard</h1>
        <p className="muted">Welcome to your simulated Sentinel AI dashboard.</p>
        <div className="dash-cards">
          <div className="card">Portfolio Value<br/><strong>$1,234,567</strong></div>
          <div className="card">Daily P&L<br/><strong>+0.42%</strong></div>
          <div className="card">Active Agents<br/><strong>5</strong></div>
        </div>
      </main>
    </div>
  )
}
