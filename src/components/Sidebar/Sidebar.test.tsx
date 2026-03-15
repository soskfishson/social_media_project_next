import { renderWithProviders, screen, waitFor } from '../../tests/test-utils';
import Sidebar from './Sidebar';

const renderLoggedIn = () => renderWithProviders(<Sidebar />, { authValue: { isLoggedIn: true } });

describe('Sidebar — unauthenticated', () => {
    it('renders nothing when user is not logged in', () => {
        const { container } = renderWithProviders(<Sidebar />, {
            authValue: { isLoggedIn: false },
        });
        expect(container.firstChild).toBeNull();
    });
});

describe('Sidebar — loading state', () => {
    it('shows two skeleton sections while loading', () => {
        (global.fetch as jest.Mock).mockReturnValue(new Promise(() => {}));
        renderLoggedIn();
        expect(screen.getAllByTestId('sidebar-skeleton')).toHaveLength(2);
    });

    it('hides skeleton sections after data resolves', async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({ ok: true, json: async () => [] })
            .mockResolvedValueOnce({ ok: true, json: async () => [] });
        renderLoggedIn();
        await waitFor(() => {
            expect(screen.queryByTestId('sidebar-skeleton')).not.toBeInTheDocument();
        });
    });
});

describe('Sidebar — data rendering', () => {
    it('renders suggested user name', async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [
                    { id: 1, firstName: 'Alice', secondName: 'Smith', username: 'asmith' },
                ],
            })
            .mockResolvedValueOnce({ ok: true, json: async () => [] });
        renderLoggedIn();
        expect(await screen.findByText('Alice Smith')).toBeInTheDocument();
    });

    it('renders suggested user username as description', async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [
                    { id: 1, firstName: 'Alice', secondName: 'Smith', username: 'asmith' },
                ],
            })
            .mockResolvedValueOnce({ ok: true, json: async () => [] });
        renderLoggedIn();
        expect(await screen.findByText('asmith')).toBeInTheDocument();
    });

    it('renders group title', async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({ ok: true, json: async () => [] })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [{ id: 1, title: 'React Devs', membersCount: 42 }],
            });
        renderLoggedIn();
        expect(await screen.findByText('React Devs')).toBeInTheDocument();
    });

    it('renders group member count', async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({ ok: true, json: async () => [] })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [{ id: 1, title: 'React Devs', membersCount: 42 }],
            });
        renderLoggedIn();
        expect(await screen.findByText('42 members')).toBeInTheDocument();
    });

    it('renders both section headings when lists are empty', async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({ ok: true, json: async () => [] })
            .mockResolvedValueOnce({ ok: true, json: async () => [] });
        renderLoggedIn();
        await waitFor(() => {
            expect(screen.getByText('Suggested people')).toBeInTheDocument();
            expect(screen.getByText('Communities you might like')).toBeInTheDocument();
        });
    });
});

describe('Sidebar — error handling', () => {
    it('hides skeletons after network error', async () => {
        (global.fetch as jest.Mock).mockRejectedValue(new Error('Network Fail'));
        renderLoggedIn();
        await waitFor(() => {
            expect(screen.queryByTestId('sidebar-skeleton')).not.toBeInTheDocument();
        });
    });
});
