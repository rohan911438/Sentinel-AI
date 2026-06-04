const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const template = `          <nav class="nav-list">
            <a class="nav-link" href="dashboard.html"><span>Dashboard</span><small>Overview</small></a>
            <a class="nav-link" href="committee.html"><span>Investment Committee</span><small>Live debate</small></a>
            <a class="nav-link" href="portfolio.html"><span>Portfolio</span><small>Holdings</small></a>
            <a class="nav-link" href="strategy-builder.html"><span>Strategy Builder</span><small>Compose</small></a>
            <a class="nav-link" href="transactions.html"><span>Transactions</span><small>Ledger</small></a>
            <a class="nav-link" href="governance.html"><span>Governance</span><small>Permissions</small></a>
            <a class="nav-link" href="permission-center.html"><span>Permission Center</span><small>Limits</small></a>
            <a class="nav-link" href="agent-permissions.html"><span>Agent Permissions</span><small>Delegation</small></a>
            <a class="nav-link" href="execution-center.html"><span>Execution Center</span><small>Simulations</small></a>
            <a class="nav-link" href="research-budget.html"><span>Research Budget</span><small>x402 Agent Intel</small></a>
            <a class="nav-link" href="enforcement.html"><span>Enforcement Logs</span><small>Rules</small></a>
            <a class="nav-link" href="settings.html"><span>Settings</span><small>Preferences</small></a>
          </nav>`;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Regex to find <nav class="nav-list"> ... </nav>
  const navRegex = /<nav class="nav-list">[\s\S]*?<\/nav>/;
  
  if (navRegex.test(content)) {
    // Replace with template, then make the current page active
    let newNav = template;
    const currentLinkRegex = new RegExp(`href="${file}"`);
    newNav = newNav.replace(`class="nav-link" href="${file}"`, `class="nav-link active" href="${file}"`);
    
    content = content.replace(navRegex, newNav);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated nav in ${file}`);
  }
});
