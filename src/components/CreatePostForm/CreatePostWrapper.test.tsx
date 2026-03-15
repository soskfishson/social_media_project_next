import { renderWithProviders, screen } from '../../tests/test-utils';
import CreatePostWrapper from './CreatePostWrapper';
import type { User } from '../../interfaces/interfaces';

const mockUser: User = { id: 1, username: 'testuser', profileImage: 'avatar.jpg' } as User;

describe('CreatePostWrapper — auth guard', () => {
    it('renders CreatePostForm when logged in', () => {
        renderWithProviders(<CreatePostWrapper />, {
            authValue: { isLoggedIn: true, user: mockUser },
        });
        expect(screen.getByPlaceholderText(/What's happening/i)).toBeInTheDocument();
    });

    it('renders nothing when logged out', () => {
        const { container } = renderWithProviders(<CreatePostWrapper />, {
            authValue: { isLoggedIn: false, user: null },
        });
        expect(container.firstChild).toBeNull();
    });

    it('renders nothing when user is null even if isLoggedIn is true', () => {
        const { container } = renderWithProviders(<CreatePostWrapper />, {
            authValue: { isLoggedIn: true, user: null },
        });
        expect(container.firstChild).toBeNull();
    });
});
