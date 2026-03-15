import { renderWithProviders, screen, fireEvent } from '@/tests/test-utils';
import BurgerMenu from './BurgerMenu';
import type { User } from '@/interfaces/interfaces';

const mockAuthUser: User = {
    id: 1,
    username: 'testuser',
    profileImage: 'https://via.placeholder.com/40',
} as unknown as User;

describe('BurgerMenu — toggle behaviour', () => {
    it('menu is closed by default', () => {
        renderWithProviders(<BurgerMenu />);
        expect(screen.getByTestId('burger-nav')).not.toHaveClass('open');
    });

    it('opens menu when burger button is clicked', () => {
        renderWithProviders(<BurgerMenu />);
        fireEvent.click(screen.getByTestId('burger-button'));
        expect(screen.getByTestId('burger-nav')).toHaveClass('open');
    });

    it('closes menu on second click of burger button', () => {
        renderWithProviders(<BurgerMenu />);
        const btn = screen.getByTestId('burger-button');
        fireEvent.click(btn);
        fireEvent.click(btn);
        expect(screen.getByTestId('burger-nav')).not.toHaveClass('open');
    });

    it('burger button gets open class when menu is open', () => {
        renderWithProviders(<BurgerMenu />);
        const btn = screen.getByTestId('burger-button');
        fireEvent.click(btn);
        expect(btn).toHaveClass('open');
    });
});

describe('BurgerMenu — overlay', () => {
    it('renders overlay when menu is open', () => {
        renderWithProviders(<BurgerMenu />);
        fireEvent.click(screen.getByTestId('burger-button'));
        expect(document.querySelector('.burger-overlay')).toBeInTheDocument();
    });

    it('does not render overlay when menu is closed', () => {
        renderWithProviders(<BurgerMenu />);
        expect(document.querySelector('.burger-overlay')).not.toBeInTheDocument();
    });

    it('closes menu when overlay is clicked', () => {
        renderWithProviders(<BurgerMenu />);
        fireEvent.click(screen.getByTestId('burger-button'));
        const overlay = document.querySelector('.burger-overlay')!;
        fireEvent.click(overlay);
        expect(screen.getByTestId('burger-nav')).not.toHaveClass('open');
    });
});

describe('BurgerMenu — unauthenticated links', () => {
    it('shows Sign in and Sign up links when not logged in', () => {
        renderWithProviders(<BurgerMenu />, { authValue: { isLoggedIn: false, user: null } });
        expect(screen.getByTestId('burger-signin-link')).toBeInTheDocument();
        expect(screen.getByTestId('burger-signup-link')).toBeInTheDocument();
    });

    it('does not show Profile info when not logged in', () => {
        renderWithProviders(<BurgerMenu />, { authValue: { isLoggedIn: false, user: null } });
        expect(screen.queryByText(/Profile info/i)).not.toBeInTheDocument();
    });
});

describe('BurgerMenu — authenticated links', () => {
    it('shows Profile info and Statistics links when logged in', () => {
        renderWithProviders(<BurgerMenu />, {
            authValue: { isLoggedIn: true, user: mockAuthUser },
        });
        expect(screen.getByText(/Profile info/i)).toBeInTheDocument();
        expect(screen.getByText(/Statistics/i)).toBeInTheDocument();
    });

    it('hides Sign in link when logged in', () => {
        renderWithProviders(<BurgerMenu />, {
            authValue: { isLoggedIn: true, user: mockAuthUser },
        });
        expect(screen.queryByTestId('burger-signin-link')).not.toBeInTheDocument();
    });

    it('renders user avatar when logged in', () => {
        renderWithProviders(<BurgerMenu />, {
            authValue: { isLoggedIn: true, user: mockAuthUser },
        });
        expect(screen.getByAltText(/testuser's profile picture/i)).toBeInTheDocument();
    });
});
