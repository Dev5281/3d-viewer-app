import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Expose environment variables to the client
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
  },
})
