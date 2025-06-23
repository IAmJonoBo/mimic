import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

export default [
  // Global ignores - must be first and only contain ignores
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/lib/**',
      '**/node_modules/**',
      '**/*.d.ts',
      '**/.nx/cache/**',
      '**/.nx/workspace-data/**',
      '**/.pnpm-store/**',
      '**/storybook-static/**',
      '**/coverage/**',
      '**/tmp/**',
      '**/temp/**',
      '**/.temp/**',
      '**/.tmp/**',
      '**/temporary/**',
      '*.tsbuildinfo',
      'vite.config.*.timestamp*',
      'vitest.config.*.timestamp*',
      // Temporary and cache files
      '**/*.tmp',
      '**/*.temp',
      '**/*.cache',
      '**/*.swp',
      '**/*.swo',
      '**/*~',
      '**/#*#',
      '**/.#*',
      // macOS metadata files
      '**/._*',
      '**/.DS_Store',
      // Generated files
      '**/generated/**',
      '**/auto-generated/**',
    ],
  },

  // Base recommended configurations
  js.configs.recommended,
  ...tseslint.configs.strict,

  // Global configuration
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        browser: true,
        node: true,
        es2024: true,
      },
    },
  },

  // TypeScript and JavaScript files
  {
    files: ['**/*.{ts,tsx,js,jsx,mts,cts}'],
    plugins: {
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // Import ordering and organization
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      // Disable problematic import rules for now
      // 'import/no-unresolved': 'error',
      'import/no-duplicates': 'error',
      'import/no-unused-modules': 'warn',
      'import/order': [
        'warn',
        {
          'newlines-between': 'always',
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
        },
      ],

      // General code quality
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-unused-vars': 'off', // Handled by TypeScript
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'],
          moduleDirectory: ['node_modules', 'packages'],
        },
        typescript: {
          alwaysTryTypes: true,
          project: ['./tsconfig.json', './packages/*/tsconfig.json'],
        },
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
    },
  },

  // TypeScript-specific rules
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      // Disable type-aware rules that require project config for now
      // '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      // '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
    },
  },

  // Configuration files
  {
    files: ['**/*.config.{js,ts,mjs,cjs}', '**/.*rc.{js,ts,mjs,cjs}'],
    rules: {
      'no-console': 'off',
      // Disable import rules for config files
      'import/no-duplicates': 'off',
      'import/order': 'off',
      'simple-import-sort/imports': 'off',
    },
  },

  // CommonJS files
  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'script',
      globals: {
        module: 'readonly',
        exports: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },

  // Test files
  {
    files: ['**/*.{test,spec}.{js,ts,tsx}', '**/__tests__/**'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // Stories files
  {
    files: ['**/*.stories.{js,ts,tsx}'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
