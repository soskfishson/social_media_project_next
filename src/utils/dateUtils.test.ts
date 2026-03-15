import timeAgo from './dateUtils';

const secondsAgo = (n: number) => new Date(Date.now() - n * 1000);
const minutesAgo = (n: number) => secondsAgo(n * 60);
const hoursAgo = (n: number) => minutesAgo(n * 60);
const daysAgo = (n: number) => hoursAgo(n * 24);

const mockT = (key: string, params?: Record<string, string | number>) => {
    if (key === 'time.justNow') return 'Just now';
    if (key === 'time.minAgo') return `${params?.count} min ago`;
    if (key === 'time.hourAgo') return '1 hour ago';
    if (key === 'time.hoursAgo') return `${params?.count} hours ago`;
    if (key === 'time.dayAgo') return '1 day ago';
    if (key === 'time.daysAgo') return `${params?.count} days ago`;
    return key;
};

describe('timeAgo — recent', () => {
    it('returns "Just now" for 0 seconds ago', () => {
        expect(timeAgo(new Date(), mockT, 'en')).toBe('Just now');
    });

    it('returns "Just now" for 30 seconds ago', () => {
        expect(timeAgo(secondsAgo(30), mockT, 'en')).toBe('Just now');
    });

    it('returns "Just now" for future dates', () => {
        const future = new Date(Date.now() + 10000);
        expect(timeAgo(future, mockT, 'en')).toBe('Just now');
    });
});

describe('timeAgo — minutes', () => {
    it('returns "1 min ago" for 1 minute ago', () => {
        expect(timeAgo(minutesAgo(1), mockT, 'en')).toBe('1 min ago');
    });

    it('returns "59 min ago" for 59 minutes ago', () => {
        expect(timeAgo(minutesAgo(59), mockT, 'en')).toBe('59 min ago');
    });
});

describe('timeAgo — hours', () => {
    it('returns "1 hour ago" for 1 hour ago', () => {
        expect(timeAgo(hoursAgo(1), mockT, 'en')).toBe('1 hour ago');
    });

    it('returns plural "hours" for more than 1 hour', () => {
        expect(timeAgo(hoursAgo(5), mockT, 'en')).toBe('5 hours ago');
    });
});

describe('timeAgo — days', () => {
    it('returns "1 day ago" for 1 day ago', () => {
        expect(timeAgo(daysAgo(1), mockT, 'en')).toBe('1 day ago');
    });

    it('returns plural "days" for more than 1 day', () => {
        expect(timeAgo(daysAgo(3), mockT, 'en')).toBe('3 days ago');
    });
});

describe('timeAgo — formatted date', () => {
    it('returns formatted date string for 7+ days ago', () => {
        const result = timeAgo(daysAgo(7), mockT, 'en');
        expect(result).not.toContain('ago');
        expect(result).not.toBe('Just now');
    });

    it('accepts string date as input', () => {
        const str = new Date(Date.now() - 3 * 60 * 1000).toISOString();
        expect(timeAgo(str, mockT, 'en')).toBe('3 min ago');
    });
});
