const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const react = require('eslint-plugin-react');

module.exports = [
  // Apply to TypeScript and JavaScript files
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        __DEV__: 'readonly',
        console: 'readonly',
      },
    },
  },

  // Base configs
  js.configs.recommended,
  react.configs.flat.recommended,

  // TypeScript configuration
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
  })),

  // React Native specific configuration
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // React settings
      'react/react-in-jsx-scope': 'off', // Not needed in React Native
      'react/prop-types': 'off', // Using TypeScript
      'react/display-name': 'off', // Not needed for React Native components

      // TypeScript
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-require-imports': 'off', // Common in React Native setup files

      // General
      'no-console': ['warn', { allow: ['warn', 'error'] }], // Allow console.warn and console.error
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  // Test file configuration
  {
    files: ['**/*.test.{js,jsx,ts,tsx}', '**/__tests__/**/*.{js,jsx,ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },

  // Ignore patterns
  {
    ignores: [
      'node_modules/**',
      'build/**',
      'dist/**',
      '.expo/**',
      'android/**',
      'ios/**',
      'metro.config.js',
      'babel.config.js',
      '*.config.js',
      'jest-setup-react-native.js',
    ],
  },
];
