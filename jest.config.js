/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@databases/(.*)$': '<rootDir>/src/databases/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@api\\-server/(.*)$': '<rootDir>/src/api-server/$1',
    '^@chat\\-server/(.*)$': '<rootDir>/src/chat-server/$1'
  }
};