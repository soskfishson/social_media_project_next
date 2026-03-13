'use client';

import { Box, Typography, Skeleton, Stack } from '@mui/material';
import type { Comment } from '@/interfaces/interfaces';
import { useUserQuery } from '@/hooks/useUserQuery';

interface CommentItemProps {
    comment: Comment;
}

export const CommentItem = ({ comment }: CommentItemProps) => {
    const { data: author, isLoading } = useUserQuery(comment.authorId);

    return (
        <Box sx={{ padding: '8px 0', mt: '0 !important' }}>
            {isLoading ? (
                <Stack spacing={1}>
                    <Skeleton variant="text" width="30%" />
                    <Skeleton variant="text" width="100%" />
                </Stack>
            ) : (
                <Typography variant="body2" sx={{ fontSize: '0.9rem' }} data-testid="comment-text">
                    <strong>{author?.username || `User ${comment.authorId}`}:</strong>{' '}
                    {comment.text}
                </Typography>
            )}
        </Box>
    );
};

export default CommentItem;
