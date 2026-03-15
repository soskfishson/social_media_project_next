import { renderWithProviders, screen, fireEvent, waitFor } from '@/tests/test-utils';
import ProfileInfo from './ProfileInfo';
import { ThemeTypes } from '@/interfaces/interfaces';
import type { User } from '@/interfaces/interfaces';

const mockUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@test.com',
    profileImage: 'https://via.placeholder.com/150',
    description: 'My bio',
};

describe('ProfileInfo — rendering', () => {
    it('renders the Edit profile section title', () => {
        renderWithProviders(<ProfileInfo />, { authValue: { user: mockUser } });
        expect(screen.getByText('Edit profile')).toBeInTheDocument();
    });

    it('pre-fills username field with user data', () => {
        renderWithProviders(<ProfileInfo />, { authValue: { user: mockUser } });
        expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
    });

    it('pre-fills email field with user data', () => {
        renderWithProviders(<ProfileInfo />, { authValue: { user: mockUser } });
        expect(screen.getByDisplayValue('test@test.com')).toBeInTheDocument();
    });

    it('pre-fills description field with user data', () => {
        renderWithProviders(<ProfileInfo />, { authValue: { user: mockUser } });
        expect(screen.getByDisplayValue('My bio')).toBeInTheDocument();
    });

    it('renders user avatar', () => {
        renderWithProviders(<ProfileInfo />, { authValue: { user: mockUser } });
        expect(screen.getByAltText('avatar')).toHaveAttribute('src', mockUser.profileImage);
    });
});

describe('ProfileInfo — validation', () => {
    it('shows error for invalid email on form submit', async () => {
        renderWithProviders(<ProfileInfo />, { authValue: { user: mockUser, isLoggedIn: true } });

        const emailInput = screen.getAllByTestId('input-control')[1];
        fireEvent.change(emailInput, { target: { value: 'not-an-email' } });

        const form = emailInput.closest('form')!;
        fireEvent.submit(form);

        await waitFor(() => {
            expect(screen.getByTestId('input-error')).toHaveTextContent(/Invalid email format/i);
        });
    });

    it('shows error for username shorter than 3 characters', async () => {
        renderWithProviders(<ProfileInfo />, { authValue: { user: mockUser, isLoggedIn: true } });

        const usernameInput = screen.getAllByTestId('input-control')[0];
        fireEvent.change(usernameInput, { target: { value: 'ab' } });

        const form = usernameInput.closest('form')!;
        fireEvent.submit(form);

        await waitFor(() => {
            expect(screen.getByTestId('input-error')).toHaveTextContent(
                /Username must be at least 3 characters/i,
            );
        });
    });

    it('shows error toast on validation failure', async () => {
        const mockAddToast = jest.fn();
        renderWithProviders(<ProfileInfo />, {
            authValue: { user: mockUser, isLoggedIn: true },
            toastValue: { addToast: mockAddToast },
        });

        const emailInput = screen.getAllByTestId('input-control')[1];
        fireEvent.change(emailInput, { target: { value: 'bad' } });

        const form = emailInput.closest('form')!;
        fireEvent.submit(form);

        await waitFor(() => {
            expect(mockAddToast).toHaveBeenCalledWith(
                'Please correct the highlighted errors',
                expect.any(String),
            );
        });
    });
});

describe('ProfileInfo — preferences', () => {
    it('renders the dark theme toggle checkbox', () => {
        renderWithProviders(<ProfileInfo />, { authValue: { user: mockUser } });
        expect(screen.getByTestId('theme-checkbox')).toBeInTheDocument();
    });

    it('checkbox is checked in dark theme', () => {
        renderWithProviders(<ProfileInfo />, {
            authValue: { user: mockUser },
            themeValue: { theme: ThemeTypes.DARK },
        });
        expect(screen.getByTestId('theme-checkbox')).toBeChecked();
    });

    it('checkbox is unchecked in light theme', () => {
        renderWithProviders(<ProfileInfo />, {
            authValue: { user: mockUser },
            themeValue: { theme: ThemeTypes.LIGHT },
        });
        expect(screen.getByTestId('theme-checkbox')).not.toBeChecked();
    });

    it('calls toggleTheme when checkbox is clicked', () => {
        const mockToggleTheme = jest.fn();
        renderWithProviders(<ProfileInfo />, {
            authValue: { user: mockUser },
            themeValue: { theme: ThemeTypes.DARK, toggleTheme: mockToggleTheme },
        });
        fireEvent.click(screen.getByTestId('theme-checkbox'));
        expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });
});

describe('ProfileInfo — logout', () => {
    it('renders Logout button', () => {
        renderWithProviders(<ProfileInfo />, { authValue: { user: mockUser } });
        expect(screen.getByTestId('logout-button')).toBeInTheDocument();
    });

    it('calls logout function when Logout button is clicked', () => {
        const mockLogout = jest.fn();
        renderWithProviders(<ProfileInfo />, { authValue: { user: mockUser, logout: mockLogout } });
        fireEvent.click(screen.getByTestId('logout-button'));
        expect(mockLogout).toHaveBeenCalledTimes(1);
    });
});

describe('ProfileInfo — bio field', () => {
    it('falls back to bio property when description is absent', () => {
        const userWithBio = { ...mockUser, description: undefined, bio: 'My bio from bio field' };
        renderWithProviders(<ProfileInfo />, { authValue: { user: userWithBio } });
        expect(screen.getByDisplayValue('My bio from bio field')).toBeInTheDocument();
    });
});
