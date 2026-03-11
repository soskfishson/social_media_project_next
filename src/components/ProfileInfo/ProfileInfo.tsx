'use client';

import { type SyntheticEvent, useReducer, useMemo } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { updateProfileThunk } from '@/redux/AuthSlice';
import { z } from 'zod';
import useAuth from '@/hooks/useAuth';
import useTheme from '@/hooks/useTheme';
import useToast from '@/hooks/useToast';
import {
    ButtonType,
    InputType,
    ThemeTypes,
    ToastType,
    ValidationState,
} from '@/interfaces/interfaces';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import { useTranslation } from 'react-i18next';
import UserIcon from '@/assets/User.svg';
import EmailIcon from '@/assets/Email.svg';
import PencilIcon from '@/assets/PencilIcon.svg';
import './ProfileInfo.css';

interface ProfileFormState {
    username: string;
    email: string;
    description: string;
    profilePhoto: File | null;
    errors: Record<string, string>;
    isSubmitting: boolean;
}

enum FormActionType {
    SET_FIELD = 'SET_FIELD',
    SET_PHOTO = 'SET_PHOTO',
    SET_ERRORS = 'SET_ERRORS',
    SUBMIT_START = 'SUBMIT_START',
    SUBMIT_SUCCESS = 'SUBMIT_SUCCESS',
}

interface FormAction {
    type: FormActionType;
    field?: string;
    payload?: unknown;
}

const isErrorRecord = (value: unknown): value is Record<string, string> => {
    return (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        Object.values(value).every((v) => typeof v === 'string')
    );
};

const reducer = (state: ProfileFormState, action: FormAction): ProfileFormState => {
    switch (action.type) {
        case FormActionType.SET_FIELD:
            if (typeof action.payload === 'string' && action.field) {
                return {
                    ...state,
                    [action.field]: action.payload,
                    errors: { ...state.errors, [action.field]: '' },
                };
            }
            return state;

        case FormActionType.SET_PHOTO:
            if (!(action.payload === null || action.payload instanceof File)) {
                return state;
            }
            return { ...state, profilePhoto: action.payload };

        case FormActionType.SET_ERRORS:
            if (!isErrorRecord(action.payload)) {
                return state;
            }
            return { ...state, errors: action.payload, isSubmitting: false };

        case FormActionType.SUBMIT_START:
            return { ...state, isSubmitting: true, errors: {} };

        case FormActionType.SUBMIT_SUCCESS:
            return { ...state, isSubmitting: false };

        default:
            return state;
    }
};

