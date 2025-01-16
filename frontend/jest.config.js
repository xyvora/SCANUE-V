const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/frontend/$1",
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^@/lib/(.*)$": "<rootDir>/lib/$1",
    "^@/hooks/(.*)$": "<rootDir>/hooks/$1",
    "^@/types/(.*)$": "<rootDir>/types/$1",
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/coverage/**",
    "!**/cypress/**",
    "!**/types/**",
    "!**/mocks/**",
    "!**/__tests__/setup/**",
  ],
  coverageThreshold: {
    global: {
      statements: 40,
      branches: 30,
      functions: 30,
      lines: 40,
    },
  },
  moduleDirectories: ['node_modules', 'frontend'],
};

module.exports = createJestConfig(customJestConfig);
