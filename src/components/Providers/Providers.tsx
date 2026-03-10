'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '@/redux/store';
import { setupInterceptors } from '@/api/api';
import ToastProvider from '@/context/ToastContext/ToastProvider';
import AuthProvider from '@/context/AuthContext/AuthProvider';
import ThemeProvider from '@/context/ThemeContext/ThemeProvider';
import '@/i18n/i18n';

setupInterceptors(store);

export default function Providers({ children }: { children: ReactNode }) {
    const [mockingReady, setMockingReady] = useState(false);
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60,
                        gcTime: 1000 * 60 * 5,
                        retry: false,
                    },
                },
            }),
    );

    useEffect(() => {
        async function enableApiMocking() {
            try {
                const { startMockingSocial } =
                    await import('@sidekick-monorepo/internship-backend');
                await startMockingSocial('');
                setMockingReady(true);
            } catch (error) {
                console.error('Failed to start MSW:', error);
            }
        }

        enableApiMocking();
    }, []);

    if (!mockingReady) {
        return null;
    }

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <ToastProvider>
                    <AuthProvider>
                        <ThemeProvider>{children}</ThemeProvider>
                    </AuthProvider>
                </ToastProvider>
            </QueryClientProvider>
        </Provider>
    );
}
