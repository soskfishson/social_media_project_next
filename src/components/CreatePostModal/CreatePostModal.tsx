'use client';

import { type SyntheticEvent, useReducer } from 'react';
import Input from '../Input/Input';
import { ButtonType, InputType, ToastType } from '@/interfaces/interfaces';
import { useCreatePostMutation, uploadImage } from '@/hooks/usePostsQuery';
import useToast from '@/hooks/useToast';
import Button from '../Button/Button';
import { useTranslation } from 'react-i18next';
import EmailIcon from '@/assets/Email.svg';
import PencilIcon from '@/assets/PencilIcon.svg';
import './CreatePostModal.css';

interface CreatePostFormState {
    title: string;
    description: string;
    attachment: File | null;
    isSubmitting: boolean;
}

enum FormActionType {
    SET_TITLE = 'SET_TITLE',
    SET_DESCRIPTION = 'SET_DESCRIPTION',
    SET_ATTACHMENT = 'SET_ATTACHMENT',
    SUBMIT_START = 'SUBMIT_START',
    SUBMIT_SUCCESS = 'SUBMIT_SUCCESS',
    RESET = 'RESET',
}

interface FormAction {
    type: FormActionType;
    payload?: string | File | null;
}

const initialState: CreatePostFormState = {
    title: '',
    description: '',
    attachment: null,
    isSubmitting: false,
};

const reducer = (state: CreatePostFormState, action: FormAction): CreatePostFormState => {
    switch (action.type) {
        case FormActionType.SET_TITLE:
            return { ...state, title: action.payload as string };
        case FormActionType.SET_DESCRIPTION:
            return { ...state, description: action.payload as string };
        case FormActionType.SET_ATTACHMENT:
            return { ...state, attachment: action.payload as File };
        case FormActionType.SUBMIT_START:
            return { ...state, isSubmitting: true };
        case FormActionType.SUBMIT_SUCCESS:
            return { ...state, isSubmitting: false };
        case FormActionType.RESET:
            return initialState;
        default:
            return state;
    }
};

interface CreatePostModalProps {
    title?: string;
    isOpen: boolean;
    onClose: () => void;
}

const CreatePostModal = ({ title: initialTitle, isOpen, onClose }: CreatePostModalProps) => {
    const [formState, dispatch] = useReducer(reducer, {
        ...initialState,
        title: initialTitle || '',
    });
    const { addToast } = useToast();
    const createPostMutation = useCreatePostMutation();
    const { t } = useTranslation();

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();

        if (!formState.title.trim() || !formState.description.trim()) {
            addToast(t('posts.fillRequired'), ToastType.ERROR);
            return;
        }

        dispatch({ type: FormActionType.SUBMIT_START });

        try {
            let imageUrl = '';
            if (formState.attachment) {
                imageUrl = await uploadImage(formState.attachment);
            }

            await createPostMutation.mutateAsync({
                title: formState.title,
                content: formState.description,
                imageUrl,
            });

            dispatch({ type: FormActionType.RESET });
            addToast(t('posts.postCreated'), ToastType.SUCCESS);
            onClose();
        } catch (error) {
            addToast(
                error instanceof Error ? error.message : t('posts.failedCreate'),
                ToastType.ERROR,
            );
        } finally {
            dispatch({ type: FormActionType.SUBMIT_SUCCESS });
        }
    };

    const handleClose = () => {
        dispatch({ type: FormActionType.RESET });
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-container modal-overlay-enter" onClick={onClose}>
            <dialog
                open={isOpen}
                className="create-post-modal modal-content-enter"
                onClick={(e) => e.stopPropagation()}
                aria-labelledby="modal-title"
                aria-modal="true"
            >
                <header className="modal-header">
                    <h2 id="modal-title">{t('posts.createPost')}</h2>
                    <Button
                        type={ButtonType.CLOSE}
                        onClick={handleClose}
                        className="close-button"
                        aria-label={t('a11y.closeModal')}
                    >
                        ×
                    </Button>
                </header>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="input-sizer">
                        <Input
                            type={InputType.TEXT}
                            icon={<EmailIcon />}
                            label={t('posts.postTitle')}
                            placeholder={t('posts.postTitlePlaceholder')}
                            value={formState.title}
                            onChange={(value) =>
                                dispatch({ type: FormActionType.SET_TITLE, payload: value })
                            }
                            disabled={formState.isSubmitting}
                        />
                    </div>

                    <div className="textarea-container">
                        <Input
                            type={InputType.TEXTAREA}
                            icon={<PencilIcon />}
                            label={t('posts.description')}
                            placeholder={t('posts.descriptionPlaceholder')}
                            value={formState.description}
                            onChange={(value) =>
                                dispatch({
                                    type: FormActionType.SET_DESCRIPTION,
                                    payload: value,
                                })
                            }
                            disabled={formState.isSubmitting}
                        />
                    </div>

                    <Input
                        type={InputType.FILE}
                        label=""
                        placeholder={t('posts.selectFile')}
                        value=""
                        backgroundColor="var(--bg-app)"
                        onChange={() => {}}
                        onFileChange={(file) =>
                            dispatch({
                                type: FormActionType.SET_ATTACHMENT,
                                payload: file,
                            })
                        }
                        accept=".jpg,.jpeg,.png,.pdf"
                        disabled={formState.isSubmitting}
                    />

                    <div className="button-wrapper">
                        <Button
                            label={formState.isSubmitting ? t('posts.creating') : t('posts.create')}
                            disabled={formState.isSubmitting}
                        />
                    </div>
                </form>
            </dialog>
        </div>
    );
};

export default CreatePostModal;
