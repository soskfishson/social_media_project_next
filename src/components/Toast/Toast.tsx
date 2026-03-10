'use client';

import { ButtonType, type IToast, ToastType } from '@/interfaces/interfaces';
import { useTranslation } from 'react-i18next';
import Button from '../Button/Button';
import './Toast.css';

interface ToastProps {
    toast: IToast;
    onRemove: (id: string) => void;
}

const Toast = ({ toast, onRemove }: ToastProps) => {
    const { t } = useTranslation();

    const getToastClass = () => {
        switch (toast.type) {
            case ToastType.SUCCESS:
                return 'toast-success';
            case ToastType.ERROR:
                return 'toast-error';
            case ToastType.WARNING:
                return 'toast-warning';
            default:
                return '';
        }
    };

    const getRole = () => {
        return toast.type === ToastType.ERROR ? 'alert' : 'status';
    };

    return (
        <div
            className={`toast ${getToastClass()}`}
            data-testid="toast-item"
            role={getRole()}
            aria-atomic="true"
        >
            <span className="toast-message">{toast.message}</span>
            <Button
                type={ButtonType.CLOSE}
                className="toast-close"
                onClick={() => onRemove(toast.id)}
                aria-label={t('a11y.removeToast')}
            >
                ✕
            </Button>
        </div>
    );
};

export default Toast;
