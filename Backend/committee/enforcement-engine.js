const enforcementLogs = [];

class EnforcementEngine {
  constructor() {
    this.logs = enforcementLogs;
  }

  logAction(status, agent, action, reason, details) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      status,
      agent,
      action,
      reason,
      details
    };
    this.logs.unshift(logEntry); // prepend to top
    console.log(`[ENFORCEMENT] ${status} - ${agent} - ${reason}`);
    return logEntry;
  }

  validateDecision(decision, activeDelegations) {
    if (!activeDelegations || activeDelegations.length === 0) {
      this.logAction('REJECTED', 'Execution Agent', 'Execute Trade', 'No active delegations found. Smart Account permissions not configured.', decision);
      return { status: 'REJECTED', reason: 'No active delegations.' };
    }

    const execAgent = activeDelegations.find(a => a.agentName === 'Execution Agent');
    if (!execAgent) {
      this.logAction('REJECTED', 'Execution Agent', 'Execute Trade', 'Execution Agent delegation missing.', decision);
      return { status: 'REJECTED', reason: 'Execution Agent delegation missing.' };
    }

    // Check expiry
    const expiryDate = new Date(execAgent.expiry);
    if (new Date() > expiryDate) {
      this.logAction('REJECTED', 'Execution Agent', 'Execute Trade', 'Execution Agent permissions have expired.', decision);
      return { status: 'REJECTED', reason: 'Permissions expired.' };
    }

    // Calculate total spend
    let totalSpend = 0;
    if (decision.allocation && Array.isArray(decision.allocation)) {
      totalSpend = decision.allocation.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    }

    // Check daily cap limit from execution agent (e.g. allowedAmount format "100 USDC")
    // Parse the allowed amount naively
    const match = String(execAgent.allowedAmount).match(/(\d+)/);
    const maxLimit = match ? parseInt(match[1], 10) : 0;

    if (totalSpend > maxLimit) {
      this.logAction('REJECTED', 'Execution Agent', 'Execute Trade', `Trade size ($${totalSpend}) exceeds Execution Agent maximum limit ($${maxLimit}).`, decision);
      return { status: 'REJECTED', reason: `Limit exceeded. Max: $${maxLimit}, Attempted: $${totalSpend}` };
    }

    // Check risk bounds
    if (decision.riskLevel > 50) {
      this.logAction('ESCALATED', 'Execution Agent', 'Execute Trade', `Risk level (${decision.riskLevel}/100) exceeds safety threshold. Committee consensus overridden.`, decision);
      return { status: 'ESCALATED', reason: `Risk threshold breached.` };
    }

    // Approved
    this.logAction('APPROVED', 'Execution Agent', 'Execute Trade', `Within delegation bounds. Trade size $${totalSpend} <= $${maxLimit}.`, decision);
    return { status: 'APPROVED', reason: 'Within delegation bounds.' };
  }

  getLogs() {
    return this.logs;
  }
}

module.exports = { EnforcementEngine, enforcementLogs };
