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
        manualChunks: (id) => {
          // Core React libraries - critical, load first
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
            return 'vendor-react'
          }
          // Supabase - separate chunk for API calls
          if (id.includes('@supabase')) {
            return 'vendor-supabase'
          }
          // Animation libraries - heavy, lazy load
          if (id.includes('framer-motion') || id.includes('gsap')) {
            return 'vendor-animations'
          }
          // Rich text editor - heavy, only load when needed
          if (id.includes('react-quill')) {
            return 'vendor-editor'
          }
          // Form libraries
          if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
            return 'vendor-forms'
          }
          // UI utilities
          if (id.includes('lucide-react') || id.includes('class-variance-authority') || id.includes('clsx') || id.includes('tailwind-merge')) {
            return 'vendor-ui'
          }
          // State management
          if (id.includes('zustand')) {
            return 'vendor-state'
          }
          // Charts library
          if (id.includes('recharts')) {
            return 'vendor-charts'
          }
          // Other node_modules - return undefined untuk default chunking
          if (id.includes('node_modules')) {
            return 'vendor-other'
          }
          // Return undefined untuk source files (akan di-handle oleh default chunking)
          return undefined
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 600,
    // Enable minification
    minify: 'esbuild',
    // Optimize asset handling
    assetsInlineLimit: 4096, // Inline small assets (< 4KB)
  },
})

