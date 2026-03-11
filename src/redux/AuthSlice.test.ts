import authReducer, {
    logout,
    setToken,
    loginThunk,
    registerThunk,
    getMeThunk,
    updateProfileThunk,
} from './AuthSlice';
import type { User } from '../interfaces/interfaces';

const mockUser: User = { id: 1, username: 'testuser', email: 'test@test.com' };
const mockToken = 'mock-access-token';

const loggedInState = {
    user: mockUser,
    accessToken: mockToken,
    isLoading: false,
    error: null,
    sessionExpired: false,
};

const initialState = {
    user: null,
    accessToken: null,
    isLoading: false,
    error: null,
    sessionExpired: false,
};

describe('AuthSlice — logout', () => {
    it('clears user, accessToken, and sessionExpired on logout', () => {
        const state = authReducer(loggedInState, logout());
        expect(state.user).toBeNull();
        expect(state.accessToken).toBeNull();
        expect(state.sessionExpired).toBe(false);
        expect(state.error).toBeNull();
    });

    it('removes only accessToken from localStorage on logout (not user)', () => {
        localStorage.setItem('accessToken', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        authReducer(loggedInState, logout());
        expect(localStorage.getItem('accessToken')).toBeNull();
        expect(localStorage.getItem('user')).not.toBeNull();
    });

    it('is idempotent when already logged out', () => {
        const state = authReducer(initialState, logout());
        expect(state.user).toBeNull();
        expect(state.accessToken).toBeNull();
    });
});

describe('AuthSlice — setToken', () => {
    it('sets the accessToken', () => {
        const state = authReducer(initialState, setToken('new-token'));
        expect(state.accessToken).toBe('new-token');
    });

    it('clears accessToken when null is passed', () => {
        const state = authReducer(loggedInState, setToken(null));
        expect(state.accessToken).toBeNull();
    });
});

describe('AuthSlice — loginThunk', () => {
    it('sets isLoading true on pending', () => {
        const state = authReducer(initialState, { type: loginThunk.pending.type });
        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
    });

    it('stores token and user on fulfilled', () => {
        const payload = { token: mockToken, user: mockUser };
        const state = authReducer(initialState, { type: loginThunk.fulfilled.type, payload });
        expect(state.isLoading).toBe(false);
        expect(state.accessToken).toBe(mockToken);
        expect(state.user).toEqual(mockUser);
        expect(state.sessionExpired).toBe(false);
    });

    it('persists only accessToken to localStorage on fulfilled (not user)', () => {
        const payload = { token: mockToken, user: mockUser };
        authReducer(initialState, { type: loginThunk.fulfilled.type, payload });
        expect(localStorage.getItem('accessToken')).toBe(mockToken);
        expect(localStorage.getItem('user')).toBeNull();
    });

    it('sets error on rejected', () => {
        const state = authReducer(initialState, {
            type: loginThunk.rejected.type,
            payload: 'Invalid credentials',
        });
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe('Invalid credentials');
    });

    it('falls back to default error message on rejected without payload', () => {
        const state = authReducer(initialState, {
            type: loginThunk.rejected.type,
            payload: undefined,
        });
        expect(state.error).toBe('An error occurred');
    });
});

describe('AuthSlice — registerThunk', () => {
    it('sets isLoading true on pending', () => {
        const state = authReducer(initialState, { type: registerThunk.pending.type });
        expect(state.isLoading).toBe(true);
    });

    it('stores token and user on fulfilled', () => {
        const payload = { token: mockToken, user: mockUser };
        const state = authReducer(initialState, { type: registerThunk.fulfilled.type, payload });
        expect(state.accessToken).toBe(mockToken);
        expect(state.user).toEqual(mockUser);
    });

    it('sets error on rejected', () => {
        const state = authReducer(initialState, {
            type: registerThunk.rejected.type,
            payload: 'Email already taken',
        });
        expect(state.error).toBe('Email already taken');
        expect(state.isLoading).toBe(false);
    });
});

describe('AuthSlice — getMeThunk', () => {
    it('sets isLoading true on pending', () => {
        const state = authReducer(initialState, { type: getMeThunk.pending.type });
        expect(state.isLoading).toBe(true);
    });

    it('stores user on fulfilled and clears sessionExpired', () => {
        const state = authReducer(
            { ...initialState, sessionExpired: true },
            { type: getMeThunk.fulfilled.type, payload: mockUser },
        );
        expect(state.user).toEqual(mockUser);
        expect(state.isLoading).toBe(false);
        expect(state.sessionExpired).toBe(false);
    });

    it('does NOT persist user to localStorage on fulfilled', () => {
        authReducer(initialState, { type: getMeThunk.fulfilled.type, payload: mockUser });
        expect(localStorage.getItem('user')).toBeNull();
    });

    it('sets sessionExpired true and clears auth on rejected', () => {
        const state = authReducer(loggedInState, {
            type: getMeThunk.rejected.type,
            payload: 'Session expired',
        });
        expect(state.user).toBeNull();
        expect(state.accessToken).toBeNull();
        expect(state.sessionExpired).toBe(true);
        expect(state.error).toBe('Session expired');
    });

    it('removes accessToken from localStorage on rejected', () => {
        localStorage.setItem('accessToken', mockToken);
        authReducer(loggedInState, { type: getMeThunk.rejected.type, payload: 'Session expired' });
        expect(localStorage.getItem('accessToken')).toBeNull();
    });

    it('falls back to "Session expired" when rejected without payload', () => {
        const state = authReducer(loggedInState, {
            type: getMeThunk.rejected.type,
            payload: undefined,
        });
        expect(state.error).toBe('Session expired');
    });
});

describe('AuthSlice — updateProfileThunk', () => {
    it('sets isLoading true on pending', () => {
        const state = authReducer(initialState, { type: updateProfileThunk.pending.type });
        expect(state.isLoading).toBe(true);
    });

    it('updates user in state on fulfilled', () => {
        const updatedUser = { ...mockUser, username: 'updated' };
        const state = authReducer(loggedInState, {
            type: updateProfileThunk.fulfilled.type,
            payload: updatedUser,
        });
        expect(state.user).toEqual(updatedUser);
        expect(state.isLoading).toBe(false);
    });

    it('does NOT persist updated user to localStorage on fulfilled', () => {
        const updatedUser = { ...mockUser, username: 'updated' };
        authReducer(loggedInState, {
            type: updateProfileThunk.fulfilled.type,
            payload: updatedUser,
        });
        expect(localStorage.getItem('user')).toBeNull();
    });

    it('sets isLoading false on rejected', () => {
        const state = authReducer(
            { ...loggedInState, isLoading: true },
            { type: updateProfileThunk.rejected.type },
        );
        expect(state.isLoading).toBe(false);
    });
});
