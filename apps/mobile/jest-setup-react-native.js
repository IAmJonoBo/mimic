// React Native Jest setup file
// Handles Flow type issues and React Native compatibility

// Mock React Native's NativeModules
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// Mock Appearance API
jest.mock('react-native/Libraries/Utilities/Appearance', () => ({
  getColorScheme: jest.fn(() => 'light'),
  addChangeListener: jest.fn(() => ({ remove: jest.fn() })),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Global setup
global.__DEV__ = true;
