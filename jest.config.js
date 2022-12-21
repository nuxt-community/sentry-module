module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    'lib/module.js',
  ],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/lib/$1',
    '^~~$': '<rootDir>',
    '^@@$': '<rootDir>',
    '^@/(.*)$': '<rootDir>/lib/$1',
  },
  setupFilesAfterEnv: [
    './test/setup',
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
}
