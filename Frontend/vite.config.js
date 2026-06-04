import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        committee: resolve(__dirname, 'committee.html'),
        portfolio: resolve(__dirname, 'portfolio.html'),
        strategy: resolve(__dirname, 'strategy-builder.html'),
        transactions: resolve(__dirname, 'transactions.html'),
        governance: resolve(__dirname, 'governance.html'),
        permissions: resolve(__dirname, 'permission-center.html'),
        agentPermissions: resolve(__dirname, 'agent-permissions.html'),
        execution: resolve(__dirname, 'execution-center.html'),
        budget: resolve(__dirname, 'research-budget.html'),
        enforcement: resolve(__dirname, 'enforcement.html'),
        settings: resolve(__dirname, 'settings.html'),
        static: resolve(__dirname, 'static.html')
      }
    }
  }
})
