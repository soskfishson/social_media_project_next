import { renderWithProviders, screen, waitFor } from '@/tests/test-utils';
import PostFeed from './PostFeed';
import { fetchPostsGraphQL as mockFetch } from '@/api/graphql';

const mockPosts = [
    {
        id: 1,
        title: 'First Post',
        content: 'Content 1',
        authorId: 1,
        likedByUsers: [],
        creationDate: new Date().toISOString(),
        modifiedDate: new Date().toISOString(),
        likesCount: 0,
        commentsCount: 0,
        authorPhoto: '',
    },
    {
        id: 2,
        title: 'Second Post',
        content: 'Content 2',
        authorId: 2,
        likedByUsers: [],
        creationDate: new Date().toISOString(),
        modifiedDate: new Date().toISOString(),
        likesCount: 0,
        commentsCount: 0,
        authorPhoto: '',
    },
];

describe('PostFeed — loading state', () => {
    it('shows skeleton loaders while data is pending', () => {
        (mockFetch as jest.Mock).mockReturnValue(new Promise(() => {}));
        renderWithProviders(<PostFeed />);
        expect(screen.getByTestId('main-loader')).toBeInTheDocument();
    });

    it('hides skeleton loaders after data resolves', async () => {
        (mockFetch as jest.Mock).mockResolvedValue(mockPosts);
        renderWithProviders(<PostFeed />);
        await waitFor(() => {
            expect(screen.queryByTestId('main-loader')).not.toBeInTheDocument();
        });
    });
});

describe('PostFeed — data states', () => {
    it('shows empty state message when no posts exist', async () => {
        (mockFetch as jest.Mock).mockResolvedValue([]);
        renderWithProviders(<PostFeed />);
        await waitFor(() => {
            expect(screen.getByText(/No posts to show yet/i)).toBeInTheDocument();
        });
    });

    it('renders posts when data is available', async () => {
        (mockFetch as jest.Mock).mockResolvedValue(mockPosts);
        renderWithProviders(<PostFeed />);
        await waitFor(() => {
            expect(screen.getByText(/First Post/)).toBeInTheDocument();
            expect(screen.getByText(/Second Post/)).toBeInTheDocument();
        });
    });

    it('renders error message when API fails', async () => {
        (mockFetch as jest.Mock).mockRejectedValue(new Error('Network Error'));
        renderWithProviders(<PostFeed />);
        await waitFor(() => {
            expect(screen.getByText(/Network Error/i)).toBeInTheDocument();
        });
    });

    it('does not show empty state when there is an error', async () => {
        (mockFetch as jest.Mock).mockRejectedValue(new Error('Fail'));
        renderWithProviders(<PostFeed />);
        await waitFor(() => {
            expect(screen.queryByText(/No posts to show yet/i)).not.toBeInTheDocument();
        });
    });
});
