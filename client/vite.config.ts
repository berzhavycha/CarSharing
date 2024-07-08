import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/core': path.resolve(__dirname, './src/core'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/router': path.resolve(__dirname, './src/router'),
      '@/layouts': path.resolve(__dirname, './src/layouts'),
      '@/helpers': path.resolve(__dirname, './src/helpers'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/context': path.resolve(__dirname, './src/context'),
      '@/api': path.resolve(__dirname, './src/api'),
      '@/app': path.resolve(__dirname, './src/app'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/styles': path.resolve(__dirname, './src/styles'),
      '@/regex': path.resolve(__dirname, './src/regex'),
    },
  },
})
