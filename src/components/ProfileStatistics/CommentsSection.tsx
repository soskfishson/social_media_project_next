import { useTranslation } from 'react-i18next';
import BarChart, { type ChartDataPoint } from './BarChart';

interface Comment {
    id: number;
    text: string;
    authorId: number;
    postId: number;
    creationDate: string;
    modifiedDate: string;
}

interface CommentsSectionProps {
    comments: Comment[];
    isEmpty: boolean;
    isChartView: boolean;
    loading: boolean;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getCommentsChartData(comments: Comment[]): ChartDataPoint[] {
    const counts = Array(12).fill(0);
    comments.forEach((c) => {
        const month = new Date(c.creationDate).getMonth();
        if (!isNaN(month)) {
            counts[month]++;
        }
    });
    return MONTHS.map((label, i) => ({ label, value: counts[i] }));
}

function truncate(text: string, max = 30): string {
    return text.length > max ? text.slice(0, max) + '…' : text;
}

const CommentsSection = ({ comments, isEmpty, isChartView, loading }: CommentsSectionProps) => {
    const { t } = useTranslation();
    const chartData = getCommentsChartData(comments);

    return (
        <section className="statistics-section" aria-label={t('stats.comments')}>
            <h3 className="statistics-section-title">{t('stats.comments')}</h3>

            {loading ? (
                <div className="chart-wrapper">
                    <div className="stat-card-skeleton" style={{ height: '200px' }} />
                </div>
            ) : isChartView ? (
                <>
                    {isEmpty && <p className="chart-placeholder-notice">{t('stats.sampleData')}</p>}
                    <BarChart data={chartData} title={t('stats.commentsChartTitle')} />
                </>
            ) : (
                <table className="stats-table" data-testid="comments-table">
                    <thead>
                        <tr className="stats-table-title-row">
                            <th colSpan={3}>{t('stats.comments')}</th>
                        </tr>
                        <tr className="stats-table-col-row">
                            <th>{t('stats.colComment')}</th>
                            <th>{t('stats.colPost')}</th>
                            <th>{t('stats.colDate')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comments.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={3}
                                    style={{ textAlign: 'center', color: 'var(--text-secondary)' }}
                                >
                                    {t('stats.noCommentsYet')}
                                </td>
                            </tr>
                        ) : (
                            comments.slice(0, 7).map((comment) => (
                                <tr key={comment.id}>
                                    <td title={comment.text}>{truncate(comment.text)}</td>
                                    <td>#{comment.postId}</td>
                                    <td>{new Date(comment.creationDate).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </section>
    );
};

export default CommentsSection;
