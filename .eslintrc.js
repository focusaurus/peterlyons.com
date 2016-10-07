module.exports = {
  extends: ['eslint:recommended', 'standard'],
  rules: {
    'block-scoped-var': 'error',
    'consistent-this': ['error', 'self'],
    'func-style': ['error', 'declaration'],
    'max-len': ['warn', 80, 2],
    'max-nested-callbacks': ['error', 4],
    'no-else-return': 'error',
    'no-eq-null': 'error',
    'no-nested-ternary': 'error',
    'no-process-exit': 1,
    'no-sync': 1,
    'no-ternary': 'error',
    'no-undefined': 'error',
    'no-warning-comments': ['error']
  }
}
