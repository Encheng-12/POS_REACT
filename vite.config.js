import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ['aws-pos.encheng.store'],
  },
  resolve: {
    alias: {
      './pages/resources': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '../pages/resources': fileURLToPath(new URL('./src/pages', import.meta.url)),
    },
  },
})
