import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../backend/public',
    emptyOutDir: false, // Keep existing files in public
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name][extname]', // Preserve file names without hash
      },
    },
  },
})
