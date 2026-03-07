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
import react from './plugins/react.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Define typescript configuration for source files
 */
const sourceTsConfig = (config) => ({
    ...config,
    files: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.d.ts'],
    languageOptions: {
        ...(config.languageOptions ?? {}),
        parserOptions: {
            ...(config.languageOptions?.parserOptions ?? {}),
            project: ['tsconfig.json'],

        },
    },
});

/**
 * Define typescript configuration for test files
 */
const testsTsConfig = (config) => ({
    ...config,
    files: ['src/**/*.spec.ts', 'src/**/*.spec.tsx'],
    languageOptions: {
        ...(config.languageOptions ?? {}),
        parserOptions: {
            ...(config.languageOptions?.parserOptions ?? {}),
            project: ['tsconfig.app.json'],
        },
    },
});

/**
 * Define typescript configuration for configuration files
 */
const configTsConfig = (config) => ({
    ...config,
    files: ['tailwind.config.ts', 'vite.config.ts', 'postcss.config.ts'],
    languageOptions: {
        ...(config.languageOptions ?? {}),
        parserOptions: {
            ...(config.languageOptions?.parserOptions ?? {}),
            project: ['tsconfig.config.json'],
        },
    },
});

/**
 * Define javascript configuration for configuration files
 */
const configJsConfig = (config) => ({
    ...config,
    files: ['eslint.config.mjs'],
});

/**
 * Base shared configuration
 */
const config = [
  {
      ignores: ['.turbo', 'dist', 'node_modules', '**/*.html'],
  },
  ...baseConfig,
  ...base,
  ...preferArrow,
  ...regex,
  ...jsdoc,
  ...security,
  ...react,
];


/**
 * Configuration for typescript source files
 */
const sourceTsFilesConfig = [
    ...tseslint
        .config(eslint.configs.recommended, tseslint.configs.recommended)
        .map(sourceTsConfig)
        .map((config) => ({
            ...config,
            rules: {
                ...config.rules,
            },
        })),
    ...typescript.map(sourceTsConfig).map((config) => ({
        ...config,
        rules: {
            ...config.rules,
        },
    })),
    ...imports.map(sourceTsConfig),
    ...prettier.map(sourceTsConfig),
];

/**
 * Configuration for typescript test files
 */
const testTsFilesConfig = [
    ...tseslint
        .config(eslint.configs.recommended, tseslint.configs.recommended)
        .map(testsTsConfig)
        .map((config) => ({
            ...config,
            rules: {
                ...config.rules,
            },
        })),
    ...typescript.map(testsTsConfig).map((config) => ({
        ...config,
        rules: {
            ...config.rules,
        },
    })),
    ...imports.map(testsTsConfig),
    ...prettier.map(testsTsConfig),
    ...tests.map(testsTsConfig),
];

/**
 * Configuration for typescript configuration files
 */
const configTsFilesConfig = [
    ...tseslint
        .config(eslint.configs.recommended, tseslint.configs.recommended)
        .map(configTsConfig)
        .map((config) => ({
            ...config,
            rules: {
                ...config.rules,
            },
        })),
    ...typescript.map(configTsConfig).map((config) => ({
        ...config,
        rules: {
            ...config.rules,
        },
    })),
    ...imports.map(configTsConfig),
    ...prettier.map(configTsConfig),
];

/**
 * Configuration for javascript configuration files
 */
const configJsFilesConfig = [
    {
        ...eslint.configs.recommended,
        ...configJsConfig(eslint.configs.recommended),
        rules: {
            ...eslint.configs.recommended.rules,
            'import/extensions': 'off',
        },
    },
    /* ...imports.map(configJsConfig), */
    ...prettier.map(configJsConfig),
];

/**
 * Frontend ESLint configuration
 */
export default [...baseConfig, ...config, ...sourceTsFilesConfig, ...testTsFilesConfig, ...configTsFilesConfig, ...configJsFilesConfig];
