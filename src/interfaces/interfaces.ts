import { type ReactNode } from 'react';

export interface User {
    id: number;
    username: string;
    email?: string;
    firstName?: string;
    secondName?: string;
    profileImage?: string;
    description?: string;
    bio?: string;
    likesCount?: number;
    lastLogin?: string;
    creationDate?: string;
    modifiedDate?: string;
}

export interface SuggestedUser {
    id: number;
    username: string;
    firstName?: string;
    secondName?: string;
    photo?: string;
    description?: string;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    image?: string;
    authorId: number;
    likesCount: number;
    likedByUsers: User[];
    commentsCount: number;
    creationDate: string;
    modifiedDate: string;
    authorPhoto: string;
}

export interface Group {
    id: number;
    title: string;
    photo: string;
    membersCount: number;
}

export interface Comment {
    id: number;
    text: string;
    authorId: number;
    postId: number;
    creationDate: string;
    modifiedDate: string;
}

export interface Like {
    id: number;
    postId: number;
    userId: number;
    creationDate: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
    firstName?: string;
    secondName?: string;
}

export enum InputType {
    TEXT = 'TEXT',
    EMAIL = 'EMAIL',
    PASSWORD = 'PASSWORD',
    TEXTAREA = 'TEXTAREA',
    FILE = 'FILE',
}

export enum ValidationState {
    IDLE = 'IDLE',
    VALID = 'VALID',
    INVALID = 'INVALID',
}

export enum ToastType {
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
    WARNING = 'WARNING',
}

export enum ThemeTypes {
    DARK = 'DARK',
    LIGHT = 'LIGHT',
}

export enum ButtonType {
    BUTTON = 'button',
    SUBMIT = 'submit',
    CLOSE = 'close',
}

export interface AuthContextType {
    accessToken: string | null;
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (data: LoginPayload) => Promise<void>;
    register: (data: RegisterPayload) => Promise<void>;
    logout: () => void;
}

export interface ToastContextType {
    toasts: IToast[];
    addToast: (message: string, type: ToastType) => void;
    removeToast: (id: string) => void;
}

export interface IToast {
    id: string;
    type: ToastType;
    message: string;
}

export interface ThemeContextType {
    theme: ThemeTypes;
    toggleTheme: () => void;
    setTheme: (theme: ThemeTypes) => void;
}

export enum ErrorType {
    GENERIC = 'GENERIC',
    NOT_FOUND = 'NOT_FOUND',
}

export interface InputProps {
    type: InputType;
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    validationState?: ValidationState;
    errorMessage?: string;
    successMessage?: string;
    icon?: ReactNode;
    maxLength?: number;
    showMaxLength?: boolean;
    disabled?: boolean;
    backgroundColor?: string;
    showPasswordToggle?: boolean;
    accept?: string;
    onFileChange?: (value: File) => void;
    'data-testid'?: string;
}
