'use client';

import { type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { store } from '@/redux/store';
import { setupInterceptors } from '@/api/api';
import ToastProvider from '@/context/ToastContext/ToastProvider';
import AuthProvider from '@/context/AuthContext/AuthProvider';
import ThemeProvider from '@/context/ThemeContext/ThemeProvider';

setupInterceptors(store);

import '@/i18n/i18n';

interface ProvidersProps {
    children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60,
                        gcTime: 1000 * 60 * 5,
                    },
                },
            }),
    );

    useEffect(() => {
        import('@sidekick-monorepo/internship-backend')
            .then(({ startMockingSocial }) => startMockingSocial(''))
            .catch(console.error);
    }, []);

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
