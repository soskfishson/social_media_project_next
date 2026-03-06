/// <reference types="cypress" />

Cypress.Commands.add('loginViaLocalStorage', (user = {}) => {
    const defaultUser = {
        id: 1,
        username: 'testuser',
        firstName: 'Test',
        secondName: 'User',
        email: 'test@test.com',
        profileImage: 'https://via.placeholder.com/40',
        description: 'Hello from E2E',
        ...user,
    };
    window.localStorage.setItem('accessToken', 'mock-e2e-token');
    window.localStorage.setItem('user', JSON.stringify(defaultUser));
});

Cypress.Commands.add('logout', () => {
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('user');
});

Cypress.Commands.add('interceptAuth', () => {
    cy.intercept('POST', '/api/login', {
        statusCode: 200,
        body: {
            token: 'mock-e2e-token',
            user: {
                id: 1,
                username: 'testuser',
                firstName: 'Test',
                secondName: 'User',
                email: 'test@test.com',
                profileImage: 'https://via.placeholder.com/40',
            },
        },
    }).as('login');

    cy.intercept('POST', '/api/signup', {
        statusCode: 201,
        body: { message: 'User created' },
    }).as('signup');

    cy.intercept('GET', '/api/me', {
        statusCode: 200,
        body: {
            id: 1,
            username: 'testuser',
            firstName: 'Test',
            secondName: 'User',
            email: 'test@test.com',
            profileImage: 'https://via.placeholder.com/40',
            description: 'Hello from E2E',
        },
    }).as('getMe');
});

Cypress.Commands.add('interceptPosts', (posts = []) => {
    const defaultPosts =
        posts.length > 0
            ? posts
            : [
                  {
                      id: 1,
                      title: 'First E2E Post',
                      content: 'Content of the first post',
                      authorId: 1,
                      likedByUsers: [],
                      likesCount: 0,
                      commentsCount: 0,
                      creationDate: new Date().toISOString(),
                      modifiedDate: new Date().toISOString(),
                      authorPhoto: '',
                  },
                  {
                      id: 2,
                      title: 'Second E2E Post',
                      content: 'Content of the second post',
                      authorId: 2,
                      likedByUsers: [],
                      likesCount: 3,
                      commentsCount: 1,
                      creationDate: new Date(Date.now() - 60000 * 60).toISOString(),
                      modifiedDate: new Date().toISOString(),
                      authorPhoto: '',
                  },
              ];

    cy.intercept('POST', '/api/graphql', {
        statusCode: 200,
        body: { data: { allPosts: defaultPosts } },
    }).as('getPosts');

    cy.intercept('GET', '/api/getSuggested', { statusCode: 200, body: [] }).as('getSuggested');
    cy.intercept('GET', '/api/groups', { statusCode: 200, body: [] }).as('getGroups');
});

Cypress.Commands.add('interceptProfile', () => {
    cy.intercept('PUT', '/api/profile', (req) => {
        req.reply({
            statusCode: 200,
            body: {
                id: 1,
                username: req.body.username || 'testuser',
                email: req.body.email || 'test@test.com',
                firstName: 'Test',
                secondName: 'User',
                description: req.body.description || '',
                profileImage: 'https://via.placeholder.com/40',
            },
        });
    }).as('updateProfile');
});

Cypress.Commands.add('fillSignInForm', (email: string, password: string) => {
    cy.get('[data-testid="input-control"]').eq(0).clear().type(email).blur();
    cy.get('[data-testid="input-control"]').eq(1).clear().type(password).blur();
    cy.contains('button', /Sign In/i).should('not.be.disabled');
});

Cypress.Commands.add('fillSignUpForm', (email: string, password: string) => {
    cy.get('[data-testid="input-control"]').eq(0).clear().type(email).blur();
    cy.get('[data-testid="input-control"]').eq(1).clear().type(password).blur();
});

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Cypress {
        interface Chainable {
            loginViaLocalStorage(user?: Record<string, unknown>): Chainable<void>;
            logout(): Chainable<void>;
            interceptAuth(): Chainable<void>;
            interceptPosts(posts?: unknown[]): Chainable<void>;
            interceptProfile(): Chainable<void>;
            fillSignInForm(email: string, password: string): Chainable<void>;
            fillSignUpForm(email: string, password: string): Chainable<void>;
        }
    }
}

export {};
