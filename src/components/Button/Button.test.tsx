import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';
import { ButtonType } from '@/interfaces/interfaces';

describe('Button — rendering', () => {
    it('renders provided label text', () => {
        render(<Button label="Submit Post" data-testid="btn" />);
        expect(screen.getByTestId('btn')).toHaveTextContent('Submit Post');
    });

    it('renders children when no label is provided', () => {
        render(
            <Button data-testid="btn">
                <span>Icon</span>
            </Button>,
        );
        expect(screen.getByTestId('btn')).toContainElement(screen.getByText('Icon'));
    });

    it('renders × by default for CLOSE type when no label or children', () => {
        render(<Button type={ButtonType.CLOSE} data-testid="btn" />);
        expect(screen.getByTestId('btn')).toHaveTextContent('×');
    });

    it('uses default testid when data-testid prop is not set', () => {
        render(<Button label="Default" />);
        expect(screen.getByTestId('custom-button')).toBeInTheDocument();
    });
});

describe('Button — types and classes', () => {
    it('applies submit-button class for SUBMIT type', () => {
        render(<Button type={ButtonType.SUBMIT} data-testid="btn" />);
        expect(screen.getByTestId('btn')).toHaveClass('submit-button');
    });

    it('applies close-button-variant class for CLOSE type', () => {
        render(<Button type={ButtonType.CLOSE} data-testid="btn" />);
        expect(screen.getByTestId('btn')).toHaveClass('close-button-variant');
    });

    it('renders as plain button element for BUTTON type', () => {
        render(<Button type={ButtonType.BUTTON} data-testid="btn" />);
        expect(screen.getByTestId('btn').tagName).toBe('BUTTON');
    });

    it('merges custom className with base class', () => {
        render(<Button type={ButtonType.SUBMIT} className="custom-class" data-testid="btn" />);
        const btn = screen.getByTestId('btn');
        expect(btn).toHaveClass('submit-button');
        expect(btn).toHaveClass('custom-class');
    });
});

describe('Button — interactions', () => {
    it('fires onClick handler on click', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick} data-testid="btn" />);
        fireEvent.click(screen.getByTestId('btn'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('is disabled when disabled prop is true', () => {
        render(<Button disabled data-testid="btn" />);
        expect(screen.getByTestId('btn')).toBeDisabled();
    });

    it('does not fire onClick when disabled', () => {
        const handleClick = jest.fn();
        render(<Button disabled onClick={handleClick} data-testid="btn" />);
        fireEvent.click(screen.getByTestId('btn'));
        expect(handleClick).not.toHaveBeenCalled();
    });

    it('is enabled by default', () => {
        render(<Button data-testid="btn" />);
        expect(screen.getByTestId('btn')).not.toBeDisabled();
    });
});
