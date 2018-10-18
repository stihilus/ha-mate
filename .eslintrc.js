module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-new': 'off',
    'no-plusplus': 'off',
    'max-len': 'warn',
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        'indent': 'off',
        'vue/script-indent': ['warn', 'space', { 'baseIndent': 1 },],
      }
    }
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
};
