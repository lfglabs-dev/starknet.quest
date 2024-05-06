/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: "node",
  transform: {
    "\\.[jt]sx?$": "ts-jest",
  },
  setupFilesAfterEnv: ["./jest.setup.js"],
  moduleNameMapper: {
    "^@components/(.*)$": "<rootDir>/components/$1",
    "^@utils/(.*)$": "<rootDir>/utils/$1",
    "^@constants/(.*)$": "<rootDir>/constants/$1",
    "^@services/(.*)$": "<rootDir>/services/$1",
  },
  collectCoverage: true,
  coverageReporters: [["text"]],
  coverageThreshold: {
    "./utils/": {
      branches: 75,
      functions: 90,
      lines: 90,
      statements: -10,
    },
  },
};