// Prettier configuration for edge-case plugin support (HTML, Astro, Tailwind class sorting)
// Primary formatting handled by Biome (JS/TS/JSON) and dprint (MD/TOML/YAML)
import { defineConfig } from 'prettier';

export default defineConfig({
  // Core formatting rules (no line-length restrictions for code)
  printWidth: 320,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  endOfLine: 'lf',

  // Plugin configuration
  plugins: ['prettier-plugin-tailwindcss'],

  // File-specific overrides
  overrides: [
    {
      files: ['*.html', '*.astro'],
      options: {
        printWidth: 120,
        htmlWhitespaceSensitivity: 'css',
      },
    },
    {
      files: ['*.css', '*.scss', '*.sass'],
      options: {
        singleQuote: false,
      },
    },
  ],

  // Tailwind CSS class sorting configuration
  tailwindConfig: './tailwind.config.js',
  tailwindFunctions: ['clsx', 'cn', 'classNames', 'tw'],
});
