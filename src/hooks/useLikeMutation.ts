import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Post } from '@/interfaces/interfaces';
import { apiClient } from '@/api/api';

interface LikeResponse {
    status: 'liked' | 'disliked';
    postId: number;
    newLikesCount: number;
}

function usePostReactionMutation(endpoint: '/api/like' | '/api/dislike') {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (postId: number) => {
            const { data } = await apiClient.post<LikeResponse>(endpoint, { postId });
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.setQueryData(['posts'], (oldPosts: Post[] | undefined) => {
                if (!oldPosts) {
                    return undefined;
                }
                return oldPosts.map((post) =>
                    post.id === data.postId ? { ...post, likesCount: data.newLikesCount } : post,
                );
            });
        },
    });
}

export function usePostReactions() {
    const like = usePostReactionMutation('/api/like');
    const dislike = usePostReactionMutation('/api/dislike');

    return { like, dislike };
}
