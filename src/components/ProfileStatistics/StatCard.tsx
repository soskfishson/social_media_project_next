'use client';

import { useTranslation } from 'react-i18next';

interface StatCardProps {
    title: string;
    value: number;
    change: number;
    loading?: boolean;
}

const StatCard = ({ title, value, change, loading = false }: StatCardProps) => {
    const changeClass = change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral';
    const changePrefix = change > 0 ? '+' : '';
    const { t } = useTranslation();

    return (
        <div className="stat-card" data-testid="stat-card">
            <p className="stat-card-title">{title}</p>
            {loading ? (
                <>
                    <div className="stat-card-skeleton" style={{ width: '60%', height: '36px' }} />
                    <div className="stat-card-skeleton" style={{ width: '80%' }} />
                </>
            ) : (
                <>
                    <p className="stat-card-value" data-testid="stat-card-value">
                        {value.toLocaleString()}
                    </p>
                    <p className={`stat-card-change ${changeClass}`} data-testid="stat-card-change">
                        {t('stats.monthOverMonth', { change: `${changePrefix}${change}` })}
                    </p>
                </>
            )}
        </div>
    );
};

export default StatCard;
