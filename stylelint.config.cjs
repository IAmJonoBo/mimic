/* eslint-env node */
module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-tailwindcss'],
  rules: {
    // Allow Tailwind CSS directives
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'layer',
          'config',
        ],
      },
    ],
    // Allow custom properties for design tokens
    'property-no-unknown': [
      true,
      {
        ignoreProperties: [
          // CSS custom properties for design tokens
          '/^--/',
        ],
      },
    ],
    // Tailwind CSS utilities should be ordered
    'order/properties-order': null,
    // Allow @layer directive
    'declaration-block-trailing-semicolon': null,
    // Modern CSS support
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: [
          'theme',
          'screen',
          'oklch',
          'color-mix',
          'light-dark',
        ],
      },
    ],
    // Allow CSS nesting
    'rule-empty-line-before': [
      'always-multi-line',
      {
        except: ['first-nested'],
        ignore: ['after-comment'],
      },
    ],
    // Disable conflicting rules with Tailwind
    'no-descending-specificity': null,
    'declaration-empty-line-before': null,
    'comment-empty-line-before': null,
    'block-no-empty': null,
  },
  ignoreFiles: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**',
    '**/.nx/**',
    '**/tmp/**',
    '**/storybook-static/**',
    '**/*.min.css',
    // Ignore generated CSS files
    '**/tokens.css',
    '**/design-tokens/**/*.css',
  ],
  overrides: [
    {
      files: ['**/*.css'],
      rules: {
        // Standard CSS rules
        'color-hex-length': 'short',
        'color-hex-case': 'lower',
        'string-quotes': 'single',
        'declaration-colon-space-after': 'always',
        'declaration-colon-space-before': 'never',
      },
    },
    {
      files: ['**/*.scss', '**/*.sass'],
      rules: {
        // SCSS-specific rules if needed
        'scss/at-rule-no-unknown': true,
      },
    },
  ],
};
