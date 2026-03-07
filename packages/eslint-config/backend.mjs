import { dirname } from 'path';
import { fileURLToPath } from 'url';
import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';

import baseConfig from './base.mjs';
import base from './plugins/base.mjs';
import preferArrow from './plugins/prefer-arrow.mjs';
import regex from './plugins/regex.mjs';
import jsdoc from './plugins/jsdoc.mjs';
import security from './plugins/security.mjs';
import typescript from './plugins/typescript.mjs';
import imports from './plugins/import.mjs';
import prettier from './plugins/prettier.mjs';
import tests from './plugins/tests.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Backend ESLint configuration
 */

// Helper function to apply TypeScript project configuration for production code
const withTsProject = (config) => ({
  ...config,
  files: ['src/**/*.ts'],
  languageOptions: {
    ...(config.languageOptions ?? {}),
    parserOptions: {
      ...(config.languageOptions?.parserOptions ?? {}),
      project: ['tsconfig.json'],
      tsconfigRootDir: __dirname,
    },
  },
});

// Helper function to apply TypeScript project configuration for test files
const withTsProjectTests = (config) => ({
  ...config,
  files: ['**/*.test.ts', '**/*.spec.ts', 'tests/**/*.ts', 'jest.config.ts'],
  languageOptions: {
    ...(config.languageOptions ?? {}),
    parserOptions: {
      ...(config.languageOptions?.parserOptions ?? {}),
      project: ['tsconfig.spec.json'],
      tsconfigRootDir: __dirname,
    },
  },
});

export default [
    // Backend-specific ignores
    {
        ignores: ['.turbo', 'src/core/infrastructure/prisma/generated'],
    },
  ...baseConfig,
  ...base,
  // Specific rule sets for backend
  ...preferArrow,
  ...regex,
  ...jsdoc,
  ...security,

  // TypeScript ESLint recommended configurations for production code
  ...tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
  ).map(withTsProject).map(config => ({
    ...config,
    rules: {
      ...config.rules,
    },
  })),

  // Apply tool-specific configurations with TypeScript project settings for production
  ...typescript.map(withTsProject).map(config => ({
    ...config,
    rules: {
      ...config.rules,
    },
  })),
  ...imports.map(withTsProject),
  ...prettier.map(withTsProject),

  // TypeScript ESLint recommended configurations for test files
  ...tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
  ).map(withTsProjectTests).map(config => ({
    ...config,
    rules: {
      ...config.rules,
    },
  })),

  // Apply tool-specific configurations with TypeScript project settings for test files
  ...typescript.map(withTsProjectTests).map(config => ({
    ...config,
    rules: {
      ...config.rules,
    },
  })),
  ...imports.map(withTsProjectTests),
  ...prettier.map(withTsProjectTests),
  ...tests.map(withTsProjectTests),
];