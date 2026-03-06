import axios from 'axios';
import { logout } from '@/redux/AuthSlice';
import type { Store } from '@reduxjs/toolkit';

const BASE_URL = '';

export const apiClient = axios.create({ baseURL: BASE_URL });

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const setupInterceptors = (store: Store) => {
    apiClient.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                const state = store.getState();
                if (state.auth.accessToken) {
                    store.dispatch(logout());
                }
            }
            return Promise.reject(error);
        },
    );
};
