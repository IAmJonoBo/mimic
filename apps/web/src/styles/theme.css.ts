// Import the generated CSS tokens directly following USER_GUIDE.md collision-safe architecture
// This ensures we use the ds- prefixed tokens as documented in section 10.1
// Using local copy to avoid module resolution issues during development
import './tokens.css';

import { style } from '@vanilla-extract/css';

// Create component styles using the design tokens
// Following the Vanilla Extract pattern documented in the USER_GUIDE.md
export const buttonPrimary = style({
  backgroundColor: 'var(--ds-color-primary-500)',
  color: 'var(--ds-color-neutral-50)',
  padding: 'var(--ds-spacing-md)',
  borderRadius: 'var(--ds-border-radius-md)',
  border: 'none',
  fontFamily: 'var(--ds-typography-font-family-primary)',
  fontSize: 'var(--ds-typography-font-size-base)',
  fontWeight: 'var(--ds-typography-font-weight-medium)',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: 'var(--ds-color-primary-600)',
  },
  ':active': {
    backgroundColor: 'var(--ds-color-primary-700)',
  },
});

export const buttonSecondary = style({
  backgroundColor: 'var(--ds-color-secondary-500)',
  color: 'var(--ds-color-neutral-50)',
  padding: 'var(--ds-spacing-md)',
  borderRadius: 'var(--ds-border-radius-md)',
  border: 'none',
  fontFamily: 'var(--ds-typography-font-family-primary)',
  fontSize: 'var(--ds-typography-font-size-base)',
  fontWeight: 'var(--ds-typography-font-weight-medium)',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: 'var(--ds-color-secondary-600)',
  },
});

export const card = style({
  backgroundColor: 'var(--ds-color-neutral-50)',
  border: '1px solid var(--ds-color-neutral-200)',
  borderRadius: 'var(--ds-border-radius-lg)',
  padding: 'var(--ds-spacing-lg)',
  boxShadow: 'var(--ds-shadow-md)',
});

export const heading = style({
  fontFamily: 'var(--ds-typography-font-family-heading)',
  fontSize: 'var(--ds-typography-font-size-2xl)',
  fontWeight: 'var(--ds-typography-font-weight-bold)',
  color: 'var(--ds-color-neutral-900)',
  marginBottom: 'var(--ds-spacing-md)',
});

export const text = style({
  fontFamily: 'var(--ds-typography-font-family-primary)',
  fontSize: 'var(--ds-typography-font-size-base)',
  lineHeight: 'var(--ds-typography-line-height-normal)',
  color: 'var(--ds-color-neutral-700)',
});
