import * as jsoncParser from 'jsonc-eslint-parser';
import jsonc from 'eslint-plugin-jsonc';

/**
 * ESLint configuration for package.json files
 * Provides specific key ordering and validation rules for package.json
 */

const packageConfig = [
  {
    files: ['**/package.json'],
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
      'jsonc/sort-keys': ['error', {
        pathPattern: '^$',
        order: [
          'name',
          'version',
          'description',
          'private',
          'type',
          'keywords',
          'homepage',
          'repository',
          'bugs',
          'author',
          'contributors',
          'license',
          'funding',
          'main',
          'module',
          'types',
          'exports',
          'files',
          'bin',
          'scripts',
          'dependencies',
          'devDependencies',
          'peerDependencies',
          'optionalDependencies',
          'bundledDependencies',
          'engines',
          'os',
          'cpu',
          'workspaces',
          'packageManager',
        ],
      }],
    },
  },
];

export default packageConfig;