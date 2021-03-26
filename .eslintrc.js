module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    "jest/globals": true,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:jest/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
};
