'use client';

import { useEffect, useCallback, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import ThemeContext from './ThemeContext';
import { ThemeTypes } from '@/interfaces/interfaces';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

interface ThemeProviderProps {
    children: ReactNode;
}

const subscribe = (callback: () => void) => {
    if (typeof window === 'undefined') return () => {};

    window.addEventListener('storage', callback);
    window.addEventListener('local-theme-change', callback);

    return () => {
        window.removeEventListener('storage', callback);
        window.removeEventListener('local-theme-change', callback);
    };
};

const getSnapshot = () => {
    return (localStorage.getItem('theme') as ThemeTypes) || ThemeTypes.DARK;
};

const getServerSnapshot = () => {
    return ThemeTypes.DARK;
};

const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    useEffect(() => {
        document.body.setAttribute('data-theme', theme.toLowerCase());
    }, [theme]);

    const muiTheme = useMemo(() => {
        const isDark = theme === ThemeTypes.DARK;

        return createTheme({
            palette: {
                mode: isDark ? 'dark' : 'light',
                primary: {
                    main: '#7A44FF',
                },
                background: {
                    default: isDark ? '#0E1223' : '#FFFFFF',
                    paper: isDark ? '#0E1223' : '#FFFFFF',
                },
                text: {
                    primary: isDark ? '#FFFFFF' : '#000000',
                    secondary: isDark ? '#8791B7' : '#667085',
                },
                divider: isDark ? '#384162' : '#E0E2E7',
            },
            typography: {
                fontFamily: "'Inter', sans-serif",
            },
        });
    }, [theme]);

    const setTheme = useCallback((newTheme: ThemeTypes) => {
        localStorage.setItem('theme', newTheme);
        window.dispatchEvent(new Event('local-theme-change'));
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(theme === ThemeTypes.LIGHT ? ThemeTypes.DARK : ThemeTypes.LIGHT);
    }, [theme, setTheme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            <MUIThemeProvider theme={muiTheme}>
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
