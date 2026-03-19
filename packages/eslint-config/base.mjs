import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import jsonConfig from './plugins/json.mjs';
import packageConfig from './plugins/package.mjs';

/**
 * Base ESLint configuration
 * This configuration provides common rules for all projects in the monorepo
 * 
 * Should be extended by frontend and backend specific configurations
 */
export default [
  // Global ignore patterns for all projects
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.git/**',
      '**/logs/**',
      '**/tmp/**',
      '**/build/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/package-lock.json',
      '**/.github/skills/**'
    ],
  },
  
  js.configs.recommended,
  ...tseslint.configs.recommended,
  
  // TypeScript and JavaScript rules
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'warn',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all']
    }
  },
  
  // JSON/JSONC configuration
  ...jsonConfig,
  
  // Package.json specific configuration
  ...packageConfig,
];