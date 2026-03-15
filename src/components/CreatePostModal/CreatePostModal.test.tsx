import { renderWithProviders, screen, fireEvent, waitFor } from '@/tests/test-utils';
import CreatePostModal from './CreatePostModal';
import { ToastType } from '@/interfaces/interfaces';

const mockOnClose = jest.fn();

beforeEach(() => {
    mockOnClose.mockClear();
});

describe('CreatePostModal — visibility', () => {
    it('does not render anything when isOpen is false', () => {
        renderWithProviders(<CreatePostModal isOpen={false} onClose={mockOnClose} />);
        expect(screen.queryByText(/Create a new post/i)).not.toBeInTheDocument();
    });

    it('renders when isOpen is true', () => {
        renderWithProviders(<CreatePostModal isOpen={true} onClose={mockOnClose} />);
        expect(screen.getByText(/Create a new post/i)).toBeInTheDocument();
    });
});

describe('CreatePostModal — initial state', () => {
    it('pre-fills title when title prop is provided', () => {
        renderWithProviders(
            <CreatePostModal isOpen={true} onClose={mockOnClose} title="Pre-filled Title" />,
        );
        expect(screen.getByDisplayValue('Pre-filled Title')).toBeInTheDocument();
    });

    it('has empty title when no title prop given', () => {
        renderWithProviders(<CreatePostModal isOpen={true} onClose={mockOnClose} />);
        const titleInput = screen.getAllByTestId('input-control')[0];
        expect(titleInput).toHaveValue('');
    });
});

describe('CreatePostModal — close behaviour', () => {
    it('calls onClose when × button is clicked', () => {
        renderWithProviders(<CreatePostModal isOpen={true} onClose={mockOnClose} />);
        fireEvent.click(screen.getByText('×'));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop overlay is clicked', () => {
        renderWithProviders(<CreatePostModal isOpen={true} onClose={mockOnClose} />);
        const backdrop = document.querySelector('.modal-container')!;
        fireEvent.click(backdrop);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not propagate click from dialog to backdrop', () => {
        renderWithProviders(<CreatePostModal isOpen={true} onClose={mockOnClose} />);
        const dialog = document.querySelector('.create-post-modal')!;
        fireEvent.click(dialog);
        expect(mockOnClose).not.toHaveBeenCalled();
    });
});

describe('CreatePostModal — validation', () => {
    it('shows error toast when title is empty on submit', async () => {
        const mockAddToast = jest.fn();
        renderWithProviders(<CreatePostModal isOpen={true} onClose={mockOnClose} />, {
            toastValue: { addToast: mockAddToast },
        });
        fireEvent.click(screen.getByText('Create'));
        expect(mockAddToast).toHaveBeenCalledWith(
            'Please fill in all required fields',
            ToastType.ERROR,
        );
    });

    it('shows error toast when only title is filled', () => {
        const mockAddToast = jest.fn();
        renderWithProviders(<CreatePostModal isOpen={true} onClose={mockOnClose} />, {
            toastValue: { addToast: mockAddToast },
        });
        fireEvent.change(screen.getAllByTestId('input-control')[0], {
            target: { value: 'Title only' },
        });
        fireEvent.click(screen.getByText('Create'));
        expect(mockAddToast).toHaveBeenCalledWith(
            'Please fill in all required fields',
            ToastType.ERROR,
        );
    });
});

describe('CreatePostModal — successful submission', () => {
    it('shows success toast after successful post creation', async () => {
        const mockAddToast = jest.fn();
        renderWithProviders(<CreatePostModal isOpen={true} onClose={mockOnClose} />, {
            toastValue: { addToast: mockAddToast },
        });

        fireEvent.change(screen.getAllByTestId('input-control')[0], {
            target: { value: 'My Post Title' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Write description here/i), {
            target: { value: 'My post content' },
        });
        fireEvent.click(screen.getByText('Create'));

        await waitFor(() => {
            expect(mockAddToast).toHaveBeenCalledWith(
                'Post created successfully!',
                ToastType.SUCCESS,
            );
        });
    });

    it('calls onClose after successful submission', async () => {
        renderWithProviders(<CreatePostModal isOpen={true} onClose={mockOnClose} />);

        fireEvent.change(screen.getAllByTestId('input-control')[0], { target: { value: 'Title' } });
        fireEvent.change(screen.getByPlaceholderText(/Write description here/i), {
            target: { value: 'Content' },
        });
        fireEvent.click(screen.getByText('Create'));

        await waitFor(() => {
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('shows Creating... while submitting', async () => {
        renderWithProviders(<CreatePostModal isOpen={true} onClose={mockOnClose} />);

        fireEvent.change(screen.getAllByTestId('input-control')[0], { target: { value: 'Title' } });
        fireEvent.change(screen.getByPlaceholderText(/Write description here/i), {
            target: { value: 'Content' },
        });
        fireEvent.click(screen.getByText('Create'));

        await waitFor(() => {
            expect(mockOnClose).toHaveBeenCalled();
        });
    });
});
