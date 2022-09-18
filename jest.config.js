/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  clearMocks: true,
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test-utils/jest.setup.js'],
  transform: {
    '^.+\\.(svg)$': '<rootDir>/src/test-utils/transformer.js',
    '^.+\\.(css|scss|sass)$': '<rootDir>/src/test-utils/transformer.js',
    '^.+\\.tsx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'ecmascript',
            jsx: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
};
