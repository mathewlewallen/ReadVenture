/**
 * @type {import('prettier').Config}
 * Global Prettier configuration for ReadVenture project
 */
module.exports = {
  // Core formatting
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',

  // JSX/React specific
  jsxSingleQuote: false,
  bracketSpacing: true,
  bracketSameLine: false, // Previously jsxBracketSameLine
  arrowParens: 'avoid',

  // File handling
  endOfLine: 'lf',
  embeddedLanguageFormatting: 'auto',

  // Parser options
  proseWrap: 'preserve',
  htmlWhitespaceSensitivity: 'css',
};
