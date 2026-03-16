'use client';

import { Box, Typography, Skeleton, Stack } from '@mui/material';
import type { Comment } from '@/interfaces/interfaces';
import { useUserQuery } from '@/hooks/useUserQuery';
import useAuth from '@/hooks/useAuth';
import { useDeleteCommentMutation } from '@/hooks/useCommentsQuery';
import DeleteIcon from '@/assets/DeleteIcon.svg';
import './CommentItem.css';

interface CommentItemProps {
    comment: Comment;
}

export const CommentItem = ({ comment }: CommentItemProps) => {
    const { data: author, isLoading } = useUserQuery(comment.authorId);
    const { user } = useAuth();
    const deleteMutation = useDeleteCommentMutation();
    const isOwnComment = user?.id === comment.authorId;

    const handleDelete = () => {
        deleteMutation.mutate({ commentId: comment.id, postId: comment.postId }, {});
    };

    return (
        <Box className="comment-item">
            {isLoading ? (
                <Stack spacing={1}>
                    <Skeleton variant="text" width="30%" />
                    <Skeleton variant="text" width="100%" />
                </Stack>
            ) : (
                <>
                    <Typography
                        variant="body2"
                        sx={{ fontSize: '0.9rem' }}
                        data-testid="comment-text"
                    >
                        <strong>{author?.username || `User ${comment.authorId}`}:</strong>{' '}
                        {comment.text}
                    </Typography>
                    {isOwnComment && (
                        <button
                            className="comment-delete-btn"
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                            data-testid="comment-delete-btn"
                        >
                            <DeleteIcon />
                        </button>
                    )}
                </>
            )}
        </Box>
    );
};

export default CommentItem;
