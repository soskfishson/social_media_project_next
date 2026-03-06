/// <reference types="cypress" />

export {};

const NAV_USER = {
    id: 1,
    username: 'testuser',
    firstName: 'Test',
    secondName: 'User',
    email: 'test@test.com',
    profileImage: 'https://via.placeholder.com/40',
};

describe('Header — unauthenticated', () => {
    beforeEach(() => {
        cy.logout();
        cy.interceptPosts([]);
        cy.visit('/');
    });

    it('renders Sign In and Sign Up links', () => {
        cy.get('[data-testid="signin-link"]')
            .should('be.visible')
            .and('have.attr', 'href', '/signin');
        cy.get('[data-testid="signup-link"]')
            .should('be.visible')
            .and('have.attr', 'href', '/signup');
    });

    it('clicking Sign In navigates to /signin', () => {
        cy.interceptAuth();
        cy.get('[data-testid="signin-link"]').click();
        cy.url().should('include', '/signin');
    });

    it('clicking Sign Up navigates to /signup', () => {
        cy.interceptAuth();
        cy.get('[data-testid="signup-link"]').click();
        cy.url().should('include', '/signup');
    });

    it('clicking the logo navigates to /', () => {
        cy.visit('/signin');
        cy.get('.header-logo-container').click();
        cy.url().should('eq', Cypress.config('baseUrl') + '/');
    });
});

describe('Header — authenticated', () => {
    beforeEach(() => {
        cy.interceptAuth();
        cy.interceptPosts([]);
        cy.loginViaLocalStorage(NAV_USER);
        cy.visit('/');
    });

    it("renders the user's full name", () => {
        cy.contains('Test User').should('be.visible');
    });

    it('renders user avatar with correct src', () => {
        cy.get('.header-avatar').should('have.attr', 'src', NAV_USER.profileImage);
    });

    it('does not render Sign In / Sign Up links', () => {
        cy.get('[data-testid="signin-link"]').should('not.exist');
        cy.get('[data-testid="signup-link"]').should('not.exist');
    });

    it('profile link navigates to /profile', () => {
        cy.interceptProfile();
        cy.get('.header-right-side-logged').click();
        cy.url().should('include', '/profile');
    });
});

describe('Burger Menu — toggle behaviour', () => {
    beforeEach(() => {
        cy.viewport(390, 844);
        cy.logout();
        cy.interceptPosts([]);
        cy.visit('/');
    });

    it('burger menu is closed by default', () => {
        cy.get('[data-testid="burger-nav"]').should('not.have.class', 'open');
    });

    it('clicking the burger button opens the menu', () => {
        cy.get('[data-testid="burger-button"]').click();
        cy.get('[data-testid="burger-nav"]').should('have.class', 'open');
    });

    it('clicking the burger button again closes the menu', () => {
        cy.get('[data-testid="burger-button"]').click();
        cy.get('[data-testid="burger-button"]').click();
        cy.get('[data-testid="burger-nav"]').should('not.have.class', 'open');
    });

    it('shows overlay when the menu is open', () => {
        cy.get('[data-testid="burger-button"]').click();
        cy.get('.burger-overlay').should('be.visible');
    });

    it('clicking the overlay closes the menu', () => {
        cy.get('[data-testid="burger-button"]').click();
        cy.get('.burger-overlay').click({ force: true });
        cy.get('[data-testid="burger-nav"]').should('not.have.class', 'open');
    });
});

describe('Burger Menu — unauthenticated links', () => {
    beforeEach(() => {
        cy.viewport(390, 844);
        cy.logout();
        cy.interceptPosts([]);
        cy.visit('/');
        cy.get('[data-testid="burger-button"]').click();
    });

    it('shows Sign in and Sign up links', () => {
        cy.get('[data-testid="burger-signin-link"]').should('be.visible');
        cy.get('[data-testid="burger-signup-link"]').should('be.visible');
    });

    it('does not show Profile info when unauthenticated', () => {
        cy.contains('Profile info').should('not.exist');
    });

    it('clicking burger Sign In navigates to /signin', () => {
        cy.interceptAuth();
        cy.get('[data-testid="burger-signin-link"]').click();
        cy.url().should('include', '/signin');
    });

    it('clicking burger Sign Up navigates to /signup', () => {
        cy.interceptAuth();
        cy.get('[data-testid="burger-signup-link"]').click();
        cy.url().should('include', '/signup');
    });
});

describe('Burger Menu — authenticated links', () => {
    beforeEach(() => {
        cy.viewport(390, 844);
        cy.interceptAuth();
        cy.interceptPosts([]);
        cy.loginViaLocalStorage(NAV_USER);
        cy.visit('/');
        cy.get('[data-testid="burger-button"]').click();
    });

    it('shows Profile info and Statistics links', () => {
        cy.contains('Profile info').should('be.visible');
        cy.contains('Statistics').should('be.visible');
    });

    it('hides sign-in / sign-up links when authenticated', () => {
        cy.get('[data-testid="burger-signin-link"]').should('not.exist');
        cy.get('[data-testid="burger-signup-link"]').should('not.exist');
    });

    it('clicking Profile info navigates to /profile', () => {
        cy.interceptProfile();
        cy.contains('Profile info').click();
        cy.url().should('include', '/profile');
    });

    it('renders user avatar in the burger menu', () => {
        cy.get('.burger-profile-avatar').should('have.attr', 'src', NAV_USER.profileImage);
    });
});

describe('Routing — 404 error page', () => {
    it('shows 404 error page for unknown routes', () => {
        cy.logout();
        cy.visit('/this-route-does-not-exist', { failOnStatusCode: false });
        cy.contains(/Page not found/i).should('be.visible');
        cy.get('[data-testid="error-message"]').should('be.visible');
    });

    it('renders the simple header on the 404 page', () => {
        cy.logout();
        cy.visit('/unknown-path', { failOnStatusCode: false });
        cy.get('.header-simple').should('be.visible');
    });

    it('renders the footer on the 404 page', () => {
        cy.logout();
        cy.visit('/unknown-path', { failOnStatusCode: false });
        cy.contains('© 2026 Sidekick').should('be.visible');
    });
});

describe('Full user navigation journey', () => {
    it('authenticated user can navigate home → profile → home', () => {
        cy.interceptAuth();
        cy.interceptPosts([]);
        cy.interceptProfile();
        cy.loginViaLocalStorage(NAV_USER);

        cy.visit('/');
        cy.get('.header-right-side-logged').click();
        cy.url().should('include', '/profile');
        cy.contains('Edit profile').should('be.visible');

        cy.get('.header-logo-container').click();
        cy.url().should('eq', Cypress.config('baseUrl') + '/');
    });
});
