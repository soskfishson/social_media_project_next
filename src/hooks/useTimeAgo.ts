import { useState, useEffect } from 'react';
import timeAgo from '../utils/dateUtils';
import { useTranslation } from 'react-i18next';

const useTimeAgo = (dateString: string | Date | number) => {
    const { t, i18n } = useTranslation();

    const [, setTick] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTick((prev) => prev + 1);
        }, 60000);

        return () => clearInterval(intervalId);
    }, [dateString]);

    return timeAgo(dateString, t, i18n.language);
};

export default useTimeAgo;
