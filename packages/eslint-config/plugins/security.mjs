import pii from 'eslint-plugin-pii';
import noSecrets from 'eslint-plugin-no-secrets';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    ignores: [
      '**/*.json',
      '**/*.jsonc',
      '**/tsconfig*.json',
      '**/package*.json',
      '**/.vscode/**',
      '**/.devcontainer/**',
    ],
    plugins: {
      pii,
      'no-secrets': noSecrets,
    },
    rules: {
      'pii/no-email': 'error',
      'pii/no-ip': 'error',
      'pii/no-phone-number': 'error',
      'no-secrets/no-secrets': 'error',
    },
  },
];