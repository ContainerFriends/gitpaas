import jest from 'eslint-plugin-jest';

export default [
  {
    plugins: {
      jest,
    },
    settings: {
      jest: {
        version: 29,
      },
    },
    rules: {
      '@typescript-eslint/unbound-method': 'off',
      'dot-notation': 'off',
      '@typescript-eslint/dot-notation': [
        'error',
        {
          allowKeywords: true,
          allowIndexSignaturePropertyAccess: false,
          allowPrivateClassPropertyAccess: true,
          allowProtectedClassPropertyAccess: true,
        },
      ],
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-empty-function': 'off',
    },
  },
];
  