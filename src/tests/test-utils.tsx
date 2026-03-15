import React, { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import authReducer from '../redux/AuthSlice';
import AuthContext from '../context/AuthContext/AuthContext';
import ThemeContext from '../context/ThemeContext/ThemeContext';
import ToastContext from '../context/ToastContext/ToastContext';
import en from '../i18n/locales/en';
import {
    ThemeTypes,
    type AuthContextType,
    type ToastContextType,
    type ThemeContextType,
    type LoginPayload,
    type RegisterPayload,
} from '../interfaces/interfaces';
import { type RootState } from '../redux/store';
import { type EnhancedStore } from '@reduxjs/toolkit';

type AppStore = EnhancedStore<{ auth: ReturnType<typeof authReducer> }>;

const testI18n = i18n.createInstance();
testI18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    resources: { en: { translation: en } },
    interpolation: { escapeValue: false },
});

const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: { queries: { retry: false, gcTime: Infinity } },
    });

type AuthValueMock = Partial<Record<keyof AuthContextType, unknown>>;

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    preloadedState?: Partial<RootState>;
    store?: AppStore;
    authValue?: AuthValueMock;
    themeValue?: Partial<ThemeContextType>;
    toastValue?: Partial<ToastContextType>;
}

function renderWithProviders(
    ui: ReactElement,
    {
        preloadedState = {},
        store = configureStore({
            reducer: { auth: authReducer },
            preloadedState: preloadedState as RootState,
        }),
        authValue = {},
        themeValue = {},
        toastValue = {},
        ...renderOptions
    }: ExtendedRenderOptions = {},
) {
    const queryClient = createTestQueryClient();

    const baseAuthValue: AuthContextType = {
        user: { id: 1, username: 'testuser', firstName: 'Test', secondName: 'User' },
        accessToken: 'mock-token',
        isLoggedIn: true,
        isLoading: false,
        login: jest.fn<Promise<void>, [LoginPayload]>(() => Promise.resolve()),
        register: jest.fn<Promise<void>, [RegisterPayload]>(() => Promise.resolve()),
        logout: jest.fn(),
    };

    const finalAuthValue: AuthContextType = {
        ...baseAuthValue,
        ...(authValue as unknown as AuthContextType),
    };

    const finalThemeValue: ThemeContextType = {
        theme: ThemeTypes.DARK,
        toggleTheme: jest.fn(),
        setTheme: jest.fn(),
        ...themeValue,
    };

    const finalToastValue: ToastContextType = {
        toasts: [],
        addToast: jest.fn(),
        removeToast: jest.fn(),
        ...toastValue,
    };

    function Wrapper({ children }: { children: React.ReactNode }) {
        return (
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <I18nextProvider i18n={testI18n}>
                        <AuthContext.Provider value={finalAuthValue}>
                            <ToastContext.Provider value={finalToastValue}>
                                <ThemeContext.Provider value={finalThemeValue}>
                                    {children}
                                </ThemeContext.Provider>
                            </ToastContext.Provider>
                        </AuthContext.Provider>
                    </I18nextProvider>
                </QueryClientProvider>
            </Provider>
        );
    }

    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export * from '@testing-library/react';
export { renderWithProviders, testI18n };