const ProfileInfo = () => {
    const appDispatch = useAppDispatch();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { addToast } = useToast();
    const { t } = useTranslation();

    const profileSchema = useMemo(
        () =>
            z.object({
                username: z.string().min(3, t('profile.usernameMin')),
                email: z.string().email(t('profile.emailInvalid')),
                description: z.string().max(200, t('profile.bioMax')).optional(),
            }),
        [t],
    );

    const initialState: ProfileFormState = {
        username: user?.username || '',
        email: user?.email || '',
        description: user?.description || user?.bio || '',
        profilePhoto: null,
        errors: {},
        isSubmitting: false,
    };

    const [formState, dispatch] = useReducer(reducer, initialState);

    const getFieldState = (field: keyof typeof formState.errors, value: string) => {
        if (formState.errors[field]) return ValidationState.INVALID;
        if (value.trim().length > 0) return ValidationState.VALID;
        return ValidationState.IDLE;
    };

    const handlePhotoClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e: Event) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                dispatch({ type: FormActionType.SET_PHOTO, payload: file });
            }
        };
        input.click();
    };

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();

        const result = profileSchema.safeParse({
            username: formState.username,
            email: formState.email,
            description: formState.description,
        });

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                const path = issue.path[0] as string;
                fieldErrors[path] = issue.message;
            });
            dispatch({ type: FormActionType.SET_ERRORS, payload: fieldErrors });
            addToast(t('profile.correctErrors'), ToastType.ERROR);
            return;
        }

        dispatch({ type: FormActionType.SUBMIT_START });

        try {
            await appDispatch(
                updateProfileThunk({
                    username: formState.username,
                    email: formState.email,
                    description: formState.description,
                    file: formState.profilePhoto,
                }),
            ).unwrap();

            dispatch({ type: FormActionType.SUBMIT_SUCCESS });
            addToast(t('profile.profileUpdated'), ToastType.SUCCESS);
        } catch (error) {
            addToast((error as string) || t('profile.failedUpdate'), ToastType.ERROR);
            dispatch({ type: FormActionType.SUBMIT_SUCCESS });
        }
    };

    const photoPreview = formState.profilePhoto
        ? URL.createObjectURL(formState.profilePhoto)
        : user?.profileImage || '/assets/default-avatar.png';

    const isDarkTheme = theme === ThemeTypes.DARK;

    return (
        <div className="profile-info-container">
            <div className="profile-edit-section">
                <h2 className="section-title">{t('profile.editProfile')}</h2>

                <div className="profile-photo-section">
                    <img src={photoPreview} alt="avatar" className="profile-photo" />
                    <div className="profile-photo-info">
                        <h3 className="profile-name">{user?.username}</h3>
                        <Button
                            type={ButtonType.BUTTON}
                            onClick={handlePhotoClick}
                            className="change-photo-btn"
                        >
                            {t('profile.changePhoto')}
                        </Button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="profile-form">
                    <Input
                        type={InputType.TEXT}
                        label={t('profile.username')}
                        placeholder={t('profile.usernamePlaceholder')}
                        value={formState.username}
                        onChange={(val) =>
                            dispatch({
                                type: FormActionType.SET_FIELD,
                                field: 'username',
                                payload: val,
                            })
                        }
                        icon={<UserIcon />}
                        errorMessage={formState.errors.username}
                        validationState={getFieldState('username', formState.username)}
                        disabled={formState.isSubmitting}
                    />

                    <Input
                        type={InputType.EMAIL}
                        label={t('auth.email')}
                        placeholder={t('auth.emailPlaceholder')}
                        value={formState.email}
                        onChange={(val) =>
                            dispatch({
                                type: FormActionType.SET_FIELD,
                                field: 'email',
                                payload: val,
                            })
                        }
                        icon={<EmailIcon />}
                        errorMessage={formState.errors.email}
                        validationState={getFieldState('email', formState.email)}
                        disabled={formState.isSubmitting}
                    />

                    <div className="textarea-wrapper">
                        <Input
                            type={InputType.TEXTAREA}
                            label={t('posts.description')}
                            placeholder={t('posts.descriptionPlaceholder')}
                            value={formState.description}
                            onChange={(val) =>
                                dispatch({
                                    type: FormActionType.SET_FIELD,
                                    field: 'description',
                                    payload: val,
                                })
                            }
                            icon={<PencilIcon />}
                            maxLength={200}
                            errorMessage={formState.errors.description}
                            validationState={getFieldState('description', formState.description)}
                            disabled={formState.isSubmitting}
                        />
                    </div>

                    <div className="save-button-container">
                        <Button
                            label={
                                formState.isSubmitting
                                    ? t('profile.saving')
                                    : t('profile.saveChanges')
                            }
                            disabled={formState.isSubmitting}
                            type={ButtonType.SUBMIT}
                        />
                    </div>
                </form>
            </div>

            <div className="profile-preferences-section">
                <h2 className="section-title">{t('profile.preferences')}</h2>
                <div className="preference-item">
                    <label className="theme-toggle-container">
                        <input
                            type="checkbox"
                            checked={isDarkTheme}
                            onChange={toggleTheme}
                            className="theme-toggle-checkbox"
                            data-testid="theme-checkbox"
                            role="switch"
                            aria-checked={isDarkTheme}
                        />
                        <span className={`theme-toggle-switch ${isDarkTheme ? 'active' : ''}`}>
                            <span className="theme-toggle-slider"></span>
                        </span>
                        <span className="theme-toggle-label">{t('profile.darkTheme')}</span>
                    </label>
                </div>

                <h2 className="section-title actions-title">{t('profile.actions')}</h2>
                <div className="logout-button-container">
                    <Button
                        label={t('profile.logout')}
                        onClick={logout}
                        data-testid="logout-button"
                    />
                </div>
            </div>
        </div>
    );
};

export default ProfileInfo;
