import { useQuery } from '@tanstack/react-query';
import type { Post, Comment } from '@/interfaces/interfaces';

const BASE_URL = '';

interface Like {
    id: number;
    postId: number;
    userId: number;
    creationDate: string;
}

const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
});

async function fetchMyLikes(): Promise<Like[]> {
    const res = await fetch(`${BASE_URL}/api/me/likes`, {
        method: 'GET',
        headers: authHeader(),
    });
    if (!res.ok) {
        throw new Error('Failed to fetch likes');
    }
    return res.json();
}

async function fetchMyComments(): Promise<Comment[]> {
    const res = await fetch(`${BASE_URL}/api/me/comments`, {
        method: 'GET',
        headers: authHeader(),
    });
    if (!res.ok) {
        throw new Error('Failed to fetch comments');
    }
    return res.json();
}

async function fetchMyPosts(): Promise<Post[]> {
    const res = await fetch(`${BASE_URL}/api/me/posts`, {
        method: 'GET',
        headers: authHeader(),
    });
    if (!res.ok) {
        throw new Error('Failed to fetch posts');
    }
    return res.json();
}

export function useMyLikesQuery() {
    return useQuery({
        queryKey: ['me', 'likes'],
        queryFn: fetchMyLikes,
        staleTime: 1000 * 60 * 5,
    });
}

export function useMyCommentsQuery() {
    return useQuery({
        queryKey: ['me', 'comments'],
        queryFn: fetchMyComments,
        staleTime: 1000 * 60 * 5,
    });
}

export function useMyPostsQuery() {
    return useQuery({
        queryKey: ['me', 'posts'],
        queryFn: fetchMyPosts,
        staleTime: 1000 * 60 * 5,
    });
}
