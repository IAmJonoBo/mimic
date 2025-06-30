/**
 * Theme Provider for Mimic Mobile App
 *
 * Provides design tokens and theme context for React Native components
 * with collision-prevention architecture and proper namespace prefixing.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, useColorScheme } from 'react-native';

// Import design tokens with collision-safe paths
import * as tokens from '@mimic/design-tokens/react-native';

interface ThemeContextType {
  theme: 'light' | 'dark';
  tokens: typeof tokens;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [userTheme, setUserTheme] = useState<'light' | 'dark' | 'system'>(
    'system'
  );

  const theme =
    userTheme === 'system' ? systemColorScheme || 'light' : userTheme;

  // Listen for system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(
      ({ colorScheme: _colorScheme }) => {
        if (userTheme === 'system') {
          // Theme will update automatically via systemColorScheme
        }
      }
    );

    return () => subscription?.remove();
  }, [userTheme]);

  const contextValue: ThemeContextType = {
    theme,
    tokens,
    setTheme: setUserTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Hook for accessing design tokens with proper namespace
 * Provides collision-safe token access with fallback values
 */
export const useTokens = () => {
  const { tokens } = useTheme();

  const getToken = (
    tokenPath: string,
    fallback?: string | number
  ): string | number | undefined => {
    const keys = tokenPath.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = tokens;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return fallback;
      }
    }

    return value ?? fallback;
  };

  return {
    tokens,
    getToken,
  };
};
