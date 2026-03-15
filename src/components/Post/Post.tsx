'use client';

import { type SyntheticEvent, useReducer, useState, useRef, memo } from 'react';
import {
    Avatar,
    Box,
    Card,
    CardActions,
    CardMedia,
    CircularProgress,
    Collapse,
    Stack,
    Typography,
    Button as MUIButton,
} from '@mui/material';
import Input from '../Input/Input';
import { InputType, ValidationState, ButtonType } from '@/interfaces/interfaces';
import { styled } from '@mui/material/styles';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { type Post as PostType, ToastType } from '@/interfaces/interfaces';
import { useAddCommentMutation, useCommentsQuery } from '@/hooks/useCommentsQuery';
import { usePostReactions } from '@/hooks/useLikeMutation';
import { useUserQuery } from '@/hooks/useUserQuery';
import useAuth from '@/hooks/useAuth';
import useToast from '@/hooks/useToast';
import useTimeAgo from '@/hooks/useTimeAgo';
import { useTranslation } from 'react-i18next';
import CommentItem from '../CommentItem/CommentItem';
import { getAssetUrl } from '@/utils/getAssetUrl';
import Button from '../Button/Button';
import PencilIcon from '@/assets/PencilIcon.svg';

const StyledCard = styled(Card)(() => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
    padding: '24px',
    backgroundColor: 'var(--bg-app)',
    border: '2px solid var(--surface-3)',
    borderRadius: 0,
    boxShadow: 'none',
    backgroundImage: 'none',
    '& + &': {
        borderTop: 'none',
    },
}));

const PostHeader = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
});

const PostCaption = styled(Typography)(({ theme }) => ({
    fontFamily: "'Inter', sans-serif",
    fontSize: '20px',
    color: 'var(--text-primary)',
    whiteSpace: 'pre-wrap',
    [theme.breakpoints.down(720)]: {
        fontSize: '14px',
    },
}));

const ActionButton = styled(MUIButton, {
    shouldForwardProp: (prop) => prop !== 'isLiked',
})<{ isLiked?: boolean }>(({ theme, isLiked }) => ({
    textTransform: 'none',
    fontFamily: "'Inter', sans-serif",
    fontSize: '1rem',
    padding: 0,
    gap: 8,
    minWidth: 'auto',
    color: isLiked ? 'var(--negative-main)' : 'var(--text-primary)',
    transition: 'color 0.2s ease, transform 0.15s ease',
    '&:hover': {
        backgroundColor: 'transparent',
        opacity: 0.8,
        transform: 'scale(1.05)',
    },
    '& svg': {
        width: '24px',
        height: '24px',
        transition: 'transform 0.2s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
    },
    [theme.breakpoints.down(720)]: {
        fontSize: '12px',
    },
}));

interface CommentFormState {
    text: string;
    isSubmitting: boolean;
}

enum FormActionType {
    SET_TEXT = 'SET_TEXT',
    SUBMIT_START = 'SUBMIT_START',
    SUBMIT_SUCCESS = 'SUBMIT_SUCCESS',
}

interface CommentFormAction {
    type: FormActionType;
    payload?: string;
}

const commentReducer = (state: CommentFormState, action: CommentFormAction): CommentFormState => {
    switch (action.type) {
        case FormActionType.SET_TEXT:
            return { ...state, text: action.payload || '' };
        case FormActionType.SUBMIT_START:
            return { ...state, isSubmitting: true };
        case FormActionType.SUBMIT_SUCCESS:
            return { ...state, isSubmitting: false, text: '' };
        default:
            return state;
    }
};

interface PostProps {
    post: PostType;
}

