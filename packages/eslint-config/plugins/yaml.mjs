import yamlParser from 'yaml-eslint-parser';
import yml from 'eslint-plugin-yml';

/**
 * ESLint configuration for YAML files
 * Uses specific YAML parser and plugin for proper validation
 */
const yamlConfig = [
  {
    files: ['**/*.yml', '**/*.yaml'],
    languageOptions: {
      parser: yamlParser,
      sourceType: 'module'
    },
    plugins: {
      yml
    },
    rules: {
      'yml/block-mapping-question-indicator-newline': 'error',
      'yml/block-sequence-hyphen-indicator-newline': 'error',
      'yml/flow-mapping-curly-newline': ['error', { multiline: true }],
      'yml/flow-mapping-curly-spacing': ['error', 'never'],
      'yml/flow-sequence-bracket-newline': ['error', { multiline: true }],
      'yml/flow-sequence-bracket-spacing': ['error', 'never'],
      'yml/indent': ['error', 2, { indentBlockSequences: true, indicatorValueIndent: 2 }],
      'yml/key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'yml/no-empty-document': 'error',
      'yml/no-empty-key': 'error',
      'yml/no-empty-mapping-value': 'error',
      'yml/no-empty-sequence-entry': 'error',
      'yml/no-irregular-whitespace': 'error',
      'yml/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
      'yml/no-tab-indent': 'error',
      'yml/plain-scalar': ['error', 'always'],
      'yml/quotes': ['error', { prefer: 'double', avoidEscape: true }],
      'yml/spaced-comment': ['error', 'always'],
      'yml/vue-custom-block/no-parsing-error': 'off',
      'no-trailing-spaces': 'error',
      'eol-last': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
      'max-len': ['error', { 
        code: 150,
        comments: 150,
        ignoreUrls: true,
        ignoreStrings: false,
        ignoreTemplateLiterals: false,
        ignoreRegExpLiterals: true
      }]
    }
  },
];

export default yamlConfig;