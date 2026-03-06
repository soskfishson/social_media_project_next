const timeAgo = (
    date: string | Date | number,
    t: (key: string, params?: Record<string, string | number>) => string,
    locale: string,
): string => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return t('time.justNow');

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return t('time.minAgo', { count: diffInMinutes });
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return diffInHours === 1 ? t('time.hourAgo') : t('time.hoursAgo', { count: diffInHours });
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return diffInDays === 1 ? t('time.dayAgo') : t('time.daysAgo', { count: diffInDays });
    }

    const intlLocale = locale === 'en' ? 'en-US' : locale;

    return new Intl.DateTimeFormat(intlLocale, {
        month: 'short',
        day: 'numeric',
        year: now.getFullYear() !== past.getFullYear() ? 'numeric' : undefined,
    }).format(past);
};

export default timeAgo;
