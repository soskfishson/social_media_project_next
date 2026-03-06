import { createSlice, createAsyncThunk, type PayloadAction, isAnyOf } from '@reduxjs/toolkit';
import { apiClient } from '@/api/api';
import type { User, LoginPayload, RegisterPayload } from '@/interfaces/interfaces';
import { AxiosError } from 'axios';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isLoading: boolean;
    error: string | null;
    sessionExpired: boolean;
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    isLoading: false,
    error: null,
    sessionExpired: false,
};

interface AuthResponse {
    token: string;
    user: User;
}

export const loginThunk = createAsyncThunk<AuthResponse, LoginPayload, { rejectValue: string }>(
    'auth/login',
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.post<AuthResponse>('/api/login', payload);
            return data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    },
);

export const registerThunk = createAsyncThunk<
    AuthResponse,
    RegisterPayload,
    { rejectValue: string }
>('auth/register', async (payload, { rejectWithValue }) => {
    try {
        await apiClient.post('/api/signup', payload);
        const { data } = await apiClient.post<AuthResponse>('/api/login', {
            email: payload.email,
            password: payload.password,
        });

        return data;
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
});

export const getMeThunk = createAsyncThunk<User, void, { rejectValue: string }>(
    'auth/getMe',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.get<User>('/api/me');
            return data;
        } catch {
            return rejectWithValue('Session expired');
        }
    },
);

export const updateProfileThunk = createAsyncThunk<
    User,
    { description?: string; file: File | null; username: string; email: string },
    { rejectValue: string }
>('auth/updateProfile', async ({ description, file, username, email }, { rejectWithValue }) => {
    try {
        let profileImage = '';

        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            const response = await fetch('/api/upload-image', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const uploadData = (await response.json()) as { url: string };
            profileImage = uploadData.url;
        }

        const response = await fetch('/api/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({
                description,
                username,
                email,
                ...(profileImage && { profileImage }),
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to update profile');
        }

        return response.json() as Promise<User>;
    } catch (error) {
        return rejectWithValue(
            error instanceof Error ? error.message : 'An unexpected error occurred',
        );
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.accessToken = null;
            state.error = null;
            state.sessionExpired = false;
            localStorage.removeItem('accessToken');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMeThunk.fulfilled, (state, action: PayloadAction<User>) => {
                state.user = action.payload;
                state.isLoading = false;
            })
            .addCase(getMeThunk.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.isLoading = false;
                state.error = action.payload || 'Session expired';
                state.user = null;
                state.accessToken = null;
                state.sessionExpired = true;
                localStorage.removeItem('accessToken');
            })
            .addCase(updateProfileThunk.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateProfileThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(updateProfileThunk.rejected, (state) => {
                state.isLoading = false;
            })
            .addMatcher(
                isAnyOf(loginThunk.fulfilled, registerThunk.fulfilled),
                (state, action: PayloadAction<AuthResponse>) => {
                    state.isLoading = false;
                    state.accessToken = action.payload.token;
                    state.user = action.payload.user;
                    state.sessionExpired = false;
                    localStorage.setItem('accessToken', action.payload.token);
                },
            )
            .addMatcher(
                isAnyOf(loginThunk.pending, registerThunk.pending, getMeThunk.pending),
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                },
            )
            .addMatcher(
                isAnyOf(loginThunk.rejected, registerThunk.rejected),
                (state, action: PayloadAction<string | undefined>) => {
                    state.isLoading = false;
                    state.error = action.payload || 'An error occurred';
                },
            );
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
