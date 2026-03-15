import { renderWithProviders, screen, fireEvent, waitFor } from '@/tests/test-utils';
import Post from './Post';
import { apiClient } from '@/api/api';
import { ToastType, type Post as PostType, type User } from '@/interfaces/interfaces';

beforeEach(() => {
    jest.clearAllMocks();
});

const basePost: PostType = {
    id: 1,
    title: 'Test Title',
    content: 'Test Content',
    authorId: 42,
    likesCount: 0,
    likedByUsers: [],
    commentsCount: 0,
    creationDate: new Date().toISOString(),
    modifiedDate: new Date().toISOString(),
    authorPhoto: '',
};

const mockMe: User = { id: 99, username: 'me' };

describe('Post — rendering', () => {
    it('renders the post title', () => {
        renderWithProviders(<Post post={basePost} />);
        expect(screen.getByText(/Test Title/)).toBeInTheDocument();
    });

    it('renders image when image prop is provided', () => {
        renderWithProviders(<Post post={{ ...basePost, image: 'img.jpg' }} />);
        expect(screen.getByRole('img', { name: /post/i })).toBeInTheDocument();
    });

    it('does not render image when image prop is absent', () => {
        renderWithProviders(<Post post={{ ...basePost, image: undefined }} />);
        expect(screen.queryByRole('img', { name: /post/i })).not.toBeInTheDocument();
    });

    it('shows like count from post likesCount field', () => {
        const post: PostType = {
            ...basePost,
            likesCount: 2,
            likedByUsers: [
                { id: 1, username: 'user1' },
                { id: 2, username: 'user2' },
            ] as User[],
        };
        renderWithProviders(<Post post={post} />);
        expect(screen.getByTestId('like-button')).toHaveTextContent('2 likes');
    });

    it('shows "Login to view" in comment button when not logged in', () => {
        renderWithProviders(<Post post={basePost} />, {
            authValue: { isLoggedIn: false, user: null },
        });
        expect(screen.getByTestId('comment-toggle')).toHaveTextContent('Login to view');
    });
});

describe('Post — likes', () => {
    it('calls /api/like when post is not liked and like button clicked', async () => {
        renderWithProviders(<Post post={basePost} />, {
            authValue: { isLoggedIn: true, user: mockMe },
        });
        fireEvent.click(screen.getByTestId('like-button'));
        await waitFor(() => {
            expect(apiClient.post).toHaveBeenCalledWith('/api/like', { postId: 1 });
        });
    });

    it('calls /api/dislike when post is already liked by current user', async () => {
        const likedPost = { ...basePost, likedByUsers: [mockMe] };
        renderWithProviders(<Post post={likedPost} />, {
            authValue: { isLoggedIn: true, user: mockMe },
        });
        fireEvent.click(screen.getByTestId('like-button'));
        await waitFor(() => {
            expect(apiClient.post).toHaveBeenCalledWith('/api/dislike', { postId: 1 });
        });
    });

    it('shows error toast when not logged in and trying to like', () => {
        const mockAddToast = jest.fn();
        renderWithProviders(<Post post={basePost} />, {
            authValue: { isLoggedIn: false, user: null },
            toastValue: { addToast: mockAddToast },
        });
        fireEvent.click(screen.getByTestId('like-button'));
        expect(mockAddToast).toHaveBeenCalledWith('Login to like posts', ToastType.ERROR);
    });

    it('does not call API when not logged in and like button clicked', () => {
        renderWithProviders(<Post post={basePost} />, {
            authValue: { isLoggedIn: false, user: null },
        });
        fireEvent.click(screen.getByTestId('like-button'));
        expect(apiClient.post).not.toHaveBeenCalled();
    });
});

describe('Post — comments', () => {
    it('comment toggle button is disabled when not logged in', () => {
        renderWithProviders(<Post post={basePost} />, {
            authValue: { isLoggedIn: false, user: null },
        });
        expect(screen.getByTestId('comment-toggle')).toBeDisabled();
    });

    it('clicking comment toggle shows comment input when logged in', async () => {
        renderWithProviders(<Post post={basePost} />, {
            authValue: { isLoggedIn: true, user: mockMe },
        });
        fireEvent.click(screen.getByTestId('comment-toggle'));
        await waitFor(() => {
            expect(screen.getByTestId('comment-input')).toBeInTheDocument();
        });
    });

    it('submit button is disabled when comment text is empty', async () => {
        renderWithProviders(<Post post={basePost} />, {
            authValue: { isLoggedIn: true, user: mockMe },
        });
        fireEvent.click(screen.getByTestId('comment-toggle'));
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
        expect(screen.getByTestId('comment-submit')).toBeDisabled();
    });

    it('submit button is enabled when comment has text', async () => {
        renderWithProviders(<Post post={basePost} />, {
            authValue: { isLoggedIn: true, user: mockMe },
        });
        fireEvent.click(screen.getByTestId('comment-toggle'));
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

        const textarea = screen.getByTestId('comment-input').querySelector('textarea')!;
        fireEvent.change(textarea, { target: { value: 'A comment' } });

        expect(screen.getByTestId('comment-submit')).not.toBeDisabled();
    });

    it('calls /api/comments on comment submit', async () => {
        renderWithProviders(<Post post={basePost} />, {
            authValue: { isLoggedIn: true, user: mockMe },
        });
        fireEvent.click(screen.getByTestId('comment-toggle'));
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

        const textarea = screen.getByTestId('comment-input').querySelector('textarea')!;
        fireEvent.change(textarea, { target: { value: 'Great post!' } });
        fireEvent.click(screen.getByTestId('comment-submit'));

        await waitFor(() => {
            expect(apiClient.post).toHaveBeenCalledWith(
                '/api/comments',
                expect.objectContaining({ postId: 1, text: 'Great post!' }),
            );
        });
    });

    it('clicking comment toggle a second time collapses the section (MUI Collapse)', async () => {
        renderWithProviders(<Post post={basePost} />, {
            authValue: { isLoggedIn: true, user: mockMe },
        });
        const toggleBtn = screen.getByTestId('comment-toggle');

        fireEvent.click(toggleBtn);
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

        fireEvent.click(toggleBtn);

        await waitFor(() => {
            const collapseRoot = document.querySelector('.MuiCollapse-root') as HTMLElement;
            expect(collapseRoot?.style.height).toBe('0px');
        });
    });
});
