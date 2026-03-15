/// <reference types="cypress" />

export {};

const E2E_POSTS = [
    {
        id: 1,
        title: 'Hello Cypress',
        content: 'This is post one for E2E testing',
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
        title: 'Already Liked Post',
        content: 'This post is pre-liked by the current user',
        authorId: 2,
        likedByUsers: [{ id: 1, username: 'testuser' }],
        likesCount: 1,
        commentsCount: 0,
        creationDate: new Date(Date.now() - 3600000).toISOString(),
        modifiedDate: new Date().toISOString(),
        authorPhoto: '',
    },
];

const POSTS_USER = {
    id: 1,
    username: 'testuser',
    firstName: 'Test',
    secondName: 'User',
    email: 'test@test.com',
    profileImage: '/assets/user-helena.png',
};

describe('Main Page — loading states', () => {
    it('shows skeleton loaders while posts are fetching', () => {
        cy.interceptAuth();
        cy.loginViaLocalStorage(POSTS_USER);

        cy.intercept('POST', '**/api/graphql', (req) => {
            req.reply({ delay: 60000, body: {} });
        }).as('slowPosts');
        cy.intercept('GET', '**/api/getSuggested', { body: [] });
        cy.intercept('GET', '**/api/groups', { body: [] });

        cy.visit('/');
        cy.get('[data-testid="main-loader"]').should('be.visible');
    });

    it('hides loaders and renders posts after data resolves', () => {
        cy.interceptAuth();
        cy.interceptPosts(E2E_POSTS);
        cy.loginViaLocalStorage(POSTS_USER);

        cy.visit('/');
        cy.contains('Hello Cypress').should('be.visible');
        cy.contains('Already Liked Post').should('be.visible');
        cy.get('[data-testid="main-loader"]').should('not.exist');
    });
});

describe('Main Page — authenticated layout', () => {
    beforeEach(() => {
        cy.interceptAuth();
        cy.interceptPosts(E2E_POSTS);
        cy.loginViaLocalStorage(POSTS_USER);
        cy.visit('/');
        cy.contains('Hello Cypress').should('be.visible');
    });

    it('renders the header', () => {
        cy.get('.header').should('be.visible');
    });

    it('renders the footer', () => {
        cy.contains('© 2026 Sidekick').should('be.visible');
    });

    it('renders the CreatePostForm for authenticated users', () => {
        cy.get('[placeholder="What\'s happening?"]').should('be.visible');
    });

    it('renders the sidebar for authenticated users', () => {
        cy.get('aside.sidebar').should('be.visible');
    });

    it("shows the user's full name in the header", () => {
        cy.contains('Test User').should('be.visible');
    });

    it('header profile link points to /profile', () => {
        cy.get('.header-right-side-logged').should('have.attr', 'href', '/profile');
    });
});

describe('Main Page — unauthenticated layout', () => {
    beforeEach(() => {
        cy.interceptPosts(E2E_POSTS);
        cy.logout();

        cy.intercept('GET', '**/api/me', {
            statusCode: 401,
            body: { message: 'Unauthorized' },
        }).as('getMeLoggedOut');

        cy.visit('/');
        cy.contains('Hello Cypress').should('be.visible');
    });

    it('does not render CreatePostForm when logged out', () => {
        cy.get('[placeholder="What\'s happening?"]').should('not.exist');
    });

    it('does not render the sidebar when logged out', () => {
        cy.get('aside.sidebar').should('not.exist');
    });

    it('renders Sign In and Sign Up links in the header', () => {
        cy.get('[data-testid="signin-link"]').should('be.visible');
        cy.get('[data-testid="signup-link"]').should('be.visible');
    });
});

describe('Posts — like interactions (Authenticated)', () => {
    beforeEach(() => {
        cy.interceptAuth();
        cy.interceptPosts(E2E_POSTS);
        cy.loginViaLocalStorage(POSTS_USER);
        cy.visit('/');
        cy.contains('Hello Cypress').should('be.visible');
    });

    it('shows correct like count for each post', () => {
        cy.get('[data-testid="like-button"]').eq(0).should('contain.text', '0 likes');
        cy.get('[data-testid="like-button"]').eq(1).should('contain.text', '1 likes');
    });

    it('calls /api/like when liking an un-liked post', () => {
        cy.intercept('POST', '**/api/like', {
            statusCode: 200,
            body: { status: 'liked', postId: 1, newLikesCount: 1 },
        }).as('likePost');

        cy.get('[data-testid="like-button"]').eq(0).click();
        cy.wait('@likePost').its('request.body').should('deep.equal', { postId: 1 });
    });

    it('calls /api/dislike when un-liking an already-liked post', () => {
        cy.intercept('POST', '**/api/dislike', {
            statusCode: 200,
            body: { status: 'disliked', postId: 2, newLikesCount: 0 },
        }).as('dislikePost');

        cy.get('[data-testid="like-button"]').eq(1).click();
        cy.wait('@dislikePost').its('request.body').should('deep.equal', { postId: 2 });
    });
});

