/* eslint-env node */
module.exports = {
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen', 'layer', 'config'],
      },
    ],
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['/^--/'],
      },
    ],
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['theme', 'screen', 'oklch', 'color-mix', 'light-dark'],
      },
    ],
    'rule-empty-line-before': [
      'always-multi-line',
      {
        except: ['first-nested'],
        ignore: ['after-comment'],
      },
    ],
    'no-descending-specificity': null,
    'declaration-empty-line-before': null,
    'comment-empty-line-before': null,
    'block-no-empty': null,
    'custom-property-pattern': null,
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
    '**/tokens.css',
    '**/design-tokens/**/*.css',
  ],
  overrides: [
    {
      files: ['**/*.css'],
      rules: {
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
        'scss/at-rule-no-unknown': true,
      },
    },
  ],
};
