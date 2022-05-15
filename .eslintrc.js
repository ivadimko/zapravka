module.exports = {
  extends: [
    'airbnb-typescript',
    'plugin:react-hooks/recommended',
    'next/core-web-vitals'
  ],
  parserOptions: {
    project: `${__dirname}/tsconfig.json`,
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/prop-types': 'off',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'import/prefer-default-export': 'off',
    'max-len': ['error', 80, {
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
      ignoreComments: true,
    }],
    'no-underscore-dangle': 'off',
    'jsx-a11y/anchor-is-valid': ['error', {
      components: ['Link'],
      specialLink: ['hrefLeft', 'hrefRight'],
      aspects: ['invalidHref', 'preferButton'],
    }],
    'react-hooks/exhaustive-deps': 'error',
  },
  ignorePatterns: [
    '**/*/graphql/generated.ts',
  ],
};
