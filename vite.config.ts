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
          // CRITICAL: React dan SEMUA React-dependent libraries HARUS di chunk yang sama
          // Ini mencegah error "Cannot set properties of undefined" dan "Cannot read properties of undefined"
          // Semua library yang menggunakan React (forwardRef, createElement, dll) harus di chunk yang sama
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router/') ||
              id.includes('node_modules/react-router-dom/') ||
              // React-dependent UI libraries
              id.includes('node_modules/lucide-react') ||
              id.includes('node_modules/class-variance-authority') ||
              id.includes('node_modules/clsx') ||
              id.includes('node_modules/tailwind-merge') ||
              // React-dependent form libraries
              id.includes('node_modules/react-hook-form') ||
              id.includes('node_modules/@hookform') ||
              // React-dependent chart library
              id.includes('node_modules/recharts') ||
              // React-dependent animation library (used in many components)
              id.includes('node_modules/framer-motion') ||
              // React-dependent rich text editor
              id.includes('node_modules/react-quill') ||
              // React icons
              id.includes('node_modules/react-icons')) {
            return 'vendor-react'
          }
          
          // Supabase - separate chunk (tidak dependen pada React)
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase'
          }
          
          // GSAP - animation library yang tidak dependen pada React
          if (id.includes('node_modules/gsap')) {
            return 'vendor-animations'
          }
          
          // Zod - validation library (tidak dependen pada React, tapi sering digunakan dengan react-hook-form)
          // Masukkan ke vendor-react untuk menghindari masalah
          if (id.includes('node_modules/zod')) {
            return 'vendor-react'
          }
          
          // State management (Zustand tidak dependen pada React secara langsung, tapi sering digunakan dengan React)
          if (id.includes('node_modules/zustand')) {
            return 'vendor-react'
          }
          
          // Sonner - toast library (React-dependent)
          if (id.includes('node_modules/sonner')) {
            return 'vendor-react'
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

