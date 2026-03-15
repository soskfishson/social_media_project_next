'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMyLikesQuery, useMyCommentsQuery, useMyPostsQuery } from '@/hooks/useStatisticsQuery';
import StatCard from './StatCard';
import ViewToggle from './ViewToggle';
import LikesSection from './LikesSection';
import CommentsSection from './CommentsSection';
import './ProfileStatistics.css';

function calcMonthOverMonth(items: { creationDate: string }[]): number {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    const thisCount = items.filter((item) => {
        const d = new Date(item.creationDate);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;

    const lastCount = items.filter((item) => {
        const d = new Date(item.creationDate);
        return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
    }).length;

    if (lastCount === 0) {
        return thisCount > 0 ? 100 : 0;
    }
    return Math.round(((thisCount - lastCount) / lastCount) * 100);
}

const ProfileStatisticsClient = () => {
    const [isChartView, setIsChartView] = useState(false);
    const { t } = useTranslation();

    const { data: likes = [], isLoading: likesLoading } = useMyLikesQuery();
    const { data: comments = [], isLoading: commentsLoading } = useMyCommentsQuery();
    const { data: posts = [], isLoading: postsLoading } = useMyPostsQuery();
    console.log(likes);

    const likesMoM = calcMonthOverMonth(likes);
    const commentsMoM = calcMonthOverMonth(comments);
    const postsMoM = calcMonthOverMonth(posts);

    return (
        <div className="statistics-container" data-testid="statistics-container">
            <div className="stat-cards">
                <StatCard
                    title={t('stats.totalLikes')}
                    value={likes.length}
                    change={likesMoM}
                    loading={likesLoading}
                />
                <StatCard
                    title={t('stats.totalComments')}
                    value={comments.length}
                    change={commentsMoM}
                    loading={commentsLoading}
                />
                <StatCard
                    title={t('stats.totalPosts')}
                    value={posts.length}
                    change={postsMoM}
                    loading={postsLoading}
                />
            </div>

            <ViewToggle isChartView={isChartView} onChange={setIsChartView} />

            <div className="statistics-sections">
                <LikesSection
                    likes={likes}
                    isChartView={isChartView}
                    loading={likesLoading}
                    isEmpty={likes.length === 0}
                />
                <CommentsSection
                    comments={comments}
                    isEmpty={comments.length === 0}
                    isChartView={isChartView}
                    loading={commentsLoading}
                />
            </div>
        </div>
    );
};

export default ProfileStatisticsClient;
