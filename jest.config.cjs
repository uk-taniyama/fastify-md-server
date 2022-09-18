// eslint-disable-next-line import/no-extraneous-dependencies
const yargs = require('yargs');

const args = yargs(process.argv).parse();

const coverage = args.coverage === true;
const reporters = ['default'];
if (coverage) {
  reporters.push(['jest-html-reporters', {
    publicPath: './test-result/html',
    filename: 'report.html',
    openReport: true,
  }]);
}

const esmodules = [
].join('|');

module.exports = {
  roots: [
    '<rootDir>/src',
  ],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transformIgnorePatterns: [
    `node_modules/(?!(${esmodules})/)`,
  ],
  coverageDirectory: './test-result/coverage/',
  reporters,
  setupFilesAfterEnv: ['jest-extended/all'],
  transform: {
    '.+\\.(t|j)sx?$': [
      'esbuild-jest', {
        sourcemap: true,
        loaders: {
          '.spec.ts': 'tsx',
        },
      },
    ],
  },
};
