'use client';

import { useTranslation } from 'react-i18next';

interface ViewToggleProps {
    isChartView: boolean;
    onChange: (value: boolean) => void;
}

const ViewToggle = ({ isChartView, onChange }: ViewToggleProps) => {
    const { t } = useTranslation();
    return (
        <div className="view-toggle-container" data-testid="view-toggle">
            {!isChartView && (
                <span
                    className={`view-toggle-label ${!isChartView ? 'active' : ''}`}
                    data-testid="table-label"
                >
                    {t('stats.tableView')}
                </span>
            )}
            <button
                role="switch"
                aria-checked={isChartView}
                aria-label="Toggle chart view"
                onClick={() => onChange(!isChartView)}
                className={`toggle-switch ${isChartView ? 'active' : ''}`}
                data-testid="toggle-button"
            >
                <span className="toggle-slider" />
            </button>
            <span
                className={`view-toggle-label ${isChartView ? 'active' : ''}`}
                data-testid="chart-label"
            >
                {t('stats.chartView')}
            </span>
        </div>
    );
};

export default ViewToggle;
