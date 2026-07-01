import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/users': 'http://localhost:3000',
      '/employees': 'http://localhost:3000',
      '/departments': 'http://localhost:3000',
      '/projects': 'http://localhost:3000',
      '/works-on': 'http://localhost:3000',
      '/dependents': 'http://localhost:3000',
      '/reports': 'http://localhost:3000',
      '/admin': 'http://localhost:3000',
      '/health': 'http://localhost:3000',
    },
  },
})
