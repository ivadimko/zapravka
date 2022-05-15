module.exports = {
  extends: [
    'next/core-web-vitals',
    'airbnb',
    'airbnb-typescript',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    project: `${__dirname}/tsconfig.json`,
  },
  rules: {
    'react/jsx-key': 'error',
    '@next/next/no-img-element': 'error',
    'react/function-component-definition': 'off',
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
    'import/extensions': 'off',
  },
  ignorePatterns: [
    '**/*/graphql/generated.ts',
  ],
};
