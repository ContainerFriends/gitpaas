import preferArrow from 'eslint-plugin-prefer-arrow'

export default [
  {
    plugins: {
      'prefer-arrow': preferArrow,
    },
    rules: {
      'prefer-arrow/prefer-arrow-functions': [
        'error',
        {
          allowStandaloneDeclarations: true,
          disallowPrototype: true,
          singleReturnOnly: false,
          classPropertiesAllowed: false,
        },
      ],
    },
  },
];
  