'use client';

import { useState, useCallback, type ReactNode } from 'react';
import { type IToast, ToastType } from '@/interfaces/interfaces';
import ToastContext from './ToastContext';
import ToastContainer from '@/components/Toast/ToastContainer';

interface ToastProviderProps {
    children: ReactNode;
}

const ToastProvider = ({ children }: ToastProviderProps) => {
    const [toasts, setToasts] = useState<IToast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback(
        (message: string, type: ToastType) => {
            const id = `${Date.now()}-${Math.random()}`;
            const newToast: IToast = { id, message, type };

            setToasts((prev) => [...prev, newToast]);

            setTimeout(() => {
                removeToast(id);
            }, 5000);
        },
        [removeToast],
    );

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
};

export default ToastProvider;
