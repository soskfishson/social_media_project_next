'use client';

import useAuth from '@/hooks/useAuth';
import CreatePostForm from './CreatePostForm';

export default function CreatePostWrapper() {
    const { isLoggedIn, user } = useAuth();

    if (!isLoggedIn || !user) return null;

    return <CreatePostForm />;
}
