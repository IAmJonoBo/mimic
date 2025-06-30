/**
 * Button Demo Component
 *
 * Demonstrates button components using design tokens with collision-prevention
 * architecture, showing proper ds- prefixed token integration.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { useTokens } from '../theme/ThemeProvider';

export const ButtonDemo: React.FC = () => {
  const { getToken } = useTokens();

  const primaryButtonStyle = {
    backgroundColor: getToken('color.primary_500', '#3b82f6') as string,
    paddingHorizontal: (getToken('button.padding_medium', 0.5) as number) * 16,
    paddingVertical: (getToken('button.padding_small', 0.25) as number) * 16,
    borderRadius: (getToken('button.borderRadius', 0.375) as number) * 16,
  };

  const secondaryButtonStyle = {
    backgroundColor: getToken('color.secondary_500', '#22c55e') as string,
    paddingHorizontal: (getToken('button.padding_medium', 0.5) as number) * 16,
    paddingVertical: (getToken('button.padding_small', 0.25) as number) * 16,
    borderRadius: (getToken('button.borderRadius', 0.375) as number) * 16,
  };

  const outlineButtonStyle = {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: getToken('color.primary_500', '#3b82f6') as string,
    paddingHorizontal: (getToken('button.padding_medium', 0.5) as number) * 16,
    paddingVertical: (getToken('button.padding_small', 0.25) as number) * 16,
    borderRadius: (getToken('button.borderRadius', 0.375) as number) * 16,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Button Demo</Text>

      <Pressable
        style={({ pressed }) => [
          primaryButtonStyle,
          pressed && { opacity: 0.8 },
        ]}
        onPress={() => console.log('Primary button pressed')}
      >
        <Text style={styles.primaryButtonText}>Primary Button</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          secondaryButtonStyle,
          pressed && { opacity: 0.8 },
        ]}
        onPress={() => console.log('Secondary button pressed')}
      >
        <Text style={styles.primaryButtonText}>Secondary Button</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          outlineButtonStyle,
          pressed && { opacity: 0.8 },
        ]}
        onPress={() => console.log('Outline button pressed')}
      >
        <Text
          style={[
            styles.outlineButtonText,
            { color: getToken('color.primary_500', '#3b82f6') as string },
          ]}
        >
          Outline Button
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#171717',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
