const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Support modern TanStack Query ESM and CJS builds
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs'];

// Allow TanStack Query to resolve through its React Native source or custom condition
config.resolver.unstable_conditionNames = [
  '@tanstack/custom-condition',
  'react-native',
  'browser',
  'require',
  'import',
];

module.exports = config;
