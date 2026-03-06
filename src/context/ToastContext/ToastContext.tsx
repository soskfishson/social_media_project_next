'use client';

import { createContext } from 'react';
import { type ToastContextType } from '@/interfaces/interfaces';

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export default ToastContext;
