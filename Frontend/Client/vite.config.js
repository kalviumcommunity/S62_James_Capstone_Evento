import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy Clerk API requests
      '/v1': {
        target: 'https://primary-cowbird-42.clerk.accounts.dev',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/v1/, '')
      },
      // Proxy Clerk OAuth requests
      '/oauth': {
        target: 'https://primary-cowbird-42.clerk.accounts.dev',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
