import '@testing-library/cypress/add-commands';

import './commands';

Cypress.on('uncaught:exception', (err) => {
    if (
        err.message.includes('ResizeObserver loop') ||
        err.message.includes('WebSocket') ||
        err.message.includes('msw')
    ) {
        return false;
    }
});

afterEach(() => {
    const testTitle = Cypress.currentTest.titlePath.join('--');
    const filename = testTitle.replace(/[^a-zA-Z0-9]/g, '_');

    cy.screenshot(filename, { capture: 'fullPage' });
});
