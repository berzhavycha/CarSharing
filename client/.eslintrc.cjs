module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    "import/order": 0,
    "import/namespace": 0,
    "no-duplicate-imports": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "vars": "all",
        "args": "after-used",
        "ignoreRestSiblings": false
      }
    ],
    "@typescript-eslint/explicit-function-return-type": "error",
    "react/prop-types": "off",
    "@typescript-eslint/explicit-module-boundary-types": [
      "error",
      {
        "allowArgumentsExplicitlyTypedAsAny": true
      }
    ],
    "react-hooks/exhaustive-deps": "off",
    "react/display-name": "off"
  },
}
