const fs = require('fs');

const cssToAppend = `
/* Advanced Strategy Builder Styles */
.grid-3-panel {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr;
  gap: 20px;
  margin-top: 24px;
}

.glass-panel {
  background: linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 24px;
}

.agent-workspace {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.agent-thinking-card {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 12px;
  padding: 16px;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease;
}
.agent-thinking-card:hover {
  transform: translateY(-2px);
  background: rgba(255,255,255,0.02);
}

.agent-thinking-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.agent-thinking-head strong {
  font-size: 15px;
  color: #fff;
}

.agent-thinking-card p {
  margin: 0;
  font-size: 13px;
  color: var(--muted);
}

.thinking-loader {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid rgba(59,130,246,0.2);
  border-top-color: #3b82f6;
  animation: spin 1s linear infinite;
}

.allocation-card {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.alloc-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.alloc-row:last-child {
  border-bottom: none;
}

.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
}
.dot.blue { background-color: var(--accent); box-shadow: 0 0 8px var(--accent); }
.dot.green { background-color: var(--accent-2); box-shadow: 0 0 8px var(--accent-2); }
.dot.amber { background-color: var(--accent-3); box-shadow: 0 0 8px var(--accent-3); }
.dot.pink { background-color: var(--accent-4); box-shadow: 0 0 8px var(--accent-4); }

.stats-box {
  margin-top: 24px;
  background: rgba(0,0,0,0.3);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}
.stat span { color: var(--muted); }
.stat strong { font-size: 15px; }

.cta-button {
  margin-top: 24px;
  width: 100%;
  padding: 14px;
  font-size: 16px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.modal-overlay.show {
  opacity: 1;
  pointer-events: auto;
}

.modal-content {
  width: 100%;
  max-width: 480px;
  transform: scale(0.95) translateY(20px);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.modal-overlay.show .modal-content {
  transform: scale(1) translateY(0);
}

.modal-header {
  border-bottom: 1px solid rgba(255,255,255,0.08);
  padding-bottom: 16px;
  margin-bottom: 16px;
}
.modal-header h2 { margin: 0; font-size: 22px; }
.modal-header p { margin: 8px 0 0; color: var(--muted); font-size: 14px; }

.vote-summary-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vote-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 8px;
}

.vote-row strong { font-size: 15px; }

.modal-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(255,255,255,0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.final-status {
  font-size: 14px;
  color: var(--muted);
}
.final-status strong {
  color: var(--accent-2);
  letter-spacing: 0.5px;
}

@media (max-width: 1080px) {
  .grid-3-panel { grid-template-columns: 1fr; }
}
`;

fs.appendFileSync('styles.css', cssToAppend);
console.log('Appended styles to styles.css');
