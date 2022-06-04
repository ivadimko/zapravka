module.exports = {
  extends: [
    'airbnb-base',
  ],
  settings: {
    'import/resolver': {
      node: { extensions: ['.js', '.mjs', '.cjs'] }
    }
  },
  rules: {
    'import/prefer-default-export': 'off',
    "import/extensions": [
      "error",
      "always",
      {
        ".js": "never",
        ".mjs": "never",
        ".cjs": "never",
      }
    ],
    'max-len': ['error', 80, {
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
      ignoreComments: true,
    }],
  },
};
