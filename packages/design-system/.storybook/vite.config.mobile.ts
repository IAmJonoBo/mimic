import { resolve } from 'node:path';

import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      // Mobile-specific collision-safe token paths
      '@mimic/design-tokens/mobile': resolve(
        __dirname,
        '../../design-tokens/libs/tokens/react-native/theme.ts'
      ),
      '@mimic/design-tokens/json': resolve(
        __dirname,
        '../../design-tokens/libs/tokens/json/tokens.json'
      ),
      '@mimic/design-tokens': resolve(
        __dirname,
        '../../design-tokens/libs/tokens/react-native/theme.ts'
      ),
    },
  },
  optimizeDeps: {
    include: ['@mimic/design-tokens'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'design-tokens-mobile': ['@mimic/design-tokens/mobile'],
        },
      },
    },
  },
  server: {
    port: 4401, // Mobile Storybook port
    fs: {
      allow: ['../..'],
    },
  },
  define: {
    // Mobile environment detection
    __MOBILE_BUILD__: true,
    __PLATFORM__: '"mobile"',
  },
});
