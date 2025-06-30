import '@testing-library/jest-native/extend-expect';

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  return {
    ...require('react-native-gesture-handler/jestSetup'),
  };
});

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock design tokens
jest.mock('@mimic/design-tokens', () => ({
  color: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      900: '#1e3a8a',
    },
    semantic: {
      background: {
        primary: '#eff6ff',
      },
      text: {
        primary: '#1e3a8a',
      },
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
}));

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
