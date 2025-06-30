/**
 * Token Demo Component
 *
 * Demonstrates design token usage in React Native with collision-prevention
 * architecture showing ds- prefixed tokens working correctly.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useTokens } from '../theme/ThemeProvider';

export const TokenDemo: React.FC = () => {
  const { getToken } = useTokens();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Design Token Demo</Text>

      <View style={styles.colorRow}>
        <View
          style={[
            styles.colorSwatch,
            {
              backgroundColor: getToken(
                'color.primary_500',
                '#3b82f6'
              ) as string,
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
              backgroundColor: getToken(
                'color.secondary_500',
                '#22c55e'
              ) as string,
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
                (getToken('typography.fontSize_lg', 1.125) as number) * 16,
              fontWeight: getToken(
                'typography.fontWeight_medium',
                '500'
              ) as string,
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
