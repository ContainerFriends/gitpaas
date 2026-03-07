import optimizeRegex from 'eslint-plugin-optimize-regex';

export default [
  {
    plugins: {
      'optimize-regex': optimizeRegex,
    },
    rules: {
      'optimize-regex/optimize-regex': 'error',
    },
  },
];
  