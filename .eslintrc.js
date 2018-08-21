module.exports = {
    "extends": "airbnb-base",
    "globals": {
      "expect": true
    },
    "plugins": [
      "chai-friendly",
      "mocha",
    ],
    "env": {
      "mocha": true,
      "jest": true
    },
    "rules": {
      "linebreak-style": ["error", "windows"],
      "no-unused-vars": ["error", { "argsIgnorePattern": "next" }],
      "import/no-extraneous-dependencies": [2, { devDependencies: true }],
      "chai-friendly/no-unused-expressions": 2,
      "no-unused-expressions": 0,
      "no-underscore-dangle": 0,
      "prefer-arrow-callback": 0,
      "no-continue": 0,
      "class-methods-use-this": 0,
      "mocha/prefer-arrow-callback": 2,
      "func-names": 0,
      "no-restricted-syntax": ["error", "ForInStatement", "LabeledStatement", "WithStatement"],
  }
  };