'use client';

import { createContext } from 'react';
import { type ThemeContextType } from '@/interfaces/interfaces';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export default ThemeContext;
