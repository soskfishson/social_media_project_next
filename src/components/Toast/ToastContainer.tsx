'use client';

import { createPortal } from 'react-dom';
import { type IToast } from '@/interfaces/interfaces';
import Toast from './Toast';
import './Toast.css';

interface ToastContainerProps {
    toasts: IToast[];
    onRemove: (id: string) => void;
}

const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
    if (toasts.length === 0) {
        return null;
    }
    const portalRoot = document.getElementById('portal-root') || document.body;

    return createPortal(
        <div className="toast-container">
            {toasts.map((toast) => (
                <Toast key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>,
        portalRoot,
    );
};

export default ToastContainer;
