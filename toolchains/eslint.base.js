import js from '@eslint/js';
import nxEslintPlugin from '@nx/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/lib/**',
      '**/out/**',
      '**/node_modules/**',
      '**/*.d.ts',
      '**/*.tsbuildinfo',
      '**/*.buildinfo',
      '**/*.js.map',
      '**/*.d.ts.map',
      '**/.nx/cache/**',
      '**/.nx/workspace-data/**',
      '**/.nx/installation/**',
      '**/.pnpm-store/**',
      '**/storybook-static/**',
      '**/chromatic-build/**',
      '**/coverage/**',
      '**/test-results/**',
      '**/playwright-report/**',
      '**/blob-report/**',
      '**/jest-coverage/**',
      '**/.vitest/**',
      '**/.next/**',
      '**/.nuxt/**',
      '**/.vuepress/dist/**',
      '**/.serverless/**',
      '**/.parcel-cache/**',
      '**/.turbo/**',
      '**/.vercel/**',
      '**/.nitro/**',
      '/tmp/**',
      '**/tmp/**',
      '**/temp/**',
      '**/.temp/**',
      '**/.tmp/**',
      '**/temporary/**',
      '*.tsbuildinfo',
      'vite.config.*.timestamp*',
      'vitest.config.*.timestamp*',
      '**/*.timestamp-*',
      '**/*.tmp',
      '**/*.temp',
      '**/*.cache',
      '**/*.config.js',
      '**/*.config.cjs',
      '**/*.config.mjs',
      '**/*.config.ts',
      '**/*.config.mts',
      '**/*.config.cts',
      '**/.*rc.js',
      '**/.*rc.cjs',
      '**/.*rc.mjs',
      '**/.*rc.ts',
      '**/.*rc.mts',
      '**/.*rc.cts',
      '**/*.swp',
      '**/*.swo',
      '**/*~',
      '**/#*#',
      '**/.#*',
      '**/._*',
      '**/.DS_Store',
      '**/android/app/debug/**',
      '**/android/app/profile/**',
      '**/android/app/release/**',
      '**/ios/build/**',
      '**/.expo/**',
      '**/target/**',
      '**/*-lock.json',
      '**/*.lock',
      '**/.yarn/**',
      '**/generated/**',
      '**/auto-generated/**',
      '**/gen/**',
      '**/.cursor/rules/**',
      '**/.github/instructions/**',
      '**/packages/design-tokens/libs/tokens/**',
      'toolchains/**',
      '**/*.example.js',
      '**/*.example.ts',
      '**/*.template.js',
      '**/*.template.ts',
      '**/examples/**',
      '**/templates/**',
      '**/scripts/**',
      '**/tools/**',
      '**/.env*',
      '**/secrets.json',
      '**/logs/**',
      '**/*.log',
      '**/*.bak',
      '**/*.backup',
      '**/*.old',
      '**/*.orig'
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        browser: true,
        node: true,
        es2024: true
      }
    }
  },
  {
    files: ['**/*.{ts,tsx,js,jsx,mts,cts}'],
    plugins: {
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
      '@nx': nxEslintPlugin
    },
    rules: {
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      'import/no-duplicates': 'error',
      'import/no-unused-modules': 'warn',
      'import/order': [
        'warn',
        {
          alphabetize: { order: 'asc', caseInsensitive: true },
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'unknown'
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          pathGroups: [
            {
              pattern: '@mimic/**',
              group: 'internal',
              position: 'after'
            }
          ]
        }
      ],
      '@nx/workspace-dependency-rules': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/consistent-type-imports': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }]
    }
  }
];
