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
          // Admin-only libraries - hanya di-load untuk admin routes (lazy loaded)
          // React Quill dan Recharts hanya digunakan di admin panel
          if (id.includes('node_modules/react-quill') ||
              id.includes('node_modules/recharts')) {
            return 'vendor-admin'
          }
          
          // React Core + Critical Utilities - harus di chunk yang sama
          // Zustand digunakan di awal (useAuthStore), jadi harus di-load bersama React
          // clsx, tailwind-merge, CVA digunakan oleh banyak React components
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router/') ||
              id.includes('node_modules/react-router-dom/') ||
              id.includes('node_modules/zustand') ||
              id.includes('node_modules/clsx') ||
              id.includes('node_modules/tailwind-merge') ||
              id.includes('node_modules/class-variance-authority')) {
            return 'vendor-react-core'
          }
          
          // React UI Libraries - untuk animations dan icons
          // Framer Motion digunakan di public pages juga, tapi bisa di-lazy load nanti
          if (id.includes('node_modules/framer-motion') ||
              id.includes('node_modules/lucide-react') ||
              id.includes('node_modules/react-icons')) {
            return 'vendor-react-ui'
          }
          
          // React Form Libraries - untuk form handling
          // React Hook Form dan Zod sering digunakan bersama
          if (id.includes('node_modules/react-hook-form') ||
              id.includes('node_modules/@hookform') ||
              id.includes('node_modules/zod')) {
            return 'vendor-forms'
          }
          
          // Non-critical Utilities - bisa di-load terpisah
          // Sonner (toast) tidak critical untuk initial load
          if (id.includes('node_modules/sonner')) {
            return 'vendor-utils'
          }
          
          // Supabase - separate chunk (tidak dependen pada React)
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase'
          }
          
          // GSAP - animation library yang tidak dependen pada React
          if (id.includes('node_modules/gsap')) {
            return 'vendor-animations'
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
    // CommonJS options untuk menghindari circular dependency issues
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
})

