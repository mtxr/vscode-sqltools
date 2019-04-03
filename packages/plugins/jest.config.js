module.exports = {
  ...(require('../../test/config/baseConfig')),
  preset: 'ts-jest/presets/js-with-babel',
  collectCoverageFrom: ['**/*.ts', '**/*.tsx'],
  coverageDirectory: '<rootDir>/../../coverage/plugins',
  coverageThreshold: {
    global: {
      statements: 0.34,
      branches: 0.34,
      functions: 0.34,
      lines: 0.34,
    },
  },
  testMatch: ['**/*.test.(ts)'],
};
