import type { StorybookConfig } from '@storybook/html-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/html-vite',
    options: {
      builder: {
        viteConfigPath: './vite.config.storybook.ts'
      }
    },
  },
  typescript: {
    check: true,
  },
  refs: {
    // Enable composition for cross-platform documentation
    'mobile': {
      title: 'Mobile Components',
      url: 'http://localhost:4401', // Mobile Storybook instance
      expanded: false,
    },
    'desktop': {
      title: 'Desktop Components', 
      url: 'http://localhost:4402', // Desktop Storybook instance
      expanded: false,
    },
  },
  viteFinal: async config => {
    // Ensure design tokens are available with collision-safe paths
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@mimic/design-tokens/web': require.resolve('../../design-tokens/libs/tokens/css/tokens.css'),
      '@mimic/design-tokens/js': require.resolve('../../design-tokens/libs/tokens/js/tokens.js'),
      '@mimic/design-tokens/types': require.resolve('../../design-tokens/libs/tokens/ts/tokens.ts'),
    };
    
    // Add CSS preprocessing for design tokens
    config.css = config.css || {};
    config.css.preprocessorOptions = {
      ...config.css.preprocessorOptions,
      scss: {
        additionalData: `@import "@mimic/design-tokens/scss/tokens.scss";`,
      },
    };
    
    return config;
  },
};

export default config;
