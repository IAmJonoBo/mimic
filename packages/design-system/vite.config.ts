import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default defineConfig(() => {
  return {
    build: {
      target: 'es2024',
      lib: {
        entry: './src/index.ts',
        formats: ['es', 'cjs'],
        fileName: format => `index.qwik.${format === 'es' ? 'mjs' : 'cjs'}`,
      },
    },
    plugins: [
      qwikVite({
        client: {
          outDir: 'dist',
        },
      }),
      vanillaExtractPlugin(),
    ],
  };
});
