import type { Config } from 'jest'

const config: Config = {
  projects: [
    {
      displayName: 'node',
      testEnvironment: 'node',
      preset: 'ts-jest',
      roots: ['<rootDir>/src'],
      testMatch: ['**/__tests__/**/*.test.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
      transform: {
        '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
      },
      setupFiles: ['<rootDir>/jest.setup.ts'],
    },
    {
      displayName: 'components',
      testEnvironment: 'jsdom',
      preset: 'ts-jest',
      roots: ['<rootDir>/src'],
      testMatch: ['**/__tests__/**/*.test.tsx'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|less|scss)$': '<rootDir>/src/__mocks__/styleMock.js',
      },
      transform: {
        '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
      },
      setupFiles: ['<rootDir>/jest.setup.ts'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.dom.ts'],
    },
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/__tests__/**',
    '!src/**/*.test.{ts,tsx}',
    '!src/app/**/page.tsx',
    '!src/app/**/layout.tsx',
    '!src/app/**/loading.tsx',
    '!src/app/**/error.tsx',
    '!src/app/**/not-found.tsx',
    '!src/app/**/_components/**',
    '!src/app/**/_actions/**',
    '!src/providers/**',
    '!src/features/**/index.ts',
    '!src/components/icons/**',
    '!src/store.tsx',
    '!src/providers/editor-provider.tsx',
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 12,
      functions: 13,
      lines: 17,
      statements: 16,
    },
  },
}

export default config
