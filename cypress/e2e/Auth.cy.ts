/// <reference types="cypress" />

export {};

describe('Authentication — Sign In', () => {
    beforeEach(() => {
        cy.interceptAuth();
        cy.visit('/signin');
    });

    it('renders the Sign In page with correct heading', () => {
        cy.contains('h1', /Sign in into an account/i).should('be.visible');
    });

    it('renders email and password inputs', () => {
        cy.get('[data-testid="input-control"]').should('have.length', 2);
    });

    it('shows inline validation error for malformed email after blur', () => {
        cy.get('[data-testid="input-control"]').eq(0).type('not-an-email').blur();
        cy.get('[data-testid="input-error"]').should('contain.text', 'Email is not valid');
    });

    it('clears the email error when a valid email is typed', () => {
        cy.get('[data-testid="input-control"]').eq(0).type('bad').blur();
        cy.get('[data-testid="input-error"]').should('be.visible');
        cy.get('[data-testid="input-control"]').eq(0).clear().type('good@email.com').blur();
        cy.get('[data-testid="input-error"]').should('not.exist');
    });

    it('shows a valid checkmark when email is correctly formatted', () => {
        cy.get('[data-testid="input-control"]').eq(0).type('valid@test.com').blur();
        cy.contains('✓').should('be.visible');
    });

    it('shows error toast when submitting empty form', () => {
        cy.contains('button', /Sign In/i).click();
        cy.contains(/Please check your input fields/i).should('be.visible');
    });

    it('redirects to home page after successful sign-in', () => {
        cy.fillSignInForm('helena.hills@social.com', 'password789');
        cy.contains('button', /Sign In/i).click();
        cy.url().should('eq', Cypress.config('baseUrl') + '/');
    });

    it('shows error toast on failed sign-in', () => {
        cy.intercept('POST', '/api/login', {
            statusCode: 401,
            body: { message: 'Invalid credentials' },
        }).as('failLogin');

        cy.fillSignInForm('wrong@email.com', 'wrongpass');
        cy.contains('button', /Sign In/i).click();
        cy.contains(/Failed to sign into account/i).should('be.visible');
    });

    it('has a link to the Sign Up page', () => {
        cy.contains('a', /Sign up/i).should('have.attr', 'href', '/signup');
    });

    it('renders the footer', () => {
        cy.contains('© 2026 Sidekick').should('be.visible');
    });
});

describe('Authentication — Sign Up', () => {
    beforeEach(() => {
        cy.interceptAuth();
        cy.visit('/signup');
    });

    it('renders the Create an account heading', () => {
        cy.contains('h1', /Create an account/i).should('be.visible');
    });

    it('submit button is disabled when the form is pristine', () => {
        cy.contains('button', /Sign Up/i).should('be.disabled');
    });

    it('shows email validation error after blur', () => {
        cy.fillSignUpForm('not-valid', 'anypass');
        cy.contains(/Email is not valid/i).should('be.visible');
    });

    it('shows password too-short error after blur', () => {
        cy.fillSignUpForm('valid@test.com', 'short');
        cy.contains(/Password must be at least 8 characters/i).should('be.visible');
    });

    it('shows password success message for a strong password', () => {
        cy.fillSignUpForm('valid@test.com', 'strongpassword789');
        cy.get('[data-testid="input-success"]').should('contain.text', 'Your password is strong');
    });

    it('submit button is disabled while the form has errors', () => {
        cy.fillSignUpForm('bad-email', 'short');
        cy.contains('button', /Sign Up/i).should('be.disabled');
    });

    it('submit button becomes enabled when form is valid', () => {
        cy.fillSignUpForm('new@user.com', 'validpassword');
        cy.contains('button', /Sign Up/i).should('not.be.disabled');
    });

    it('renders Terms of Service and Privacy Policy links', () => {
        cy.contains('a', /Terms of Service/i).should('have.attr', 'href', '/terms');
        cy.contains('a', /Privacy Policy/i).should('have.attr', 'href', '/privacy');
    });

    it('has a link back to the Sign In page', () => {
        cy.contains('a', /Sign in/i).should('have.attr', 'href', '/signin');
    });
});

describe('Authentication — Logout & Protected Routes', () => {
    it('redirects unauthenticated user from /profile to /signin', () => {
        cy.logout();
        cy.visit('/profile');
        cy.url().should('include', '/signin');
    });

    it('allows authenticated user to visit /profile', () => {
        cy.interceptAuth();
        cy.interceptProfile();
        cy.loginViaLocalStorage();
        cy.visit('/profile');
        cy.url().should('include', '/profile');
        cy.contains('Edit profile').should('be.visible');
    });

    it('clears session on logout', () => {
        cy.interceptAuth();
        cy.interceptPosts();
        cy.interceptProfile();
        cy.loginViaLocalStorage();
        cy.visit('/profile');

        cy.get('[data-testid="logout-button"]').click();

        cy.window().its('localStorage').invoke('getItem', 'accessToken').should('be.null');
        cy.window().its('localStorage').invoke('getItem', 'user').should('be.null');
    });
});
