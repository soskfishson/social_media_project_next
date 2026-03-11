import { render, screen, fireEvent } from '@testing-library/react';
import TabSwitch from './TabSwitch';

const tabs = [
    { id: 'tab1', label: 'First Tab' },
    { id: 'tab2', label: 'Second Tab' },
    { id: 'tab3', label: 'Third Tab' },
];

describe('TabSwitch — initial rendering', () => {
    it('renders all tab labels', () => {
        render(<TabSwitch tabs={tabs} />);
        expect(screen.getByText('First Tab')).toBeInTheDocument();
        expect(screen.getByText('Second Tab')).toBeInTheDocument();
        expect(screen.getByText('Third Tab')).toBeInTheDocument();
    });

    it('first tab is active by default', () => {
        render(<TabSwitch tabs={tabs} />);
        expect(screen.getByText('First Tab')).toHaveClass('active');
    });

    it('respects defaultTab prop', () => {
        render(<TabSwitch tabs={tabs} defaultTab="tab2" />);
        expect(screen.getByText('Second Tab')).toHaveClass('active');
        expect(screen.getByText('First Tab')).not.toHaveClass('active');
    });

    it('only one tab is active initially', () => {
        render(<TabSwitch tabs={tabs} />);
        const activeButtons = document.querySelectorAll('.tab-switch-button.active');
        expect(activeButtons).toHaveLength(1);
    });
});

describe('TabSwitch — tab switching', () => {
    it('marks clicked tab as active', () => {
        render(<TabSwitch tabs={tabs} />);
        fireEvent.click(screen.getByText('Second Tab'));
        expect(screen.getByText('Second Tab')).toHaveClass('active');
    });

    it('removes active class from previously active tab', () => {
        render(<TabSwitch tabs={tabs} />);
        fireEvent.click(screen.getByText('Second Tab'));
        expect(screen.getByText('First Tab')).not.toHaveClass('active');
    });

    it('calls onTabChange with the clicked tab id', () => {
        const onTabChange = jest.fn();
        render(<TabSwitch tabs={tabs} onTabChange={onTabChange} />);
        fireEvent.click(screen.getByText('Second Tab'));
        expect(onTabChange).toHaveBeenCalledWith('tab2');
    });

    it('calls onTabChange each time a tab is clicked', () => {
        const onTabChange = jest.fn();
        render(<TabSwitch tabs={tabs} onTabChange={onTabChange} />);
        fireEvent.click(screen.getByText('Second Tab'));
        fireEvent.click(screen.getByText('Third Tab'));
        expect(onTabChange).toHaveBeenCalledTimes(2);
        expect(onTabChange).toHaveBeenLastCalledWith('tab3');
    });

    it('does not call onTabChange when prop is not provided', () => {
        render(<TabSwitch tabs={tabs} />);
        expect(() => fireEvent.click(screen.getByText('Second Tab'))).not.toThrow();
    });

    it('clicking the already active tab keeps it active', () => {
        const onTabChange = jest.fn();
        render(<TabSwitch tabs={tabs} onTabChange={onTabChange} />);
        fireEvent.click(screen.getByText('First Tab'));
        expect(screen.getByText('First Tab')).toHaveClass('active');
        expect(onTabChange).toHaveBeenCalledWith('tab1');
    });
});
