module.exports = {
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: "script"
  },
  extends: ["eslint:recommended", "airbnb-base", "prettier"],
  rules: {
    "block-scoped-var": "error",
    "consistent-this": ["error", "self"],
    "func-style": ["error", "declaration"],
    "no-param-reassign": ["error", {props: false}],
    "global-require": "off",
    "import/no-extraneous-dependencies": [
      "error",
      {devDependencies: ["**/*test*", "bin/*"]}
    ],
    "lines-around-directive": "off",
    "max-len": [
      "warn",
      {
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreTrailingComments: true,
        ignoreComments: true,
        ignoreRegExpLiterals: true
      }
    ],
    "max-nested-callbacks": ["error", 4],
    "no-else-return": "error",
    "no-global-require": "off",
    "no-nested-ternary": "error",
    "no-process-exit": 1,
    "no-sync": 1,
    "no-undefined": "error",
    "no-underscore-dangle": "off",
    "no-warning-comments": "warn",
    strict: ["off", "safe"]
  }
};
