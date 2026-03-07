import jsdoc from 'eslint-plugin-jsdoc';

export default [
    {
      plugins: {
        jsdoc,
      },
      rules: {
        'jsdoc/no-types': 'error',
      },
    },
  ];
  