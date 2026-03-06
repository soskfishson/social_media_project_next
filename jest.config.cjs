/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',

    moduleNameMapper: {
        '\\.css$': 'identity-obj-proxy',
        '\\.svg$': '<rootDir>/src/tests/__mocks__/svgMock.js',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/src/tests/__mocks__/fileMock.js',
        '^next/navigation$': 'next-router-mock',
        '^next/router$': 'next-router-mock',
        '^@/(.*)$': '<rootDir>/src/$1',
    },

    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.jest.json',
            },
        ],
    },

    setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],
    moduleDirectories: ['node_modules', 'src'],
    coverageReporters: ['html', 'json-summary', 'lcov', 'text'],
    coverageDirectory: 'coverage',
    testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};