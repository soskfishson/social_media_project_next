import { renderWithProviders, screen, fireEvent } from '@/tests/test-utils';
import CreatePostForm from './CreatePostForm';
import type { User } from '@/interfaces/interfaces';

const mockUser: User = {
    id: 1,
    username: 'testuser',
    profileImage: 'avatar.jpg',
} as unknown as User;

const renderForm = (userOverride?: Partial<User>) =>
    renderWithProviders(<CreatePostForm />, {
        authValue: {
            user: { ...mockUser, ...userOverride },
            isLoggedIn: true,
        },
    });

describe('CreatePostForm — rendering', () => {
    it('renders the text input', () => {
        renderForm();
        expect(screen.getByPlaceholderText(/What's happening/i)).toBeInTheDocument();
    });

    it('renders user avatar', () => {
        renderForm();
        expect(screen.getByAltText('User Avatar')).toHaveAttribute('src', '/avatar.jpg');
    });

    it('renders the submit button', () => {
        renderForm();
        expect(screen.getByText(/Tell everyone/i)).toBeInTheDocument();
    });
});

describe('CreatePostForm — modal opening', () => {
    it('opens CreatePostModal when form is submitted', () => {
        renderForm();
        fireEvent.change(screen.getByPlaceholderText(/What's happening/i), {
            target: { value: 'My first post' },
        });
        fireEvent.click(screen.getByText(/Tell everyone/i));
        expect(screen.getByText(/Create a new post/i)).toBeInTheDocument();
    });

    it('passes input text as modal title', () => {
        renderForm();
        fireEvent.change(screen.getByPlaceholderText(/What's happening/i), {
            target: { value: 'This is my title' },
        });
        fireEvent.click(screen.getByText(/Tell everyone/i));
        expect(screen.getByDisplayValue('This is my title')).toBeInTheDocument();
    });

    it('does not show modal before form submission', () => {
        renderForm();
        expect(screen.queryByText(/Create a new post/i)).not.toBeInTheDocument();
    });
});

describe('CreatePostForm — modal closing', () => {
    it('closes modal when × button is clicked', () => {
        renderForm();
        fireEvent.change(screen.getByPlaceholderText(/What's happening/i), {
            target: { value: 'Post title' },
        });
        fireEvent.click(screen.getByText(/Tell everyone/i));
        expect(screen.getByText(/Create a new post/i)).toBeInTheDocument();
        fireEvent.click(screen.getByText('×'));
        expect(screen.queryByText(/Create a new post/i)).not.toBeInTheDocument();
    });
});

describe('CreatePostForm — input state', () => {
    it('input reflects typed text', () => {
        renderForm();
        const input = screen.getByPlaceholderText(/What's happening/i);
        fireEvent.change(input, { target: { value: 'Hello world' } });
        expect(input).toHaveValue('Hello world');
    });

    it('clears input after form submission', () => {
        renderForm();
        const input = screen.getByPlaceholderText(/What's happening/i);
        fireEvent.change(input, { target: { value: 'Some text' } });
        fireEvent.click(screen.getByText(/Tell everyone/i));
        expect(input).toHaveValue('');
    });
});
