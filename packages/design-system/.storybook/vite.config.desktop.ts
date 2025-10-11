import { resolve } from 'node:path';

import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      // Desktop-specific collision-safe token paths
      '@mimic/design-tokens/desktop': resolve(__dirname, '../../design-tokens/libs/tokens/css/tokens.css'),
      '@mimic/design-tokens/scss': resolve(__dirname, '../../design-tokens/libs/tokens/scss/tokens.scss'),
      '@mimic/design-tokens/js': resolve(__dirname, '../../design-tokens/libs/tokens/js/tokens.js'),
      '@mimic/design-tokens': resolve(__dirname, '../../design-tokens/libs/tokens/ts/tokens.ts'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Auto-import design tokens with desktop-specific overrides
        additionalData: `@import "${resolve(__dirname, '../../design-tokens/libs/tokens/scss/tokens.scss')}";`,
      },
    },
  },
  optimizeDeps: {
    include: ['@mimic/design-tokens'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'design-tokens-desktop': ['@mimic/design-tokens/desktop'],
        },
      },
    },
  },
  server: {
    port: 4402, // Desktop Storybook port
    fs: {
      allow: ['../..'],
    },
  },
  define: {
    // Desktop environment detection
    __DESKTOP_BUILD__: true,
    __PLATFORM__: '"desktop"',
  },
});
