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
    releaseNotes: 'echo "${changelog}" | sed 1,2d',
  },
  plugins: {
    '@release-it/conventional-changelog': {
      preset: 'conventionalcommits',
      infile: 'CHANGELOG.md',
    },
  },
}
