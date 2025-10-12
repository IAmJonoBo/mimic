import { afterEach, describe, expect, it } from 'vitest';

import {
  baseTokens,
  componentTokens,
  getToken,
  getTokensByPattern,
  matchesPattern,
  semanticTokens,
  validateTokens,
} from '../src/index.js';

interface TokenWithValue {
  $value: string;
  $type?: string;
  $description?: string;
}

const originalNavigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator');

const restoreEnvironment = () => {
  if (originalNavigatorDescriptor) {
    Object.defineProperty(globalThis, 'navigator', originalNavigatorDescriptor);
  } else {
    Reflect.deleteProperty(globalThis as { navigator?: unknown }, 'navigator');
  }
  if (typeof process !== 'undefined') {
    delete process.env.MIMIC_PLATFORM;
  }
};

const setMobileRuntime = () => {
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    writable: true,
    value: {
      product: 'ReactNative',
    },
  });

  if (typeof process !== 'undefined') {
    process.env.MIMIC_PLATFORM = 'mobile';
  }
};

afterEach(() => {
  restoreEnvironment();
});

describe('Design Tokens', () => {
  describe('Token Validation', () => {
    it('should validate base tokens structure', () => {
      const result = validateTokens(baseTokens);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);

      // Some warnings are expected for tokens missing descriptions in test data
      if (result.warnings.length > 0) {
        console.warn('Validation warnings:', result.warnings);
      }
    });

    it('should validate semantic tokens structure', () => {
      const result = validateTokens(semanticTokens);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate component tokens structure', () => {
      const result = validateTokens(componentTokens);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid token structure', () => {
      const invalidTokens = {
        color: {
          primary: {
            // Has $ properties but missing $value - this should be invalid
            invalid: {
              $type: 'color',
              $description: 'Invalid token without value',
              // Missing $value
            },
          },
        },
      };

      const result = validateTokens(invalidTokens);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('missing $value');
    });
  });

  describe('Token Access', () => {
    it('should handle getToken gracefully when tokens are not built', () => {
      const result = getToken('non.existent.token', 'fallback');
      expect(result).toBe('fallback');
    });

    it('should get actual token values from source files', () => {
      const result = getToken('color.primary.500', '#default');
      expect(result).toBe('#3b82f6'); // Should find this in baseTokens
    });

    it('should get tokens by pattern', () => {
      const primaryTokens = getTokensByPattern('color.primary.*');
      expect(primaryTokens.length).toBeGreaterThan(0);

      const primaryToken = primaryTokens.find(
        (t: { path: string; value: string; type?: string }) => t.path === 'color.primary.500'
      );
      expect(primaryToken).toBeDefined();
      expect(primaryToken?.value).toBe('#3b82f6');
      expect(primaryToken?.type).toBe('color');
    });

    it('should handle wildcard patterns correctly', () => {
      // Test nested wildcard patterns that should find actual tokens
      const primaryColorTokens = getTokensByPattern('color.primary.*');
      expect(primaryColorTokens.length).toBeGreaterThan(5); // Should find 50, 100, 200, etc.

      const spacingTokens = getTokensByPattern('spacing.*');
      expect(spacingTokens.length).toBeGreaterThan(0);

      // Test very broad pattern
      const allTokens = getTokensByPattern('*');
      expect(allTokens.length).toBeGreaterThan(10);
    });

    it('should surface mobile platform overrides when React Native runtime is detected', () => {
      setMobileRuntime();

      expect(getToken('spacing.md')).toBe('16dp');
      expect(getToken('touch.minSize')).toBe('44dp');
    });

    it('should include platform tokens in pattern lookups for mobile runtime', () => {
      setMobileRuntime();

      const touchTokens = getTokensByPattern('touch.*');

      expect(touchTokens).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: 'touch.minSize', value: '44dp' }),
          expect.objectContaining({ path: 'touch.padding', value: '12dp' }),
        ])
      );
    });
  });

  describe('Pattern Matching', () => {
    it('should match exact paths', () => {
      expect(matchesPattern('color.primary.500', 'color.primary.500')).toBe(true);
      expect(matchesPattern('color.primary.600', 'color.primary.500')).toBe(false);
    });

    it('should match wildcard patterns', () => {
      expect(matchesPattern('color.primary.500', 'color.primary.*')).toBe(true);
      expect(matchesPattern('color.secondary.500', 'color.primary.*')).toBe(false);
      expect(matchesPattern('color.primary.500', 'color.*.*')).toBe(true);
    });

    it('should match nested wildcard patterns', () => {
      expect(matchesPattern('typography.fontSize.base', 'typography.*.*')).toBe(true);
      expect(matchesPattern('spacing.md', 'spacing.*')).toBe(true);
    });
  });

  describe('Token Structure', () => {
    it('should have expected color categories in base tokens', () => {
      expect(baseTokens.color).toBeDefined();
      expect(baseTokens.color.primary).toBeDefined();
      expect(baseTokens.color.secondary).toBeDefined();
      expect(baseTokens.color.neutral).toBeDefined();
      expect(baseTokens.color.semantic).toBeDefined();
    });

    it('should have expected spacing tokens', () => {
      expect(baseTokens.spacing).toBeDefined();
      expect(baseTokens.spacing.xs).toBeDefined();
      expect(baseTokens.spacing.sm).toBeDefined();
      expect(baseTokens.spacing.md).toBeDefined();
      expect(baseTokens.spacing.lg).toBeDefined();
      expect(baseTokens.spacing.xl).toBeDefined();
    });

    it('should have expected typography tokens', () => {
      expect(baseTokens.typography).toBeDefined();
      expect(baseTokens.typography.fontFamily).toBeDefined();
      expect(baseTokens.typography.fontSize).toBeDefined();
      expect(baseTokens.typography.fontWeight).toBeDefined();
      expect(baseTokens.typography.lineHeight).toBeDefined();
    });

    it('should have expected border tokens', () => {
      expect(baseTokens.border).toBeDefined();
      expect(baseTokens.border.radius).toBeDefined();
      expect(baseTokens.border.width).toBeDefined();
    });

    it('should have expected shadow tokens', () => {
      expect(baseTokens.shadow).toBeDefined();
      expect(baseTokens.shadow.sm).toBeDefined();
      expect(baseTokens.shadow.md).toBeDefined();
      expect(baseTokens.shadow.lg).toBeDefined();
    });
  });

  describe('Token Values', () => {
    it('should have valid color values', () => {
      const primaryColors = baseTokens.color.primary;

      // Check that color values are valid hex codes
      Object.entries(primaryColors).forEach(([_key, colorToken]) => {
        const token = colorToken as TokenWithValue;
        if (token.$value) {
          expect(token.$value).toMatch(/^#[0-9a-fA-F]{6}$/);
        }
      });
    });

    it('should have valid spacing values', () => {
      const spacingTokens = baseTokens.spacing;

      Object.entries(spacingTokens).forEach(([_key, spacingToken]) => {
        const token = spacingToken as TokenWithValue;
        if (token.$value) {
          // Should be rem values
          expect(token.$value).toMatch(/^\d+(\.\d+)?rem$/);
        }
      });
    });

    it('should have valid font weight values', () => {
      const fontWeights = baseTokens.typography.fontWeight;

      Object.entries(fontWeights).forEach(([_key, weightToken]) => {
        const token = weightToken as TokenWithValue;
        if (token.$value) {
          // Should be numeric font weights
          expect(Number(token.$value)).toBeGreaterThanOrEqual(100);
          expect(Number(token.$value)).toBeLessThanOrEqual(900);
        }
      });
    });
  });

  describe('Semantic Tokens', () => {
    it('should reference base tokens correctly', () => {
      const textPrimary = semanticTokens.color.text.primary;
      expect(textPrimary.$value).toBe('{color.neutral.900}');

      const backgroundPrimary = semanticTokens.color.background.primary;
      expect(backgroundPrimary.$value).toBe('{color.neutral.50}');
    });
  });

  describe('Component Tokens', () => {
    it('should have button component tokens', () => {
      expect(componentTokens.button).toBeDefined();
      expect(componentTokens.button.padding).toBeDefined();
      expect(componentTokens.button.borderRadius).toBeDefined();
      expect(componentTokens.button.fontSize).toBeDefined();
    });

    it('should have card component tokens', () => {
      expect(componentTokens.card).toBeDefined();
      expect(componentTokens.card.padding).toBeDefined();
      expect(componentTokens.card.borderRadius).toBeDefined();
      expect(componentTokens.card.shadow).toBeDefined();
    });

    it('should reference other tokens correctly', () => {
      const buttonRadius = componentTokens.button.borderRadius;
      expect(buttonRadius.$value).toBe('{border.radius.md}');

      const cardShadow = componentTokens.card.shadow;
      expect(cardShadow.$value).toBe('{shadow.md}');
    });
  });
});
