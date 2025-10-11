/**
 * Token Demo Component
 *
 * Demonstrates design token usage in React Native with collision-prevention
 * architecture showing ds- prefixed tokens working correctly.
 */

import type { FC } from 'react';
import { StyleSheet, Text, type TextStyle, View } from 'react-native';

import { useTokens } from '../theme/ThemeProvider';

const FONT_WEIGHT_VALUES = [
  'normal',
  'bold',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  100,
  200,
  300,
  400,
  500,
  600,
  700,
  800,
  900,
] as const;

const FONT_WEIGHT_SET = new Set<TextStyle['fontWeight']>(FONT_WEIGHT_VALUES);

const normalizeFontWeight = (
  value: string | number | undefined,
  fallback: TextStyle['fontWeight']
): TextStyle['fontWeight'] => {
  if (typeof value === 'number') {
    const numeric = value as TextStyle['fontWeight'];
    if (FONT_WEIGHT_SET.has(numeric)) {
      return numeric;
    }

    const asString = String(value) as TextStyle['fontWeight'];
    if (FONT_WEIGHT_SET.has(asString)) {
      return asString;
    }
  }

  if (typeof value === 'string') {
    const candidate = value as TextStyle['fontWeight'];
    if (FONT_WEIGHT_SET.has(candidate)) {
      return candidate;
    }
  }

  return fallback;
};

const resolveColor = (
  value: string | number | undefined,
  fallback: string
): string => {
  if (typeof value === 'string') {
    return value;
  }

  return fallback;
};

const resolveNumber = (
  value: string | number | undefined,
  fallback: number
): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

export const TokenDemo: FC = () => {
  const { getToken } = useTokens();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Design Token Demo</Text>

      <View style={styles.colorRow}>
        <View
          style={[
            styles.colorSwatch,
            {
              backgroundColor: resolveColor(
                getToken('color.primary_500', '#3b82f6'),
                '#3b82f6'
              ),
            },
          ]}
        />
        <Text style={styles.tokenLabel}>color.primary_500</Text>
      </View>

      <View style={styles.colorRow}>
        <View
          style={[
            styles.colorSwatch,
            {
              backgroundColor: resolveColor(
                getToken('color.secondary_500', '#22c55e'),
                '#22c55e'
              ),
            },
          ]}
        />
        <Text style={styles.tokenLabel}>color.secondary_500</Text>
      </View>

      <View style={styles.spacingDemo}>
        <Text style={styles.tokenLabel}>
          Spacing: xs={getToken('spacing.xs', 0.25)}, md=
          {getToken('spacing.md', 1)}, xl={getToken('spacing.xl', 2)}
        </Text>
      </View>

      <View style={styles.typographyDemo}>
        <Text
          style={[
            styles.typographyText,
            {
              fontSize:
                resolveNumber(
                  getToken('typography.fontSize_lg', 1.125),
                  1.125
                ) * 16,
              fontWeight: normalizeFontWeight(
                getToken('typography.fontWeight_medium', '500'),
                '500'
              ),
            },
          ]}
        >
          Typography Sample (fontSize_lg, fontWeight_medium)
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#171717',
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 6,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  tokenLabel: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#525252',
  },
  spacingDemo: {
    marginVertical: 12,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 6,
  },
  typographyDemo: {
    marginTop: 12,
  },
  typographyText: {
    color: '#171717',
  },
});
