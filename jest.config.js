module.exports = {
  ...(require('./test/config/baseConfig')),
  preset: 'ts-jest',
  collectCoverageFrom: ['<rootDir>/packages/**/*.ts', '<rootDir>/packages/**/*.tsx'],
  coverageDirectory: '<rootDir>/coverage',
  coverageThreshold: {
    global: {
      statements: 13,
      branches: 7,
      functions: 16,
      lines: 14,
    },
  },
  testMatch: ['**/*.test.(ts)'],
};
