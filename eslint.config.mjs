import base from 'eslint-config-rchl-base'
import typescript from 'eslint-config-rchl-typescript'
import vue from 'eslint-config-rchl-vue'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      '**/.nuxt/',
      '**/dist/',
      '**/templates/',
      'node_modules/',
    ],
  },
  ...base,
  ...typescript,
  ...vue,
  {
    rules: {
      '@stylistic/indent': [
        'error', 2, {
          SwitchCase: 1,
        },
      ],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/space-before-function-paren': ['error', 'always'],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@stylistic/ts/indent': [
        'error', 2, {
          SwitchCase: 1,
          FunctionDeclaration: { parameters: 'first' },
          FunctionExpression: { parameters: 'first' },
          CallExpression: { arguments: 'first' },
        },
      ],
      '@stylistic/ts/member-delimiter-style': [
        'error', {
          multiline: {
            delimiter: 'none',
          },
        },
      ],
      '@stylistic/ts/semi': ['error', 'never'],
      '@stylistic/ts/space-before-function-paren': ['error', 'always'],
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      'vue/html-indent': ['error', 2],
      'vue/script-indent': ['error', 2, { switchCase: 1 }],
    },
  },
  {
    files: ['**/.nuxt/*.js'],
    rules: {
      '@stylistic/comma-spacing': 'off',
      '@stylistic/key-spacing': 'off',
      '@stylistic/object-curly-spacing': 'off',
      '@stylistic/quote-props': 'off',
      '@stylistic/quotes': 'off',
    },
  },
]
