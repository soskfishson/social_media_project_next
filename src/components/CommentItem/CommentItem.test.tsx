import { renderWithProviders, screen, waitFor } from '../../tests/test-utils';
import CommentItem from './CommentItem';

const mockComment = {
    id: 1,
    text: 'Great post!',
    authorId: 55,
    postId: 10,
    creationDate: '',
    modifiedDate: '',
};

const getSkeletons = () => document.querySelectorAll('.MuiSkeleton-root');

describe('CommentItem — loading state', () => {
    it('shows skeletons while fetching author data', () => {
        (global.fetch as jest.Mock).mockReturnValue(new Promise(() => {}));
        renderWithProviders(<CommentItem comment={mockComment} />);
        expect(getSkeletons().length).toBeGreaterThan(0);
    });

    it('hides skeletons after data loads', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ id: 55, username: 'jane_doe' }),
        });
        renderWithProviders(<CommentItem comment={mockComment} />);
        await waitFor(() => {
            expect(getSkeletons().length).toBe(0);
        });
    });
});

describe('CommentItem — data display', () => {
    it('renders the author username after loading', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ id: 55, username: 'jane_doe' }),
        });
        renderWithProviders(<CommentItem comment={mockComment} />);
        expect(await screen.findByText(/jane_doe/i)).toBeInTheDocument();
    });

    it('renders the comment text after loading', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ id: 55, username: 'jane_doe' }),
        });
        renderWithProviders(<CommentItem comment={mockComment} />);
        expect(await screen.findByTestId('comment-text')).toHaveTextContent('Great post!');
    });

    it('shows fallback "User {id}" when username field is absent', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ id: 55 }),
        });
        renderWithProviders(<CommentItem comment={mockComment} />);
        expect(await screen.findByText(/User 55/i)).toBeInTheDocument();
    });

    it('renders different comment text correctly', async () => {
        const otherComment = { ...mockComment, text: 'I totally agree!', authorId: 99 };
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ id: 99, username: 'bob' }),
        });
        renderWithProviders(<CommentItem comment={otherComment} />);
        expect(await screen.findByTestId('comment-text')).toHaveTextContent('I totally agree!');
    });
});
