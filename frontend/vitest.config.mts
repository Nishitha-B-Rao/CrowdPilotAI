import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    css: false,
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') },
      { find: /\.css$/, replacement: path.resolve(__dirname, './__mocks__/styleMock.ts') }
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    },
    server: {
      deps: {
        inline: true
      }
    }
  }
})
