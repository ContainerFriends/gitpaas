import yamlParser from 'yaml-eslint-parser';
import yml from 'eslint-plugin-yml';

/**
 * ESLint configuration for GitHub Workflows
 * Uses YAML parser and plugin for proper GitHub Actions workflow validation
 */

const githubWorkflowConfig = [
  {
    files: ['workflows/**/*.yml', 'workflows/**/*.yaml', '.github/workflows/**/*.yml', '.github/workflows/**/*.yaml'],
    
    languageOptions: {
      parser: yamlParser,
      sourceType: 'module'
    },
    
    plugins: {
      yml
    },
    
    rules: {
      // YAML structural rules
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
      
      // General formatting rules
      'no-trailing-spaces': 'error',
      'eol-last': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
      'max-len': ['error', { 
        code: 230,
        comments: 230,
        ignoreUrls: true,
        ignoreStrings: false,
        ignoreTemplateLiterals: false,
        ignoreRegExpLiterals: true
      }]
    }
  }
];

export default githubWorkflowConfig;