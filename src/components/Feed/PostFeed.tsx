'use client';

import { useState, useEffect, useRef } from 'react';
import Post from '../Post/Post';
import PostSkeleton from '../Skeletons/PostSkeleton';
import { usePostsQuery } from '@/hooks/usePostsQuery';
import type { Post as PostType } from '@/interfaces/interfaces';

const POSTS_PER_PAGE = 5;

export default function PostFeed() {
    const { data: posts = [], isLoading, error } = usePostsQuery();
    const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
    const sentinelRef = useRef<HTMLDivElement>(null);

    const visiblePosts = posts.slice(0, visibleCount);
    const hasMore = visibleCount < posts.length;

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleCount((prev) => Math.min(prev + POSTS_PER_PAGE, posts.length));
                }
            },
            { threshold: 0.1 },
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [posts.length]);

    return (
        <section className="main-page-section" data-testid="post-list">
            {isLoading && (
                <div data-testid="main-loader">
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </div>
            )}

            {error && <p className="status-message error">{error.message}</p>}

            {posts.length === 0 && !isLoading && (
                <p className="post-feed-empty">No posts to show yet</p>
            )}

            {!isLoading && visiblePosts.map((post: PostType) => <Post post={post} key={post.id} />)}

            {!isLoading && (
                <div ref={sentinelRef} className="scroll-sentinel">
                    {hasMore && (
                        <>
                            <PostSkeleton />
                            <PostSkeleton />
                        </>
                    )}
                </div>
            )}
        </section>
    );
}
