module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['**/*.ts', '**/*.tsx'],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['lcov'],
  coveragePathIgnorePatterns: ['/node_modules/', '/interface/', '/packages\/extension/', '/coverage/'],
  coverageThreshold: {
    global: {
      statements: 0.34,
      branches: 0.34,
      functions: 0.34,
      lines: 0.34,
    },
  },
  testMatch: ['**/*.test.ts'],
};
