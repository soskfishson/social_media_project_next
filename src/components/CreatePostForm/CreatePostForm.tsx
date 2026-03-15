'use client';

import Image from 'next/image';
import { useReducer, useState, type ChangeEvent, type SyntheticEvent } from 'react';
import Button from '../Button/Button';
import useAuth from '../../hooks/useAuth';
import './CreatePostForm.css';
import CreatePostModal from '../CreatePostModal/CreatePostModal';
import { ButtonType } from '@/interfaces/interfaces';
import { useTranslation } from 'react-i18next';

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
                    src={user!.profileImage || '/assets/default-avatar.png'}
                    alt="User Avatar"
                    className="cp-avatar"
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
