import { describe, expect, it } from 'vitest';

import { tokenUtils } from '../index.js';

describe('tokenUtils.toCssVar', () => {
  it('converts dot-delimited paths into ds-prefixed CSS variables', () => {
    expect(tokenUtils.toCssVar('color.primary.500')).toBe('--ds-color-primary-500');
  });

  it('preserves single-segment paths with ds prefix', () => {
    expect(tokenUtils.toCssVar('color')).toBe('--ds-color');
  });

  it('handles complex paths with multiple separators', () => {
    expect(tokenUtils.toCssVar('typography.heading.h1.line-height')).toBe('--ds-typography-heading-h1-line-height');
  });
});
