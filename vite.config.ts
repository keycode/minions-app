import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Cuando la app pida algo que empiece por '/api', Vite lo redirigirá
      '/api': {
        target: 'https://minion.globalsmartiot.es', // Servidor real
        changeOrigin: true, // Necesario para evitar problemas de host virtual
        rewrite: (path) => path.replace(/^\/api/, ''), // Quita '/api' antes de enviar
      },
    },
  },
})