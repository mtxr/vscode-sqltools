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
      statements: 0.36,
      branches: 0.36,
      functions: 0.36,
      lines: 0.36,
    },
  },
  testMatch: ['**/*.test.ts'],
};
