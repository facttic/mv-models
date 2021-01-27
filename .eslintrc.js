module.exports = {
  extends: ["standard", "plugin:prettier/recommended"],
  plugins: ["mocha", "chai"],
  rules: {
    "one-var": ["error", "never"],
    "prettier/prettier": "error",
  },
  env: {
    node: true,
    mocha: true,
  },
  globals: {
    expect: true,
  },
};
