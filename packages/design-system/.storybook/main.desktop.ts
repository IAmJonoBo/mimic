import type { StorybookConfig } from '@storybook/html-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.desktop.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions', '@storybook/addon-a11y', '@storybook/addon-docs', '@storybook/addon-viewport'],
  framework: {
    name: '@storybook/html-vite',
    options: {
      builder: {
        viteConfigPath: './vite.config.desktop.ts',
      },
    },
  },
  typescript: {
    check: true,
  },
  viteFinal: async (config) => {
    // Fixed port assignment to prevent Supernova-documented conflicts
    config.server = config.server || {};
    config.server.port = 6008; // Desktop Storybook: Port 6008 (custom, prevents conflicts)

    // Desktop-specific token configuration (uses web tokens with desktop styling)
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@mimic/design-tokens/desktop': require.resolve('../../design-tokens/libs/tokens/css/tokens.css'),
      '@mimic/design-tokens/js': require.resolve('../../design-tokens/libs/tokens/js/tokens.js'),
      '@mimic/design-tokens': require.resolve('../../design-tokens/libs/tokens/ts/tokens.ts'),
    };

    return config;
  },
};

export default config;
