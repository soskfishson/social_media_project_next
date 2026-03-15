import { useRouter } from 'next/navigation';
import SignUpPage from './page';
import { renderWithProviders, screen, fireEvent, waitFor } from '../../tests/test-utils';
import { ToastType } from '../../interfaces/interfaces';

const mockPush = jest.fn();

beforeEach(() => {
    mockPush.mockClear();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
});

const fillEmail = (value: string) => {
    const input = screen.getAllByTestId('input-control')[0];
    fireEvent.change(input, { target: { value } });
    fireEvent.blur(input);
    return input;
};

const fillPassword = (value: string) => {
    const input = screen.getAllByTestId('input-control')[1];
    fireEvent.change(input, { target: { value } });
    fireEvent.blur(input);
    return input;
};

describe('SignUpPage — email validation', () => {
    it('shows error for invalid email format', async () => {
        renderWithProviders(<SignUpPage />);
        fillEmail('not-valid');
        await waitFor(() => {
            expect(screen.getByText(/Email is not valid/i)).toBeInTheDocument();
        });
    });

    it('does not show email error when email is valid', async () => {
        renderWithProviders(<SignUpPage />);
        fillEmail('valid@email.com');
        await waitFor(() => {
            expect(screen.queryByText(/Email is not valid/i)).not.toBeInTheDocument();
        });
    });
});

describe('SignUpPage — password validation', () => {
    it('shows error when password is too short', async () => {
        renderWithProviders(<SignUpPage />);
        fillPassword('short');
        await waitFor(() => {
            expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
        });
    });

    it('shows success message when password is valid', async () => {
        renderWithProviders(<SignUpPage />);
        fillPassword('strongpassword123');
        await waitFor(() => {
            expect(screen.getByTestId('input-success')).toHaveTextContent(
                'Your password is strong',
            );
        });
    });
});

describe('SignUpPage — submit button state', () => {
    it('submit button is disabled when form is pristine', () => {
        renderWithProviders(<SignUpPage />);
        expect(screen.getByRole('button', { name: /Sign Up/i })).toBeDisabled();
    });

    it('submit button is disabled when form has validation errors', async () => {
        renderWithProviders(<SignUpPage />);
        fillEmail('bad-email');
        fillPassword('short');
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Sign Up/i })).toBeDisabled();
        });
    });

    it('submit button is enabled when form is valid', async () => {
        renderWithProviders(<SignUpPage />, {
            authValue: { register: jest.fn().mockResolvedValue(undefined) },
        });
        fillEmail('valid@email.com');
        fillPassword('validpassword');
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Sign Up/i })).not.toBeDisabled();
        });
    });
});

describe('SignUpPage — form submission', () => {
    it('calls register with email and password', async () => {
        const mockRegister = jest.fn().mockResolvedValue(undefined);
        renderWithProviders(<SignUpPage />, { authValue: { register: mockRegister } });

        fillEmail('newuser@mail.com');
        fillPassword('password12345');

        fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith(
                expect.objectContaining({ email: 'newuser@mail.com', password: 'password12345' }),
            );
        });
    });

    it('shows error toast when registration fails', async () => {
        const mockRegister = jest.fn().mockRejectedValue(new Error('Email already exists'));
        const mockAddToast = jest.fn();
        renderWithProviders(<SignUpPage />, {
            authValue: { register: mockRegister },
            toastValue: { addToast: mockAddToast },
        });

        fillEmail('taken@mail.com');
        fillPassword('password12345');
        fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

        await waitFor(() => {
            expect(mockAddToast).toHaveBeenCalledWith('Email already exists', ToastType.ERROR);
        });
    });

    it('shows Signing Up... while submitting', async () => {
        const mockRegister = jest.fn(
            () => new Promise<void>((resolve) => setTimeout(resolve, 200)),
        );
        renderWithProviders(<SignUpPage />, { authValue: { register: mockRegister } });

        fillEmail('user@mail.com');
        fillPassword('validpassword');
        fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Signing Up/i })).toBeDisabled();
        });
    });
});

describe('SignUpPage — layout', () => {
    it('renders Create an account title', () => {
        renderWithProviders(<SignUpPage />);
        expect(screen.getByText(/Create an account/i)).toBeInTheDocument();
    });

    it('renders link to sign in page', () => {
        renderWithProviders(<SignUpPage />);
        expect(screen.getByRole('link', { name: 'Sign In' })).toHaveAttribute('href', '/signin');
    });

    it('renders terms of service and privacy policy links', () => {
        renderWithProviders(<SignUpPage />);
        expect(screen.getByText(/Terms of Service/i)).toBeInTheDocument();
        expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
    });
});
