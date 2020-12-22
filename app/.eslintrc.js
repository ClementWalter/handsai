module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "react-native"],
  rules: {
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],

    "no-cond-assign": ["error", "always"],

    indent: "off",
    "react/destructuring-assignment": "off",
    "react/jsx-filename-extension": "off",
    "no-console": "off",
    "global-require": "off",
  },
  ignorePatterns: ["babel.config.js"],
  extends: ["plugin:react/recommended", "airbnb", "prettier", "prettier/react"],
};
