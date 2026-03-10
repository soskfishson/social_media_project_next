'use client';

import { type ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    type AuthContextType,
    type LoginPayload,
    type RegisterPayload,
    ToastType,
} from '@/interfaces/interfaces';
import AuthContext from './AuthContext';
import useToast from '../../hooks/useToast';
import {
    loginThunk,
    registerThunk,
    logout as logoutAction,
    getMeThunk,
} from '../../redux/AuthSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Loader from '../../components/Loader/Loader';

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    const dispatch = useAppDispatch();
    const { addToast } = useToast();
    const { t } = useTranslation();

    const { user, accessToken, isLoading, sessionExpired } = useAppSelector((state) => state.auth);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            dispatch(getMeThunk());
        }
    }, [dispatch]);

    useEffect(() => {
        if (sessionExpired) {
            addToast(t('toast.sessionExpired'), ToastType.WARNING);
        }
    }, [sessionExpired, addToast, t]);

    const login = async (payload: LoginPayload) => {
        const resultAction = await dispatch(loginThunk(payload));
        if (loginThunk.fulfilled.match(resultAction)) {
            addToast(t('toast.welcomeBack'), ToastType.SUCCESS);
        } else {
            throw new Error(resultAction.payload as string);
        }
    };

    const register = async (payload: RegisterPayload) => {
        const resultAction = await dispatch(registerThunk(payload));
        if (registerThunk.fulfilled.match(resultAction)) {
            addToast(t('toast.accountCreated'), ToastType.SUCCESS);
        } else {
            throw new Error(resultAction.payload as string);
        }
    };

    const logout = async () => {
        dispatch(logoutAction());
        addToast(t('toast.loggedOut'), ToastType.WARNING);
    };

    const value: AuthContextType = {
        user,
        accessToken,
        isLoggedIn: !!accessToken,
        isLoading,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {isLoading && <Loader fullPage message={t('common.loading')} />}
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
