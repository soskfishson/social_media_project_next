import { renderWithProviders, screen } from '@/tests/test-utils';
import { useRouter } from 'next/navigation';
import ProtectedRoute from './ProtectedRoute';
import type { User } from '@/interfaces/interfaces';

const mockReplace = jest.fn();

beforeEach(() => {
    mockReplace.mockClear();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
});

const PrivateContent = () => <div>Private Content</div>;

describe('ProtectedRoute — unauthenticated', () => {
    it('redirects to /signin when user is null and not loading', () => {
        renderWithProviders(
            <ProtectedRoute>
                <PrivateContent />
            </ProtectedRoute>,
            { authValue: { user: null, isLoading: false } },
        );
        expect(mockReplace).toHaveBeenCalledWith('/signin');
    });

    it('renders nothing when unauthenticated', () => {
        renderWithProviders(
            <ProtectedRoute>
                <PrivateContent />
            </ProtectedRoute>,
            { authValue: { user: null, isLoading: false } },
        );
        expect(screen.queryByText('Private Content')).not.toBeInTheDocument();
    });

    it('does not redirect while still loading', () => {
        renderWithProviders(
            <ProtectedRoute>
                <PrivateContent />
            </ProtectedRoute>,
            { authValue: { user: null, isLoading: true } },
        );
        expect(mockReplace).not.toHaveBeenCalled();
    });
});

describe('ProtectedRoute — authenticated', () => {
    it('renders children when user is present', () => {
        renderWithProviders(
            <ProtectedRoute>
                <PrivateContent />
            </ProtectedRoute>,
            { authValue: { user: { id: 1 } as User, isLoading: false } },
        );
        expect(screen.getByText('Private Content')).toBeInTheDocument();
    });

    it('does not redirect when user is authenticated', () => {
        renderWithProviders(
            <ProtectedRoute>
                <PrivateContent />
            </ProtectedRoute>,
            { authValue: { user: { id: 1 } as User, isLoading: false } },
        );
        expect(mockReplace).not.toHaveBeenCalled();
    });
});