describe('Posts — interactions (Unauthenticated)', () => {
    beforeEach(() => {
        cy.interceptPosts(E2E_POSTS);
        cy.logout();

        cy.intercept('GET', '**/api/me', {
            statusCode: 401,
            body: { message: 'Unauthorized' },
        }).as('getMeLoggedOut');

        cy.visit('/');
        cy.contains('Hello Cypress').should('be.visible');
    });

    it('shows error toast when trying to like a post while logged out', () => {
        cy.get('[data-testid="like-button"]').eq(0).click();

        cy.contains(/(Login to like posts|posts\.loginToLike)/i).should('be.visible');
    });
});

describe('Posts — comment interactions', () => {
    beforeEach(() => {
        cy.interceptAuth();
        cy.interceptPosts(E2E_POSTS);
        cy.loginViaLocalStorage(POSTS_USER);

        cy.intercept('GET', '**/api/posts/*/comments', { statusCode: 200, body: [] }).as(
            'getComments',
        );
        cy.intercept('POST', '**/api/comments', (req) => {
            req.reply({
                statusCode: 201,
                body: {
                    id: 99,
                    text: req.body.text,
                    authorId: 1,
                    postId: req.body.postId,
                    creationDate: new Date().toISOString(),
                    modifiedDate: new Date().toISOString(),
                },
            });
        }).as('postComment');

        cy.visit('/');
        cy.contains('Hello Cypress').should('be.visible');
    });

    it('reveals the comment form when the comment toggle is clicked', () => {
        cy.get('[data-testid="comment-toggle"]').eq(0).click();
        cy.get('[data-testid="comment-input"]').first().should('be.visible');
    });

    it('submit button is enabled when comment text is present', () => {
        cy.get('[data-testid="comment-toggle"]').eq(0).click();
        cy.get('[data-testid="comment-input"]')
            .first()
            .find('textarea')
            .first()
            .type('A great post!');
        cy.get('[data-testid="comment-submit"]').first().should('not.be.disabled');
    });

    it('submits a comment and calls /api/comments with correct payload', () => {
        cy.get('[data-testid="comment-toggle"]').eq(0).click();
        cy.get('[data-testid="comment-input"]')
            .first()
            .find('textarea')
            .first()
            .type('My E2E comment');
        cy.get('[data-testid="comment-submit"]').first().click();

        cy.wait('@postComment')
            .its('request.body')
            .should('include', { postId: 1, text: 'My E2E comment' });
    });

    it('shows success toast after comment is posted', () => {
        cy.get('[data-testid="comment-toggle"]').eq(0).click();
        cy.get('[data-testid="comment-input"]')
            .first()
            .find('textarea')
            .first()
            .type('Toast test comment');
        cy.get('[data-testid="comment-submit"]').first().click();
        cy.wait('@postComment');
        cy.contains('Comment published!').should('be.visible');
    });

    it('clears the textarea after a successful comment submission', () => {
        cy.get('[data-testid="comment-toggle"]').eq(0).click();
        cy.get('[data-testid="comment-input"]')
            .first()
            .find('textarea')
            .first()
            .type('Will be cleared');
        cy.get('[data-testid="comment-submit"]').first().click();
        cy.wait('@postComment');
        cy.get('[data-testid="comment-input"]')
            .first()
            .find('textarea')
            .first()
            .should('have.value', '');
    });
});

describe('Create Post — full flow', () => {
    beforeEach(() => {
        cy.interceptAuth();
        cy.interceptPosts(E2E_POSTS);
        cy.loginViaLocalStorage(POSTS_USER);

        cy.intercept('POST', '**/api/posts', {
            statusCode: 201,
            body: {
                id: 99,
                title: 'New Post From E2E',
                content: 'Written by Cypress',
                authorId: 1,
                likedByUsers: [],
                commentsCount: 0,
                creationDate: new Date().toISOString(),
                modifiedDate: new Date().toISOString(),
            },
        }).as('createPost');

        cy.visit('/');
        cy.contains('Hello Cypress').should('be.visible');
    });

    it('successfully creates a post and shows success toast', () => {
        cy.get('[placeholder="What\'s happening?"]').type('New Post From E2E');
        cy.contains('button', /Tell everyone/i).click();

        cy.get('.create-post-modal [placeholder="Write description here..."]').type(
            'Written by Cypress',
        );
        cy.get('.create-post-modal').contains('button', 'Create').click();

        cy.wait('@createPost');
        cy.contains('Post created successfully!').should('be.visible');
    });

    it('closes the modal after successful post creation', () => {
        cy.get('[placeholder="What\'s happening?"]').type('Close After Create');
        cy.contains('button', /Tell everyone/i).click();

        cy.get('.create-post-modal [placeholder="Write description here..."]').type(
            'Some content here',
        );
        cy.get('.create-post-modal').contains('button', 'Create').click();

        cy.wait('@createPost');
        cy.get('.create-post-modal').should('not.exist');
    });

    it('clears the main input after submitting via the modal', () => {
        cy.get('[placeholder="What\'s happening?"]').type('Will be cleared');
        cy.contains('button', /Tell everyone/i).click();

        cy.get('.create-post-modal [placeholder="Write description here..."]').type('Description');
        cy.get('.create-post-modal').contains('button', 'Create').click();

        cy.wait('@createPost');
        cy.get('[placeholder="What\'s happening?"]').should('have.value', '');
    });
});
