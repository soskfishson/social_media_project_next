import { renderWithProviders, screen } from '../tests/test-utils';
import ErrorPage from './error';

describe('ErrorPage — generic error', () => {
    it('renders generic error message', () => {
        renderWithProviders(<ErrorPage />);
        expect(screen.getByText(/Something bad has just happened/i)).toBeInTheDocument();
    });

    it('renders error-message element', () => {
        renderWithProviders(<ErrorPage />);
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    it('renders the simple header', () => {
        renderWithProviders(<ErrorPage />);
        expect(document.querySelector('.header-simple')).toBeInTheDocument();
    });

    it('renders the footer', () => {
        renderWithProviders(<ErrorPage />);
        expect(screen.getByText(/© 2026 Sidekick/i)).toBeInTheDocument();
    });

    it('renders the error page container', () => {
        renderWithProviders(<ErrorPage />);
        expect(document.querySelector('.error-page')).toBeInTheDocument();
    });
});
