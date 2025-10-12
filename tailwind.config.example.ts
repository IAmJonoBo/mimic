import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,qwik}', './packages/design-system/src/**/*.{js,ts,jsx,tsx,qwik}'],
  safelist: [
    {
      // Allow all ds- prefixed CSS variables (prevents Specify-documented conflicts)
      pattern: /^ds-/,
      variants: ['hover', 'focus', 'active', 'disabled', 'dark'],
    },
  ],
  theme: {
    extend: {
      colors: {
        // Map Tailwind utilities to ds- prefixed tokens (Specify-compliant)
        primary: {
          50: 'var(--ds-color-primary-50)',
          100: 'var(--ds-color-primary-100)',
          200: 'var(--ds-color-primary-200)',
          300: 'var(--ds-color-primary-300)',
          400: 'var(--ds-color-primary-400)',
          500: 'var(--ds-color-primary-500)',
          600: 'var(--ds-color-primary-600)',
          700: 'var(--ds-color-primary-700)',
          800: 'var(--ds-color-primary-800)',
          900: 'var(--ds-color-primary-900)',
        },
        secondary: {
          50: 'var(--ds-color-secondary-50)',
          100: 'var(--ds-color-secondary-100)',
          500: 'var(--ds-color-secondary-500)',
          900: 'var(--ds-color-secondary-900)',
        },
        neutral: {
          50: 'var(--ds-color-neutral-50)',
          100: 'var(--ds-color-neutral-100)',
          200: 'var(--ds-color-neutral-200)',
          300: 'var(--ds-color-neutral-300)',
          400: 'var(--ds-color-neutral-400)',
          500: 'var(--ds-color-neutral-500)',
          600: 'var(--ds-color-neutral-600)',
          700: 'var(--ds-color-neutral-700)',
          800: 'var(--ds-color-neutral-800)',
          900: 'var(--ds-color-neutral-900)',
        },
        success: {
          500: 'var(--ds-color-success-500)',
        },
        warning: {
          500: 'var(--ds-color-warning-500)',
        },
        error: {
          500: 'var(--ds-color-error-500)',
        },
      },
      spacing: {
        // Map Tailwind spacing to ds- prefixed tokens (Specify-compliant)
        xs: 'var(--ds-spacing-xs)',
        sm: 'var(--ds-spacing-sm)',
        md: 'var(--ds-spacing-md)',
        lg: 'var(--ds-spacing-lg)',
        xl: 'var(--ds-spacing-xl)',
        '2xl': 'var(--ds-spacing-2xl)',
        '3xl': 'var(--ds-spacing-3xl)',
      },
      fontSize: {
        // Map Tailwind typography to ds- prefixed tokens (Specify-compliant)
        'heading-1': [
          'var(--ds-typography-heading-1-size)',
          {
            lineHeight: 'var(--ds-typography-heading-1-line-height)',
            fontWeight: 'var(--ds-typography-heading-1-weight)',
          },
        ],
        'heading-2': [
          'var(--ds-typography-heading-2-size)',
          {
            lineHeight: 'var(--ds-typography-heading-2-line-height)',
            fontWeight: 'var(--ds-typography-heading-2-weight)',
          },
        ],
        'heading-3': [
          'var(--ds-typography-heading-3-size)',
          {
            lineHeight: 'var(--ds-typography-heading-3-line-height)',
            fontWeight: 'var(--ds-typography-heading-3-weight)',
          },
        ],
        body: [
          'var(--ds-typography-body-size)',
          {
            lineHeight: 'var(--ds-typography-body-line-height)',
            fontWeight: 'var(--ds-typography-body-weight)',
          },
        ],
        caption: [
          'var(--ds-typography-caption-size)',
          {
            lineHeight: 'var(--ds-typography-caption-line-height)',
            fontWeight: 'var(--ds-typography-caption-weight)',
          },
        ],
      },
      fontFamily: {
        // Map Tailwind font families to ds- prefixed tokens
        heading: 'var(--ds-typography-font-family-heading)',
        body: 'var(--ds-typography-font-family-body)',
        mono: 'var(--ds-typography-font-family-mono)',
      },
      borderRadius: {
        // Map Tailwind border radius to ds- prefixed tokens
        none: 'var(--ds-border-radius-none)',
        sm: 'var(--ds-border-radius-sm)',
        md: 'var(--ds-border-radius-md)',
        lg: 'var(--ds-border-radius-lg)',
        xl: 'var(--ds-border-radius-xl)',
        full: 'var(--ds-border-radius-full)',
      },
      boxShadow: {
        // Map Tailwind shadows to ds- prefixed tokens
        sm: 'var(--ds-shadow-sm)',
        md: 'var(--ds-shadow-md)',
        lg: 'var(--ds-shadow-lg)',
        xl: 'var(--ds-shadow-xl)',
      },
    },
  },
  plugins: [
    // Add any additional Tailwind plugins here
  ],
};

export default config;
