import { renderHook, act } from '@testing-library/react';
import { type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import useTimeAgo from './useTimeAgo';
import { testI18n } from '../tests/test-utils';

const wrapper = ({ children }: { children: ReactNode }) => (
    <I18nextProvider i18n={testI18n}>{children}</I18nextProvider>
);

describe('useTimeAgo initial value', () => {
    it('returns the correct initial time label for a recent date', () => {
        const { result } = renderHook(() => useTimeAgo(new Date()), { wrapper });
        expect(result.current).toBe('Just now');
    });

    it('returns the correct initial label for minutes ago', () => {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const { result } = renderHook(() => useTimeAgo(fiveMinutesAgo), { wrapper });
        expect(result.current).toBe('5 min ago');
    });
});

describe('useTimeAgo interval updates', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('updates the label after 60 seconds', () => {
        const date = new Date(Date.now() - 59 * 1000);
        const { result } = renderHook(() => useTimeAgo(date), { wrapper });
        expect(result.current).toBe('Just now');

        act(() => {
            jest.advanceTimersByTime(60000);
        });

        expect(result.current).toBe('1 min ago');
    });

    it('clears the interval on unmount', () => {
        const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
        const { unmount } = renderHook(() => useTimeAgo(new Date()), { wrapper });
        unmount();
        expect(clearIntervalSpy).toHaveBeenCalled();
        clearIntervalSpy.mockRestore();
    });
});
