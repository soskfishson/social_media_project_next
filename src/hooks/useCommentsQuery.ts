import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Comment } from '@/interfaces/interfaces';
import { apiClient } from '@/api/api';

export function useCommentsQuery(postId: number) {
    return useQuery({
        queryKey: ['comments', postId],
        queryFn: async () => {
            const { data } = await apiClient.get<Comment[]>(`/api/posts/${postId}/comments`);
            return data;
        },
    });
}

export function useAddCommentMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ postId, text }: { postId: number; text: string }) => {
            const { data } = await apiClient.post<Comment>('/api/comments', { postId, text });
            return data;
        },
        onSuccess: (comment) => {
            queryClient.invalidateQueries({ queryKey: ['comments', comment.postId] });
        },
    });
}

export function useDeleteCommentMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ commentId, postId }: { commentId: number; postId: number }) => {
            await apiClient.delete(`/api/comments/${commentId}`);
            return postId;
        },
        onSuccess: (postId) => {
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
        },
    });
}
