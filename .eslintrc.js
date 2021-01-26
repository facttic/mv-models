module.exports = {
  extends: ["standard", "plugin:prettier/recommended"],
  plugins: ["jest"],
  rules: {
    "one-var": ["error", "never"],
    "prettier/prettier": "error",
  },
  env: {
    "jest/globals": true,
  },
};
