module.exports = {
  preset: 'react-native',
  modulePathIgnorePatterns: [
    '<rootDir>/lib/',
    '<rootDir>/example/node_modules/',
  ],
  moduleNameMapper: {
    '^react-test-renderer$': 'react-test-renderer',
    '^test-renderer$': 'react-test-renderer',
  },
};
