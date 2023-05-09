import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    {
      builder: 'mkdist',
      input: './src/templates/',
      outDir: './dist/templates',
      ext: 'js',
      declaration: false,
    },
  ],
  externals: [
    '@nuxt/types',
    '@sentry/browser',
    '@sentry/cli',
    '@sentry/core',
    '@sentry/node',
    '@sentry/types',
    '@sentry/webpack-plugin',
    'consola',
    'hash-sum',
    'hookable',
    'pathe',
    'webpack',
    'vuex',
  ],
})
