"use client";
import React, { useState } from 'react';
import { useCommitteeStore } from '@/state/committee-store';

export default function StrategyBuilder() {
  const { timeline, decision, isRunning, activeAgent, generateStrategy } = useCommitteeStore();
  const [amount, setAmount] = useState(500000);
  const [risk, setRisk] = useState<'low' | 'moderate' | 'high'>('moderate');
  const [horizon, setHorizon] = useState('6 months');
  
  const handleGenerate = () => {
    generateStrategy({
      investmentAmount: amount,
      riskLevel: risk,
      investmentHorizon: horizon
    });
  };

  const isComplete = decision !== null;

  return (
    <div className="dash-shell">
      <div className="dash-layout">
        <aside className="sidebar">
          <div className="brand">Sentinel AI</div>
          <div className="sidebar-section">
            <p className="sidebar-label">Navigation</p>
            <nav className="nav-list">
              <a className="nav-link active" href="#">Strategy Builder</a>
            </nav>
          </div>
        </aside>
        <div className="main">
          <section className="page active">
            <div className="page-header">
              <div>
                <span className="eyebrow">Advanced AI Setup</span>
                <h1 className="title">Institutional Strategy Builder.</h1>
                <p className="subtitle">Design the mandate while the AI committee parallelizes analysis and consensus in real-time.</p>
              </div>
            </div>
            
            <div className="grid-3-panel">
              {/* Left Panel */}
              <div className="form-card glass-panel">
                <div className="page-header"><div><strong>User Inputs</strong></div></div>
                <div className="settings-group">
                  <div className="setting-control">
                    <div><label>Investment Amount ($)</label></div>
                    <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} />
                  </div>
                  <div className="setting-control">
                    <div><label>Risk Level</label></div>
                    <select value={risk} onChange={e => setRisk(e.target.value as any)}>
                      <option value="low">Low</option>
                      <option value="moderate">Moderate</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <button onClick={handleGenerate} disabled={isRunning} className="button primary cta-button">
                  {isRunning ? 'Processing...' : 'Generate Strategy'}
                </button>
              </div>

              {/* Center Panel */}
              <div className="table-card glass-panel agent-workspace">
                <div className="page-header">
                  <div><strong>AI Committee Workspace</strong></div>
                  {isRunning && <div className="live-badge">Processing</div>}
                </div>
                
                <div className="activity-feed">
                  <h4>Activity Feed</h4>
                  <div className="timeline-list">
                    {timeline.map((event, i) => (
                      <div key={i} className="timeline-event animate-in">
                        <strong>{event.agent} ({event.action})</strong>
                        <p>{event.reason}</p>
                      </div>
                    ))}
                  </div>
                  {isRunning && activeAgent && (
                    <div className="timeline-event thinking">
                      <strong>{activeAgent}</strong>
                      <p>Thinking... <span className="thinking-loader"></span></p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel */}
              <div className="form-card glass-panel">
                <div className="page-header"><div><strong>Final Recommendation</strong></div></div>
                
                {isComplete ? (
                  <>
                    <div className="allocation-card">
                      <div className="alloc-row"><span>ETH</span><strong>{decision.finalAllocation.ETH}%</strong></div>
                      <div className="alloc-row"><span>BTC</span><strong>{decision.finalAllocation.BTC}%</strong></div>
                      <div className="alloc-row"><span>USDC</span><strong>{decision.finalAllocation.USDC}%</strong></div>
                      <div className="alloc-row"><span>AAVE</span><strong>{decision.finalAllocation.AAVE}%</strong></div>
                    </div>
                    
                    <div className="stats-box">
                      <div className="stat"><span>Expected Return</span><strong>{decision.expectedReturn}%</strong></div>
                      <div className="stat"><span>Risk Score</span><strong>{decision.riskScore}</strong></div>
                      <div className="stat"><span>Confidence</span><strong>{decision.confidenceScore}%</strong></div>
                    </div>
                    
                    <button className="button primary cta-button">Execute Strategy</button>
                  </>
                ) : (
                  <div className="empty-state">Waiting for consensus...</div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
