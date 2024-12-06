/**
 * Babel configuration for React Native with TypeScript support
 * @type {import('@babel/core').ConfigFunction}
 */
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['@babel/plugin-transform-flow-strip-types'],
    ['@babel/plugin-transform-decorators', { legacy: true }],
    ['@babel/plugin-transform-class-properties', { loose: true }],
  ],
  env: {
    production: {
      plugins: ['transform-remove-console'],
    },
    test: {
      plugins: [['@babel/plugin-transform-modules-commonjs']],
    },
  },
};
