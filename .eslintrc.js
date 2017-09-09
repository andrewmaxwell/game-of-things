module.exports = {
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'no-console': 'off',
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true,
        bracketSpacing: false
      }
    ]
  }
};
