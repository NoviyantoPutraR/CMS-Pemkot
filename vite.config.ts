import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core vendor libraries
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // UI components
          'vendor-ui': ['lucide-react', 'class-variance-authority', 'clsx', 'tailwind-merge'],
          // Form libraries
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          // Rich text editor (heavy)
          'vendor-editor': ['react-quill'],
          // Animation libraries (heavy)
          'vendor-animations': ['framer-motion', 'gsap'],
          // Supabase
          'vendor-supabase': ['@supabase/supabase-js'],
          // State management
          'vendor-state': ['zustand'],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 600,
  },
})

