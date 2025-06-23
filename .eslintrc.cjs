/* eslint-env node */
module.exports = {
  root: true,
  extends: ['eslint:recommended', 'prettier'],
  ignorePatterns: [
    '**/dist/**',
    '**/build/**',
    '**/lib/**',
    '**/node_modules/**',
    '**/*.d.ts',
    '**/.nx/cache/**',
    '**/.nx/workspace-data/**',
    '**/.pnpm-store/**',
    '**/.vscode/**',
    '**/.idea/**',
    '**/.DS_Store',
    '**/coverage/**',
    '**/tmp/**',
    '**/storybook-static/**',
    '*.tsbuildinfo',
    '*.swp',
    '*.swo',
    '*.log',
    '*.env',
    '*.env.*',
    'vite.config.*.timestamp*',
    'vitest.config.*.timestamp*',
  ],
  plugins: ['@typescript-eslint'],
  env: {
    browser: true,
    node: true,
    es2024: true,
  },
  parserOptions: {
    ecmaVersion: 2024,
    sourceType: 'module',
  },
  globals: {
    process: 'readonly',
    navigator: 'readonly',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {},
    },
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-explicit-any': 'warn',
      },
    },
    {
      files: ['*.js', '*.jsx'],
      rules: {},
    },
  ],
};
