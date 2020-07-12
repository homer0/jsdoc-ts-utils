module.exports = {
  automock: true,
  clearMocks: true,
  collectCoverage: true,
  coverageProvider: 'v8',
  testPathIgnorePatterns: ['/node_modules/', '/utils/scripts/'],
  unmockedModulePathPatterns: ['/node_modules/', '/constants.js/'],
  testEnvironment: 'node',
};
