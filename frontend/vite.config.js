import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/react-router/') || id.includes('/react-router-dom/')) {
              return 'react-vendor';
            }
            if (id.includes('pdfjs-dist') || id.includes('react-pdf')) {
              return 'pdfjs-vendor';
            }
            if (id.includes('pdf-lib')) {
              return 'pdf-lib-vendor';
            }
            return 'vendor';
          }
        }
      }
    }
  }
})
