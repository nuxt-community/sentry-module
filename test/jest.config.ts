import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    '../dist/module.cjs',
    '../dist/module.mjs',
    '../src/module.ts',
  ],
  coverageDirectory: '../coverage',
  setupFilesAfterEnv: [
    './setup.ts',
  ],
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node', 'd.ts'],
}

export default jestConfig
