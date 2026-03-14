import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    headers: {
      // Allow embedding Grafana dashboards in iframes
      "X-Frame-Options": "ALLOWALL",
      // Relax Content-Security-Policy to permit Grafana embedding
      "Content-Security-Policy": "frame-ancestors *;",
    },
    port: 5173, // optional, just to be explicit
  },
})
