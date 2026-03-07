import prettier from 'eslint-plugin-prettier'

export default [
    {
      plugins: {
        prettier,
      },
      rules: {
        'prettier/prettier': [
          'error',
          {
            printWidth: 180,
            singleQuote: true,
            tabWidth: 4,
          },
        ],
      },
    },
  ];
  