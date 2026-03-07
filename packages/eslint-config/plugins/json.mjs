import * as jsoncParser from 'jsonc-eslint-parser';
import jsonc from 'eslint-plugin-jsonc';

/**
 * ESLint configuration for general JSON/JSONC files
 * Excludes package.json which has its own specific configuration
 */

const jsonConfig = [
  {
    files: ['**/*.json', '**/*.jsonc'],
    ignores: ['**/package.json'],
    languageOptions: {
      parser: jsoncParser,
    },
    plugins: {
      jsonc,
    },
    rules: {
      'jsonc/indent': ['error', 2],
      'jsonc/key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'jsonc/object-curly-spacing': ['error', 'always'],
      'jsonc/array-bracket-spacing': ['error', 'never'],
      'jsonc/comma-dangle': ['error', 'never'],
      'jsonc/quotes': ['error', 'double'],
      'jsonc/sort-keys': ['error', 'asc', { caseSensitive: false }],
      'no-trailing-spaces': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
    },
  },
];

export default jsonConfig;