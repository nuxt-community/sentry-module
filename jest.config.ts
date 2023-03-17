import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'node',
  // Crashes on CI - https://github.com/facebook/jest/issues/10662
  // collectCoverage: true,
  // collectCoverageFrom: [
  //   'dist/module.mjs',
  // ],
  setupFilesAfterEnv: [
    './test/setup.ts',
  ],
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node', 'd.ts'],
}

export default jestConfig
