import { screen, fireEvent, act, waitFor } from '@testing-library/react';
import { render } from '@testing-library/react';
import { useEffect } from 'react';
import { ToastType } from '@/interfaces/interfaces';
import useToast from '../../hooks/useToast';
import ToastProvider from '../../context/ToastContext/ToastProvider';

const renderWithToastProvider = (ui: React.ReactElement) => {
    render(<ToastProvider>{ui}</ToastProvider>);
};
const ToastTrigger = ({ message, type }: { message: string; type: ToastType }) => {
    const { addToast } = useToast();
    useEffect(() => {
        addToast(message, type);
    }, [addToast, message, type]);
    return <div>Trigger</div>;
};

const MultiTrigger = () => {
    const { addToast } = useToast();
    return (
        <div>
            <button onClick={() => addToast('Success!', ToastType.SUCCESS)}>Add Success</button>
            <button onClick={() => addToast('Error!', ToastType.ERROR)}>Add Error</button>
            <button onClick={() => addToast('Warning!', ToastType.WARNING)}>Add Warning</button>
        </div>
    );
};

describe('Toast — display', () => {
    it('renders toast with correct message', async () => {
        renderWithToastProvider(<ToastTrigger message="Test Message" type={ToastType.SUCCESS} />);
        expect(await screen.findByTestId('toast-item')).toHaveTextContent('Test Message');
    });

    it('applies toast-success class for SUCCESS type', async () => {
        renderWithToastProvider(<ToastTrigger message="Success" type={ToastType.SUCCESS} />);
        expect(await screen.findByTestId('toast-item')).toHaveClass('toast-success');
    });

    it('applies toast-error class for ERROR type', async () => {
        renderWithToastProvider(<ToastTrigger message="Error" type={ToastType.ERROR} />);
        expect(await screen.findByTestId('toast-item')).toHaveClass('toast-error');
    });

    it('applies toast-warning class for WARNING type', async () => {
        renderWithToastProvider(<ToastTrigger message="Warning" type={ToastType.WARNING} />);
        expect(await screen.findByTestId('toast-item')).toHaveClass('toast-warning');
    });
});

describe('Toast — closing', () => {
    it('removes toast when × button is clicked', async () => {
        renderWithToastProvider(<ToastTrigger message="Dismiss me" type={ToastType.SUCCESS} />);
        const toast = await screen.findByTestId('toast-item');
        fireEvent.click(toast.querySelector('button')!);
        expect(screen.queryByTestId('toast-item')).not.toBeInTheDocument();
    });

    it('auto-removes toast after 5 seconds', async () => {
        jest.useFakeTimers();
        renderWithToastProvider(<ToastTrigger message="Auto dismiss" type={ToastType.SUCCESS} />);

        await waitFor(() => expect(screen.getByTestId('toast-item')).toBeInTheDocument());

        act(() => {
            jest.advanceTimersByTime(5001);
        });

        expect(screen.queryByTestId('toast-item')).not.toBeInTheDocument();
        jest.useRealTimers();
    });
});

describe('Toast — multiple toasts', () => {
    it('renders multiple toasts simultaneously', async () => {
        renderWithToastProvider(<MultiTrigger />);
        fireEvent.click(screen.getByText('Add Success'));
        fireEvent.click(screen.getByText('Add Error'));
        const toasts = await screen.findAllByTestId('toast-item');
        expect(toasts).toHaveLength(2);
    });

    it('removes only the clicked toast when multiple exist', async () => {
        renderWithToastProvider(<MultiTrigger />);
        fireEvent.click(screen.getByText('Add Success'));
        fireEvent.click(screen.getByText('Add Warning'));
        const toasts = await screen.findAllByTestId('toast-item');
        fireEvent.click(toasts[0].querySelector('button')!);
        expect(screen.getAllByTestId('toast-item')).toHaveLength(1);
    });
});
