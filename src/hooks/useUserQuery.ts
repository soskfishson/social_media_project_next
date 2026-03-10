import { useQuery } from '@tanstack/react-query';
import type { User } from '../interfaces/interfaces';

const BASE_URL = '';

async function fetchUserById(userId: number): Promise<User> {
    const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });
    if (!response.ok) {
        throw new Error('User not found');
    }
    return response.json();
}

export function useUserQuery(userId: number) {
    return useQuery({
        queryKey: ['user', userId],
        queryFn: () => {
            if (!userId) {
                throw new Error('User ID is required');
            }

            return fetchUserById(userId);
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 5,
    });
}