export const PostComponent = ({ post }: PostProps) => {
    const [formState, dispatch] = useReducer(commentReducer, { text: '', isSubmitting: false });
    const [commentsShown, setCommentsShown] = useState(false);
    const [likeAnimating, setLikeAnimating] = useState(false);
    const [commentAnimating, setCommentAnimating] = useState(false);
    const likeRef = useRef<HTMLButtonElement>(null);

    const { user, isLoggedIn } = useAuth();
    const { addToast } = useToast();
    const { t } = useTranslation();
    const timeAgo = useTimeAgo(post.creationDate);

    const { data: author, isLoading: authorLoading } = useUserQuery(post.authorId);
    const { data: comments = [], isLoading: commentsLoading } = useCommentsQuery(post.id);
    const { like, dislike } = usePostReactions();
    const addCommentMutation = useAddCommentMutation();

    const isLikedByMe = post.likedByUsers?.some((u) => u.id === user?.id) ?? false;

    const handleToggleLike = () => {
        if (!isLoggedIn) {
            addToast(t('posts.loginToLike'), ToastType.ERROR);
            return;
        }

        setLikeAnimating(true);
        setTimeout(() => setLikeAnimating(false), 450);

        if (isLikedByMe) {
            dislike.mutate(post.id, {
                onError: () => addToast(t('posts.failedDislike'), ToastType.ERROR),
            });
        } else {
            like.mutate(post.id, {
                onError: () => addToast(t('posts.failedLike'), ToastType.ERROR),
            });
        }
    };

    const handleToggleComments = () => {
        if (!commentsShown) {
            setCommentAnimating(true);
            setTimeout(() => setCommentAnimating(false), 350);
        }
        setCommentsShown(!commentsShown);
    };

    const handleCommentSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (!formState.text.trim()) {
            return;
        }

        dispatch({ type: FormActionType.SUBMIT_START });
        addCommentMutation.mutate(
            { postId: post.id, text: formState.text },
            {
                onSuccess: () => {
                    dispatch({ type: FormActionType.SUBMIT_SUCCESS });
                    addToast(t('posts.commentPublished'), ToastType.SUCCESS);
                },
                onError: () => {
                    dispatch({ type: FormActionType.SUBMIT_SUCCESS });
                    addToast(t('posts.failedComment'), ToastType.ERROR);
                },
            },
        );
    };

    const authorName = author?.firstName || `User ${post.authorId}`;
    const likeLabel = isLikedByMe ? t('a11y.unlikePost') : t('a11y.likePost');

    return (
        <StyledCard>
            <PostHeader>
                {authorLoading ? (
                    <CircularProgress size={48} />
                ) : (
                    <Avatar
                        src={getAssetUrl(author?.profileImage || '/assets/default-avatar.png')}
                        sx={{ width: 48, height: 48 }}
                        alt={t('a11y.userAvatar', { name: authorName })}
                    />
                )}
                <Stack>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 500 }} component="h3">
                        {authorName}
                    </Typography>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        component="time"
                        dateTime={post.creationDate}
                    >
                        {timeAgo}
                    </Typography>
                </Stack>
            </PostHeader>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {post.image && (
                    <CardMedia
                        component="img"
                        image={getAssetUrl(post.image)}
                        alt={t('a11y.postImage')}
                        sx={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                    />
                )}
                <PostCaption>
                    {post.title}
                    {post.image ? `\n${post.content}` : `. ${post.content}`}
                </PostCaption>
            </Box>

            <CardActions sx={{ padding: 0, gap: '16px' }} role="group">
                <ActionButton
                    ref={likeRef}
                    onClick={handleToggleLike}
                    isLiked={isLikedByMe}
                    disabled={like.isPending || dislike.isPending}
                    data-testid="like-button"
                    aria-label={likeLabel}
                    aria-pressed={isLikedByMe}
                    className={likeAnimating ? (isLikedByMe ? 'like-btn-liked' : '') : ''}
                    sx={{
                        '& svg': likeAnimating
                            ? {
                                  animation: isLikedByMe
                                      ? 'none'
                                      : 'heartPop 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
                              }
                            : {},
                    }}
                >
                    {isLikedByMe ? (
                        <FavoriteIcon
                            sx={{
                                color: 'var(--negative-main)',
                                animation: likeAnimating
                                    ? 'heartPop 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97)'
                                    : 'none',
                            }}
                        />
                    ) : (
                        <FavoriteBorderIcon />
                    )}
                    <span>{t('posts.likes', { count: post.likesCount })}</span>
                </ActionButton>

                <ActionButton
                    onClick={handleToggleComments}
                    disabled={!isLoggedIn}
                    data-testid="comment-toggle"
                    aria-label={t('a11y.toggleComments')}
                    className={commentAnimating ? 'comment-btn-active' : ''}
                >
                    <CommentIcon />
                    <span>
                        {isLoggedIn
                            ? t('posts.comments', { count: comments.length })
                            : t('posts.loginToView')}
                    </span>
                </ActionButton>

                {isLoggedIn && (
                    <ActionButton
                        onClick={handleToggleComments}
                        aria-label={commentsShown ? 'Collapse comments' : 'Expand comments'}
                    >
                        {commentsShown ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                    </ActionButton>
                )}
            </CardActions>

            <Collapse in={commentsShown && isLoggedIn} id={`comments-${post.id}`}>
                <Box
                    sx={{ mt: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}
                    role="region"
                    aria-label="Comments"
                >
                    {commentsLoading ? (
                        <CircularProgress size={20} />
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                {Array.isArray(comments) &&
                                    comments.map((comment) => (
                                        <CommentItem key={comment.id} comment={comment} />
                                    ))}
                            </Box>
                            <Box
                                component="form"
                                onSubmit={handleCommentSubmit}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                    mt: '16px',
                                }}
                                aria-label="Add a comment"
                            >
                                <Input
                                    label="Add a comment"
                                    icon={<PencilIcon />}
                                    type={InputType.TEXTAREA}
                                    placeholder={t('posts.writeComment')}
                                    value={formState.text}
                                    onChange={(val) =>
                                        dispatch({
                                            type: FormActionType.SET_TEXT,
                                            payload: val,
                                        })
                                    }
                                    disabled={formState.isSubmitting}
                                    maxLength={1000}
                                    validationState={ValidationState.IDLE}
                                />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        width: '30%',
                                    }}
                                >
                                    <Button
                                        type={ButtonType.SUBMIT}
                                        disabled={formState.isSubmitting || !formState.text.trim()}
                                        data-testid="comment-submit"
                                    >
                                        {formState.isSubmitting
                                            ? `${t('posts.postComment')}...`
                                            : t('posts.postComment')}
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Collapse>
        </StyledCard>
    );
};

const Post = memo(PostComponent);
export default Post;
