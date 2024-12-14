module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@components': './src/components',
          '@screens': './src/screens',
          '@services': './src/services',
          '@utils': './src/utils',
          '@hooks': './src/hooks',
          '@navigation': './src/navigation',
          '@store': './src/store',
          '@types': './src/types',
          '@assets': './src/assets',
          '@theme': './src/theme',
        },
      },
    ],
    'react-native-reanimated/plugin',
    '@babel/plugin-transform-runtime',
  ],
};
