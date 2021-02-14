module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    allowImportExportEverywhere: false
  },
  env: {
    browser: true,
  },
  extends: [
    'airbnb-base'
  ],
  plugins: [
    'eslint-plugin-local-rules',
  ],
  'settings': {
    'import/resolver': {
      webpack: {
        config: 'build/base.conf.js'
      }
    }
  },
  rules: {
    'local-rules/custom-logs': 0,
    'local-rules/definedundefined': 2,
    'local-rules/no-boolean-trap': 'warn',
    'no-template-curly-in-string': 2,
    'no-plusplus': 0,
    'radix': 0,
    'operator-linebreak': ['error', 'after'],
    'valid-jsdoc': [2, {
      requireReturn: false,
      requireParamDescription: true,
      requireReturnDescription: true,
      'preferType': {
        'Boolean': 'boolean',
        'Number': 'number',
        'Integer': 'number',
        'integer': 'number',
        'Double': 'number',
        'double': 'number',
        'Float': 'number',
        'float': 'number',
        'object': 'Object',
        'String': 'string'
      }
    }],
    'no-useless-constructor': 2,
    'max-len': ['error', 100, 2, {
      ignoreUrls: true,
      ignoreComments: true,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],
    'func-names': 0,
    'no-underscore-dangle': 0,
    'no-return-assign': 2,
    'no-invalid-this': 2,
    'arrow-parens': [2, 'always'],
    'class-methods-use-this': 2,
    'no-param-reassign': [2, {
      'props': false
    }],
    'comma-dangle': 0,
    'no-bitwise': 0,
    'no-mixed-operators': [2, {
      'groups': [
        ['&', '|', '^', '~', '<<', '>>', '>>>'],
        ['&&', '||']
      ],
      'allowSamePrecedence': true
    }],
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    'import/no-extraneous-dependencies': ['error', {
      'devDependencies': true
    }],
    'import/prefer-default-export': 1,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 1,
    'no-restricted-syntax': 0,
    'no-tabs': 0,
    'function-paren-newline': 'off',
    'space-before-function-paren': [2, {
      'anonymous': 'never',
      'named': 'never',
      'asyncArrow': 'always'
    }],
    'object-curly-newline': [2, {
      'ObjectExpression': {
        'multiline': true,
        'consistent': true
      },
      'ObjectPattern': {
        'multiline': true,
        'consistent': true
      },
    }],
    'no-mixed-spaces-and-tabs': [2, 'smart-tabs'],
    'implicit-arrow-linebreak': 'off',
    'operator-linebreak': 'off',
    'indent': [2, 'tab', {
      'SwitchCase': 1
    }]
  }
};
