'use client';

import { createContext } from 'react';
import { type AuthContextType } from '@/interfaces/interfaces';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
