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
          // CRITICAL: React dan semua React-dependent libraries HARUS di chunk yang sama
          // Ini mencegah error "Cannot read properties of undefined (reading 'forwardRef')"
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router/') ||
              id.includes('node_modules/react-router-dom/') ||
              // React-dependent UI libraries - HARUS di chunk yang sama dengan React
              id.includes('node_modules/lucide-react') ||
              id.includes('node_modules/class-variance-authority') ||
              id.includes('node_modules/clsx') ||
              id.includes('node_modules/tailwind-merge')) {
            return 'vendor-react'
          }
          
          // Supabase - separate chunk for API calls
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase'
          }
          
          // Animation libraries - heavy, lazy load (framer-motion depends on React but can be lazy loaded)
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/gsap')) {
            return 'vendor-animations'
          }
          
          // Rich text editor - heavy, only load when needed (react-quill depends on React)
          if (id.includes('node_modules/react-quill')) {
            return 'vendor-editor'
          }
          
          // Form libraries (react-hook-form depends on React)
          if (id.includes('node_modules/react-hook-form') || 
              id.includes('node_modules/@hookform') || 
              id.includes('node_modules/zod')) {
            return 'vendor-forms'
          }
          
          // State management
          if (id.includes('node_modules/zustand')) {
            return 'vendor-state'
          }
          
          // Charts library (recharts depends on React)
          if (id.includes('node_modules/recharts')) {
            return 'vendor-charts'
          }
          
          // Other node_modules - let Vite handle default chunking
          // Vite akan otomatis mengelompokkan dependencies yang saling terkait
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

