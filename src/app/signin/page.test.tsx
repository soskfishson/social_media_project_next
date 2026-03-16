import { renderWithProviders, screen, fireEvent, waitFor } from '@/tests/test-utils';
import { useRouter } from 'next/navigation';
import SignInPage from './page';
import { ToastType } from '@/interfaces/interfaces';

const mockPush = jest.fn();

beforeEach(() => {
    mockPush.mockClear();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush, replace: jest.fn() });
});
const fillAndBlurEmail = (value: string) => {
    const email = screen.getAllByTestId('input-control')[0];
    fireEvent.change(email, { target: { value } });
    fireEvent.blur(email);
    return email;
};

const fillPassword = (value: string) => {
    const password = screen.getAllByTestId('input-control')[1];
    fireEvent.change(password, { target: { value } });
    return password;
};

describe('SignInPage — validation', () => {
    it('shows error for invalid email format', async () => {
        renderWithProviders(<SignInPage />);
        fillAndBlurEmail('not-an-email');
        await waitFor(() => {
            expect(screen.getByTestId('input-error')).toHaveTextContent('Email is not valid');
        });
    });

    it('does not show error while email field is pristine', () => {
        renderWithProviders(<SignInPage />);
        expect(screen.queryByTestId('input-error')).not.toBeInTheDocument();
    });

    it('shows valid state for correctly formatted email', async () => {
        renderWithProviders(<SignInPage />);
        fillAndBlurEmail('user@example.com');
        await waitFor(() => {
            expect(screen.queryByTestId('input-error')).not.toBeInTheDocument();
        });
    });
});

describe('SignInPage — submission', () => {
    it('disables submit button and shows Signing In... while submitting', async () => {
        const mockLogin = jest.fn(() => new Promise<void>((resolve) => setTimeout(resolve, 200)));
        renderWithProviders(<SignInPage />, {
            authValue: { login: mockLogin, isLoggedIn: false },
        });

        fillAndBlurEmail('test@test.com');
        fillPassword('password123');
        fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

        await waitFor(() => {
            const btn = screen.getByRole('button', { name: /Signing In/i });
            expect(btn).toBeDisabled();
        });
    });

    it('calls login with correct email and password', async () => {
        const mockLogin = jest.fn().mockResolvedValue(undefined);
        renderWithProviders(<SignInPage />, {
            authValue: { login: mockLogin, isLoggedIn: false },
        });

        fillAndBlurEmail('user@test.com');
        fillPassword('mypassword');
        fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({
                email: 'user@test.com',
                password: 'mypassword',
            });
        });
    });

    it('shows error toast when login fails', async () => {
        const mockLogin = jest.fn().mockRejectedValue(new Error('Wrong password'));
        const mockAddToast = jest.fn();
        renderWithProviders(<SignInPage />, {
            authValue: { login: mockLogin, isLoggedIn: false },
            toastValue: { addToast: mockAddToast },
        });

        fillAndBlurEmail('user@test.com');
        fillPassword('badpass');
        fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

        await waitFor(() => {
            expect(mockAddToast).toHaveBeenCalledWith(
                expect.stringContaining('Failed to sign in'),
                ToastType.ERROR,
            );
        });
    });

    it('shows toast with validation error when form is submitted invalid', async () => {
        const mockAddToast = jest.fn();
        renderWithProviders(<SignInPage />, {
            toastValue: { addToast: mockAddToast },
        });

        fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

        await waitFor(() => {
            expect(mockAddToast).toHaveBeenCalledWith(
                'Please check your input fields',
                ToastType.ERROR,
            );
        });
    });
    it('redirects to home after successful sign-in', async () => {
        const mockLogin = jest.fn().mockResolvedValue(undefined);
        renderWithProviders(<SignInPage />, {
            authValue: { login: mockLogin, isLoggedIn: false },
        });
        fireEvent.change(screen.getAllByTestId('input-control')[0], {
            target: { value: 'user@test.com' },
        });
        fireEvent.blur(screen.getAllByTestId('input-control')[0]);
        fireEvent.change(screen.getAllByTestId('input-control')[1], {
            target: { value: 'password123' },
        });
        fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/');
        });
    });
});

describe('SignInPage — layout', () => {
    it('renders the Sign in title', () => {
        renderWithProviders(<SignInPage />);
        expect(screen.getByText(/Sign in into an account/i)).toBeInTheDocument();
    });

    it('renders link to sign up page', () => {
        renderWithProviders(<SignInPage />);
        expect(screen.getByText(/Sign up/i)).toBeInTheDocument();
    });

    it('renders email and password inputs', () => {
        renderWithProviders(<SignInPage />);
        const inputs = screen.getAllByTestId('input-control');
        expect(inputs).toHaveLength(2);
    });
});
