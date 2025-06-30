/**
 * Mimic Mobile App - React Native with New Architecture
 *
 * Main App component demonstrating the Mimic design token system
 * with collision-prevention architecture and React Native integration.
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';

import { ThemeProvider } from './theme/ThemeProvider';
import { TokenDemo } from './components/TokenDemo';
import { ButtonDemo } from './components/ButtonDemo';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fafafa" />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Mimic Design Tokens</Text>
            <Text style={styles.subtitle}>
              React Native with Collision-Prevention Architecture
            </Text>

            <TokenDemo />
            <ButtonDemo />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa', // ds-color-background-primary fallback
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16, // ds-spacing-md fallback
  },
  title: {
    fontSize: 24, // ds-typography-fontSize-2xl fallback
    fontWeight: '700',
    color: '#171717', // ds-color-text-primary fallback
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16, // ds-typography-fontSize-base fallback
    color: '#525252', // ds-color-text-secondary fallback
    marginBottom: 24,
  },
});

export default App;
