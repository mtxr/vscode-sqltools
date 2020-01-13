module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/node_modules/', '/interface/', '/coverage/', '/out/', '/.vscode/', '/.vscode-test/', '/test/'],
  watchPathIgnorePatterns: ['/node_modules/', '/interface/', '/coverage/', '/out/', '/.vscode/', '/.vscode-test/', '/test/'],
  coverageReporters: ['json', 'lcov', 'text-summary'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': require.resolve(
      './../__mocks__/fileMock'
    ),
    '\\.(css|less|scss|sass)$': require.resolve('./../__mocks__/styleMock'),
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  moduleDirectories: ['node_modules'],
};
