'use client';

import Image from 'next/image';
import { useReducer, useState, type ChangeEvent, type SyntheticEvent } from 'react';
import Button from '../Button/Button';
import useAuth from '../../hooks/useAuth';
import './CreatePostForm.css';
import CreatePostModal from '../CreatePostModal/CreatePostModal';
import { ButtonType } from '@/interfaces/interfaces';
import { useTranslation } from 'react-i18next';
import { getAssetUrl } from '@/utils/getAssetUrl';

interface CreatePostFormState {
    text: string;
    isSubmitting: boolean;
}

enum FormActionType {
    SET_TEXT = 'SET_TEXT',
    SUBMIT_START = 'SUBMIT_START',
    SUBMIT_SUCCESS = 'SUBMIT_SUCCESS',
}

interface CreatePostFormAction {
    type: FormActionType;
    payload?: string;
}

const initialState: CreatePostFormState = {
    text: '',
    isSubmitting: false,
};

const reducer = (state: CreatePostFormState, action: CreatePostFormAction): CreatePostFormState => {
    switch (action.type) {
        case FormActionType.SET_TEXT:
            if (!action.payload) {
                console.log('Text payload is empty');
                return { ...state, text: '' };
            }
            return { ...state, text: action.payload };
        case FormActionType.SUBMIT_START:
            return { ...state, isSubmitting: true };
        case FormActionType.SUBMIT_SUCCESS:
            return { ...state, isSubmitting: false, text: '' };
        default:
            return state;
    }
};

const CreatePostForm = () => {
    const [formState, dispatch] = useReducer(reducer, initialState);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const { user } = useAuth();
    const { t } = useTranslation();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: FormActionType.SET_TEXT, payload: e.target.value });
    };

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();

        dispatch({ type: FormActionType.SUBMIT_START });

        setModalTitle(formState.text);
        setIsModalOpen(true);

        dispatch({ type: FormActionType.SUBMIT_SUCCESS });
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalTitle('');
    };

    const { text, isSubmitting } = formState;

    return (
        <>
            <form className="create-post-form" onSubmit={handleSubmit}>
                <Image
                    width={64}
                    height={64}
                    loading="lazy"
                    fetchPriority="auto"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,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"
                    src={getAssetUrl(user!.profileImage || '/assets/default-avatar.png')}
                    alt="User Avatar"
                    className="cp-avatar"
                    unoptimized
                />

                <div className="cp-input-container">
                    <input
                        type="text"
                        className="cp-input"
                        placeholder={t('posts.whatsHappening')}
                        value={text}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                    />
                </div>

                <div className="cp-button-wrapper">
                    <Button
                        label={isSubmitting ? t('posts.posting') : t('posts.tellEveryone')}
                        type={ButtonType.SUBMIT}
                        disabled={isSubmitting}
                    />
                </div>
            </form>

            {isModalOpen && (
                <CreatePostModal
                    title={modalTitle}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default CreatePostForm;
