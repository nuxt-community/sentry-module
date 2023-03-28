import type { JestConfigWithTsJest } from 'ts-jest'
import { JS_EXT_TO_TREAT_AS_ESM, TS_EXT_TO_TREAT_AS_ESM } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  extensionsToTreatAsEsm: [...JS_EXT_TO_TREAT_AS_ESM, ...TS_EXT_TO_TREAT_AS_ESM],
  testEnvironment: 'node',
  transform: {
    '^.+\\.m?[tj]sx?$': ['ts-jest', { useESM: true, tsconfig: './test/tsconfig-jest.json' }],
  },
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
