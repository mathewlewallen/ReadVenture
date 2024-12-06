/**
 * Babel configuration for React Native with TypeScript support
 * @type {import('@babel/core').ConfigFunction}
 */
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
};
