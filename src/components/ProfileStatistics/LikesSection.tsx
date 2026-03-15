import { useTranslation } from 'react-i18next';
import LineChart, { type ChartDataPoint } from './LineChart';

interface Like {
    id: number;
    postId: number;
    userId: number;
    creationDate: string;
}

interface LikesSectionProps {
    likes: Like[];
    isEmpty: boolean;
    isChartView: boolean;
    loading: boolean;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getLikesChartData(likes: Like[]): ChartDataPoint[] {
    const now = new Date();
    return Array.from({ length: 8 }, (_, i) => {
        const date = new Date(now);
        date.setDate(now.getDate() - (7 - i));
        const dateStr = date.toISOString().split('T')[0];
        const count = likes.filter((l) => l.creationDate?.startsWith(dateStr)).length;
        const label = i === 7 ? 'Today' : `${date.getDate()} ${MONTHS[date.getMonth()]}`;
        return { label, value: count };
    });
}

const LikesSection = ({ likes, isEmpty, isChartView, loading }: LikesSectionProps) => {
    const { t } = useTranslation();
    const chartData = getLikesChartData(likes);

    return (
        <section className="statistics-section" aria-label={t('stats.likes')}>
            <h3 className="statistics-section-title">{t('stats.likes')}</h3>

            {loading ? (
                <div className="chart-wrapper">
                    <div className="stat-card-skeleton" style={{ height: '200px' }} />
                </div>
            ) : isChartView ? (
                <>
                    {isEmpty && <p className="chart-placeholder-notice">{t('stats.sampleData')}</p>}
                    <LineChart data={chartData} title={t('stats.likesChartTitle')} />
                </>
            ) : (
                <table className="stats-table" data-testid="likes-table">
                    <thead>
                        <tr className="stats-table-title-row">
                            <th colSpan={3}>{t('stats.likes')}</th>
                        </tr>
                        <tr className="stats-table-col-row">
                            <th>{t('stats.colPostId')}</th>
                            <th>{t('stats.colDay')}</th>
                            <th>{t('stats.colDate')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {likes.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={3}
                                    style={{ textAlign: 'center', color: 'var(--text-secondary)' }}
                                >
                                    {t('stats.noLikesYet')}
                                </td>
                            </tr>
                        ) : (
                            likes.slice(0, 7).map((like) => {
                                const date = new Date(like.creationDate);
                                return (
                                    <tr key={like.id}>
                                        <td>#{like.postId}</td>
                                        <td>{DAYS[date.getDay()]}</td>
                                        <td>{date.toLocaleDateString()}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            )}
        </section>
    );
};

export default LikesSection;
