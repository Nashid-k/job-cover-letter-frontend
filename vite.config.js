import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Target modern browsers for better optimization
    target: 'es2015',
    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
        passes: 2
      },
      mangle: true,
      format: {
        comments: false
      }
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Granular chunk splitting for better caching
        manualChunks: {
          // Core React libraries
          'vendor-react': ['react', 'react-dom'],
          // Animation library (large)
          'vendor-framer': ['framer-motion'],
          // UI components
          'vendor-ui': ['lucide-react', 'sonner'],
          // AI and markdown (only loaded when needed)
          'vendor-ai': ['openai', 'react-markdown'],
          // Chart library (only for ChatWidget)
          'vendor-charts': ['chart.js', 'react-chartjs-2']
        },
        // Better file naming for caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Enable source maps for debugging if needed (disable in production)
    sourcemap: false
  },
  // Production optimizations
  esbuild: {
    // Remove console in production
    drop: ['console', 'debugger']
  }
})
