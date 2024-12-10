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
  bracketSameLine: false,
  arrowParens: 'avoid',

  // File handling
  endOfLine: 'lf',
  embeddedLanguageFormatting: 'auto',

  // Parser options
  proseWrap: 'preserve',
  htmlWhitespaceSensitivity: 'css',

  // File patterns
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      options: {
        parser: 'typescript',
      },
    },
    {
      files: ['*.js', '*.jsx'],
      options: {
        parser: 'babel',
      },
    },
    {
      files: '*.json',
      options: {
        parser: 'json',
      },
    },
    {
      files: ['*.md', '*.mdx'],
      options: {
        proseWrap: 'always',
      },
    },
    {
      files: ['.prettierrc', '.eslintrc', '*.json', '*.code-workspace'],
      options: {
        parser: 'json',
      },
    },
  ],

  // Ignore patterns
  ignorePath: '.prettierignore',
};
