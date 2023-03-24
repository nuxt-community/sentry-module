/* eslint-disable no-template-curly-in-string */
module.exports = {
  git: {
    commitMessage: 'chore: release ${version}',
    tagName: 'v${version}',
  },
  npm: {
    publish: false,
  },
  github: {
    release: true,
    releaseName: '${version}',
    releaseNotes (ctx) {
      // Remove first, redundant line with the version and the date.
      return ctx.changelog.split('\n').slice(1).join('\n')
    }
  },
  plugins: {
    '@release-it/conventional-changelog': {
      preset: 'conventionalcommits',
      infile: 'CHANGELOG.md',
    },
  },
}
