import { renderWithProviders, screen } from '../../tests/test-utils';
import Header from './Header';
import type { User } from '../../interfaces/interfaces';

const mockUser: User = {
    id: 1,
    username: 'johndoe',
    firstName: 'John',
    secondName: 'Doe',
    profileImage: 'avatar.png',
} as unknown as User;

describe('Header — simple variant', () => {
    it('does not render Sign In link in simple variant', () => {
        renderWithProviders(<Header variant="simple" />);
        expect(screen.queryByTestId('signin-link')).not.toBeInTheDocument();
    });

    it('does not render Sign Up link in simple variant', () => {
        renderWithProviders(<Header variant="simple" />);
        expect(screen.queryByTestId('signup-link')).not.toBeInTheDocument();
    });

    it('renders the logo container in simple variant', () => {
        renderWithProviders(<Header variant="simple" />);
        expect(document.querySelector('.header-logo-container')).toBeInTheDocument();
    });

    it('applies header-simple class for simple variant', () => {
        renderWithProviders(<Header variant="simple" />);
        expect(document.querySelector('.header-simple')).toBeInTheDocument();
    });
});

describe('Header — unauthenticated default variant', () => {
    it('renders Sign In and Sign Up links when logged out', () => {
        renderWithProviders(<Header />, { authValue: { isLoggedIn: false, user: null } });
        expect(screen.getByTestId('signin-link')).toBeInTheDocument();
        expect(screen.getByTestId('signup-link')).toBeInTheDocument();
    });

    it('Sign In link points to /signin', () => {
        renderWithProviders(<Header />, { authValue: { isLoggedIn: false, user: null } });
        expect(screen.getByTestId('signin-link')).toHaveAttribute('href', '/signin');
    });

    it('Sign Up link points to /signup', () => {
        renderWithProviders(<Header />, { authValue: { isLoggedIn: false, user: null } });
        expect(screen.getByTestId('signup-link')).toHaveAttribute('href', '/signup');
    });
});

describe('Header — authenticated default variant', () => {
    it('renders user full name when logged in', () => {
        renderWithProviders(<Header />, { authValue: { isLoggedIn: true, user: mockUser } });
        expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('renders user avatar with correct src (via next/image mock)', () => {
        renderWithProviders(<Header />, { authValue: { isLoggedIn: true, user: mockUser } });
        const avatars = screen.getAllByAltText(/johndoe's profile/i);
        const headerAvatar = avatars.find((el) => el.classList.contains('header-avatar'));
        expect(headerAvatar).toHaveAttribute('src', 'avatar.png');
    });

    it('profile link points to /profile', () => {
        renderWithProviders(<Header />, { authValue: { isLoggedIn: true, user: mockUser } });
        expect(document.querySelector('.header-right-side-logged')).toHaveAttribute(
            'href',
            '/profile',
        );
    });

    it('does not show sign-in or sign-up links when logged in', () => {
        renderWithProviders(<Header />, { authValue: { isLoggedIn: true, user: mockUser } });
        expect(screen.queryByTestId('signin-link')).not.toBeInTheDocument();
        expect(screen.queryByTestId('signup-link')).not.toBeInTheDocument();
    });
});

describe('Header — theming', () => {
    it('applies header-default class by default', () => {
        renderWithProviders(<Header />);
        expect(document.querySelector('.header-default')).toBeInTheDocument();
    });

    it('logo container links to /', () => {
        renderWithProviders(<Header />);
        expect(document.querySelector('.header-logo-container')).toHaveAttribute('href', '/');
    });
});
