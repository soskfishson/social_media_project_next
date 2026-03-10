import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Post } from '@/interfaces/interfaces';
import { fetchPostsGraphQL } from '@/api/graphql';

const BASE_URL = '';

export function usePostsQuery() {
    return useQuery({
        queryKey: ['posts'],
        queryFn: fetchPostsGraphQL,
    });
}

export function useCreatePostMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            title,
            content,
            imageUrl,
        }: {
            title: string;
            content: string;
            imageUrl?: string;
        }) => {
            const response = await fetch(`${BASE_URL}/api/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify({
                    title,
                    content,
                    image: imageUrl,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            return response.json() as Promise<Post>;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
}

export async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${BASE_URL}/api/upload-image`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to upload image');
    }

    const data = (await response.json()) as { url: string };
    return data.url;
}
