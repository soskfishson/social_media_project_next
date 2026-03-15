import { renderWithProviders, screen } from '../tests/test-utils';
import NotFoundPage from './not-found';

describe('NotFoundPage', () => {
    it('renders Page not found message', () => {
        renderWithProviders(<NotFoundPage />);
        expect(screen.getByText(/Page not found/i)).toBeInTheDocument();
    });

    it('renders error-message element', () => {
        renderWithProviders(<NotFoundPage />);
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    it('renders the simple header', () => {
        renderWithProviders(<NotFoundPage />);
        expect(document.querySelector('.header-simple')).toBeInTheDocument();
    });

    it('renders the footer', () => {
        renderWithProviders(<NotFoundPage />);
        expect(screen.getByText(/© 2026 Sidekick/i)).toBeInTheDocument();
    });
});
