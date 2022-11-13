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
    '@sentry/webpack-plugin',
    'webpack',
    '@sentry/tracing',
    '@sentry/types',
    '@sentry/browser',
    '@sentry/node',
    '@sentry/cli',
    '@sentry/minimal',
    'vuex',
    '@nuxt/types',
  ],
})
