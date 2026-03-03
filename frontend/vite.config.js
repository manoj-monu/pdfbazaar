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
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('pdf-lib')) {
              return 'pdf-lib-vendor';
            }
            if (id.includes('jimp') || id.includes('lucide-react') || id.includes('react-dropzone')) {
              return 'deps-vendor';
            }
            return 'vendor';
          }
        }
      }
    }
  }
})
