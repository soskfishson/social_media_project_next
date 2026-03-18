import { render, screen, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import Input from './Input';
import { InputType, ValidationState } from '@/interfaces/interfaces';
import { testI18n } from '@/tests/test-utils';

const noop = () => {};

const renderInput = (ui: React.ReactElement) =>
    render(<I18nextProvider i18n={testI18n}>{ui}</I18nextProvider>);

describe('Input — text type', () => {
    it('renders the label text', () => {
        renderInput(
            <Input
                type={InputType.TEXT}
                label="Username"
                placeholder=""
                value=""
                onChange={noop}
            />,
        );
        expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('renders placeholder text', () => {
        renderInput(
            <Input
                type={InputType.TEXT}
                label=""
                placeholder="Enter name"
                value=""
                onChange={noop}
            />,
        );
        expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
    });

    it('calls onChange with new value on input change', () => {
        const mockOnChange = jest.fn();
        renderInput(
            <Input
                type={InputType.TEXT}
                label=""
                placeholder=""
                value=""
                onChange={mockOnChange}
            />,
        );
        fireEvent.change(screen.getByTestId('input-control'), { target: { value: 'hello' } });
        expect(mockOnChange).toHaveBeenCalledWith('hello');
    });

    it('calls onBlur callback when field loses focus', () => {
        const mockOnBlur = jest.fn();
        renderInput(
            <Input
                type={InputType.TEXT}
                label=""
                placeholder=""
                value=""
                onChange={noop}
                onBlur={mockOnBlur}
            />,
        );
        fireEvent.blur(screen.getByTestId('input-control'));
        expect(mockOnBlur).toHaveBeenCalledTimes(1);
    });

    it('is disabled when disabled prop is true', () => {
        renderInput(
            <Input
                type={InputType.TEXT}
                label=""
                placeholder=""
                value=""
                onChange={noop}
                disabled
            />,
        );
        expect(screen.getByTestId('input-control')).toBeDisabled();
    });
});

describe('Input — validation states', () => {
    it('applies input-invalid class when state is INVALID', () => {
        renderInput(
            <Input
                type={InputType.TEXT}
                label=""
                placeholder=""
                value="bad"
                onChange={noop}
                validationState={ValidationState.INVALID}
                errorMessage="Error!"
            />,
        );
        expect(screen.getByTestId('input-control').parentElement).toHaveClass('input-invalid');
    });

    it('shows error message when state is INVALID', () => {
        renderInput(
            <Input
                type={InputType.TEXT}
                label=""
                placeholder=""
                value="bad"
                onChange={noop}
                validationState={ValidationState.INVALID}
                errorMessage="Field is required"
            />,
        );
        expect(screen.getByTestId('input-error')).toHaveTextContent('Field is required');
    });

    it('applies input-valid class when state is VALID', () => {
        renderInput(
            <Input
                type={InputType.TEXT}
                label=""
                placeholder=""
                value="good"
                onChange={noop}
                validationState={ValidationState.VALID}
            />,
        );
        expect(screen.getByTestId('input-control').parentElement).toHaveClass('input-valid');
    });

    it('shows success message when state is VALID', () => {
        renderInput(
            <Input
                type={InputType.TEXT}
                label=""
                placeholder=""
                value="good"
                onChange={noop}
                validationState={ValidationState.VALID}
                successMessage="Looks great!"
            />,
        );
        expect(screen.getByTestId('input-success')).toHaveTextContent('Looks great!');
    });

    it('shows check icon when state is VALID', () => {
        renderInput(
            <Input
                type={InputType.TEXT}
                label=""
                placeholder=""
                value="ok"
                onChange={noop}
                validationState={ValidationState.VALID}
            />,
        );
        expect(screen.getByText('✓')).toBeInTheDocument();
    });

    it('does not render error or success when state is IDLE', () => {
        renderInput(
            <Input
                type={InputType.TEXT}
                label=""
                placeholder=""
                value=""
                onChange={noop}
                validationState={ValidationState.IDLE}
                errorMessage="Error"
                successMessage="Ok"
            />,
        );
        expect(screen.queryByTestId('input-error')).not.toBeInTheDocument();
        expect(screen.queryByTestId('input-success')).not.toBeInTheDocument();
    });
});

describe('Input — password type', () => {
    it('renders as password type by default', () => {
        renderInput(
            <Input
                type={InputType.PASSWORD}
                label=""
                placeholder=""
                value="pass"
                onChange={noop}
            />,
        );
        expect(screen.getByTestId('input-control')).toHaveAttribute('type', 'password');
    });

    it('toggles to text type when show-password button is clicked', () => {
        renderInput(
            <Input
                type={InputType.PASSWORD}
                label=""
                placeholder=""
                value="pass"
                onChange={noop}
                showPasswordToggle
            />,
        );
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByTestId('input-control')).toHaveAttribute('type', 'text');
    });

    it('toggles back to password on second click', () => {
        renderInput(
            <Input
                type={InputType.PASSWORD}
                label=""
                placeholder=""
                value="pass"
                onChange={noop}
                showPasswordToggle
            />,
        );
        const btn = screen.getByRole('button');
        fireEvent.click(btn);
        fireEvent.click(btn);
        expect(screen.getByTestId('input-control')).toHaveAttribute('type', 'password');
    });

    it('does not show toggle button when showPasswordToggle is false', () => {
        renderInput(
            <Input
                type={InputType.PASSWORD}
                label=""
                placeholder=""
                value="pass"
                onChange={noop}
                showPasswordToggle={false}
            />,
        );
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
});

describe('Input — textarea type', () => {
    it('renders a textarea element', () => {
        renderInput(
            <Input
                type={InputType.TEXTAREA}
                label=""
                placeholder="Write here"
                value=""
                onChange={noop}
            />,
        );
        expect(screen.getByPlaceholderText('Write here').tagName).toBe('TEXTAREA');
    });

    it('shows character count info when maxLength is set', () => {
        renderInput(
            <Input
                type={InputType.TEXTAREA}
                label=""
                placeholder=""
                value="hi"
                showMaxLength={true}
                onChange={noop}
                maxLength={100}
            />,
        );
        expect(screen.getByText(/Max 100 chars/i)).toBeInTheDocument();
    });

    it('applies error class on char count when over limit', () => {
        const longText = 'a'.repeat(15);
        renderInput(
            <Input
                type={InputType.TEXTAREA}
                label=""
                placeholder=""
                value={longText}
                onChange={noop}
                maxLength={10}
                showMaxLength={true}
            />,
        );
        const charCount = screen.getByText(/Max 10 chars/i).closest('.input-char-count');
        expect(charCount).toHaveClass('input-char-count-error');
    });

    it('does not apply error class when within limit', () => {
        renderInput(
            <Input
                type={InputType.TEXTAREA}
                label=""
                placeholder=""
                value="hi"
                onChange={noop}
                maxLength={100}
                showMaxLength={true}
            />,
        );
        const charCount = screen.getByText(/Max 100 chars/i).closest('.input-char-count');
        expect(charCount).not.toHaveClass('input-char-count-error');
    });
});

describe('Input — file type', () => {
    it('renders file upload area', () => {
        renderInput(
            <Input
                type={InputType.FILE}
                label="Upload"
                placeholder="Choose a file"
                value=""
                onChange={noop}
            />,
        );
        expect(screen.getByText(/Choose a file/i)).toBeInTheDocument();
    });

    it('calls onFileChange with selected file', () => {
        const mockOnFileChange = jest.fn();
        renderInput(
            <Input
                type={InputType.FILE}
                label="Upload"
                placeholder="Select file"
                value=""
                onChange={noop}
                onFileChange={mockOnFileChange}
            />,
        );
        const file = new File(['content'], 'photo.png', { type: 'image/png' });
        fireEvent.change(screen.getByTestId('input-control'), { target: { files: [file] } });
        expect(mockOnFileChange).toHaveBeenCalledWith(file);
    });

    it('displays the filename after file selection', () => {
        renderInput(
            <Input
                type={InputType.FILE}
                label="Upload"
                placeholder="Select file"
                value=""
                onChange={noop}
                onFileChange={jest.fn()}
            />,
        );
        const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
        fireEvent.change(screen.getByTestId('input-control'), { target: { files: [file] } });
        expect(screen.getByText('resume.pdf')).toBeInTheDocument();
    });

    it('shows error message when INVALID and errorMessage provided', () => {
        renderInput(
            <Input
                type={InputType.FILE}
                label="Upload"
                placeholder=""
                value=""
                onChange={noop}
                validationState={ValidationState.INVALID}
                errorMessage="File too large"
            />,
        );
        expect(screen.getByTestId('input-error')).toHaveTextContent('File too large');
    });

    it('is disabled when disabled prop is true', () => {
        renderInput(
            <Input
                type={InputType.FILE}
                label="Upload"
                placeholder=""
                value=""
                onChange={noop}
                disabled
            />,
        );
        expect(screen.getByTestId('input-control')).toBeDisabled();
    });
});
