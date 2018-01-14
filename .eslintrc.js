module.exports = {
  extends: "airbnb",
  rules: {
    "react/prefer-stateless-function": 0,
    "react/jsx-filename-extension": 0,
    "react/prop-types": 0,
    "object-curly-newline": 0,
    "import/no-extraneous-dependencies": 0,
    "comma-dangle": 0,
    indent: 0
  },
  globals: {
    document: 1
  },
  parser: "babel-eslint",
  env: {
    browser: 1
  }
};
