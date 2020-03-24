/* eslint-disable no-template-curly-in-string */
module.exports = {
  git: {
    commitMessage: 'chore: release ${version}',
    tagName: 'v${version}'
  },
  npm: {
    publish: true
  },
  github: {
    release: true,
    releaseName: '${version}'
  },
  plugins: {
    '@release-it/conventional-changelog': {
      preset: 'conventionalcommits',
      infile: 'CHANGELOG.md'
    }
  }
}
