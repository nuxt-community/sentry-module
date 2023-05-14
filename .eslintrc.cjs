module.exports = {
  extends: [
    '@nuxtjs/eslint-config',
  ],
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'import/named': 'off',
    'import/namespace': 'off',
    'import/no-absolute-path': 'off',
    'no-console': [
      'error', {
        allow: ['assert', 'warn', 'error', 'info'],
      },
    ],
    'vue/multi-word-component-names': 'off',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        '@nuxtjs/eslint-config-typescript',
      ],
      rules: {
        'comma-dangle': 'off',
        'constructor-super': 'off', // ts(2335) & ts(2377)
        'getter-return': 'off', // ts(2378)
        'import/named': 'off',
        'no-const-assign': 'off', // ts(2588)
        'no-dupe-args': 'off', // ts(2300)
        'no-dupe-class-members': 'off', // ts(2393) & ts(2300)
        'no-dupe-keys': 'off', // ts(1117)
        'no-func-assign': 'off', // ts(2539)
        'no-import-assign': 'off', // ts(2539) & ts(2540)
        'no-new-symbol': 'off', // ts(2588)
        'no-obj-calls': 'off', // ts(2349)
        'no-redeclare': 'off', // ts(2451)
        'no-setter-return': 'off', // ts(2408)
        'no-this-before-super': 'off', // ts(2376)
        'no-undef': 'off', // ts(2304)
        'no-unreachable': 'off', // ts(7027)
        'no-unsafe-negation': 'off', // ts(2365) & ts(2360) & ts(2358)
        'no-var': 'error', // ts transpiles let/const to var, so no need for vars any more
        'prefer-const': 'error', // ts provides better types with const
        'prefer-rest-params': 'error', // ts provides better types with rest args over arguments
        'prefer-spread': 'error', // ts transpiles spread to apply, so no need for manual apply
        quotes: 'off',
        semi: 'off',
        'valid-typeof': 'off', // ts(2367)
        '@typescript-eslint/adjacent-overload-signatures': 'error',
        '@typescript-eslint/ban-ts-comment': 'error',
        '@typescript-eslint/ban-types': 'error',
        '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
        '@typescript-eslint/explicit-module-boundary-types': 'warn',
        'no-array-constructor': 'off',
        '@typescript-eslint/member-delimiter-style': ['error', { multiline: { delimiter: 'none', requireLast: false } }],
        '@typescript-eslint/no-array-constructor': 'error',
        'no-empty-function': 'off',
        '@typescript-eslint/no-empty-function': 'error',
        '@typescript-eslint/no-empty-interface': 'error',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-extra-non-null-assertion': 'error',
        'no-extra-semi': 'off',
        '@typescript-eslint/no-extra-semi': 'error',
        '@typescript-eslint/no-inferrable-types': 'error',
        '@typescript-eslint/no-misused-new': 'error',
        '@typescript-eslint/no-namespace': 'error',
        '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
        '@typescript-eslint/no-non-null-assertion': 'warn',
        '@typescript-eslint/no-this-alias': 'error',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-var-requires': 'error',
        '@typescript-eslint/prefer-as-const': 'error',
        '@typescript-eslint/prefer-namespace-keyword': 'error',
        '@typescript-eslint/quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: false }],
        '@typescript-eslint/semi': ['error', 'never'],
        '@typescript-eslint/triple-slash-reference': 'error',
      },
    },
  ],
}
