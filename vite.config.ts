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
          // CRITICAL: React dan react-dom HARUS di chunk yang sama
          // Jangan pernah memisahkan mereka
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router/') ||
              id.includes('node_modules/react-router-dom/')) {
            return 'vendor-react'
          }
          
          // Supabase - separate chunk for API calls
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase'
          }
          
          // Animation libraries - heavy, lazy load
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/gsap')) {
            return 'vendor-animations'
          }
          
          // Rich text editor - heavy, only load when needed
          if (id.includes('node_modules/react-quill')) {
            return 'vendor-editor'
          }
          
          // Form libraries
          if (id.includes('node_modules/react-hook-form') || 
              id.includes('node_modules/@hookform') || 
              id.includes('node_modules/zod')) {
            return 'vendor-forms'
          }
          
          // UI utilities
          if (id.includes('node_modules/lucide-react') || 
              id.includes('node_modules/class-variance-authority') || 
              id.includes('node_modules/clsx') || 
              id.includes('node_modules/tailwind-merge')) {
            return 'vendor-ui'
          }
          
          // State management
          if (id.includes('node_modules/zustand')) {
            return 'vendor-state'
          }
          
          // Charts library
          if (id.includes('node_modules/recharts')) {
            return 'vendor-charts'
          }
          
          // Other node_modules - let Vite handle default chunking
          // Jangan force ke vendor-other karena bisa memisahkan dependencies
          if (id.includes('node_modules')) {
            return undefined
          }
          
          // Return undefined untuk source files
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

