import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000',
        specPattern: 'cypress/e2e/**/*.cy.{ts,tsx}',
        supportFile: 'cypress/support/e2e.ts',
        screenshotsFolder: 'cypress/screenshots',
        viewportWidth: 1280,
        viewportHeight: 720,
        video: false,
        screenshotOnRunFailure: true,
        defaultCommandTimeout: 8000,
        requestTimeout: 10000,
        setupNodeEvents(_on, config) {
            return config;
        },
    },
});