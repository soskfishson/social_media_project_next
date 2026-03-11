import axios, { type InternalAxiosRequestConfig } from 'axios';
import { setupInterceptors } from './api';
import { logout } from '../redux/AuthSlice';

jest.unmock('./api');
const { apiClient } = jest.requireActual('./api') as typeof import('./api');

const makeStore = (accessToken: string | null = null) => ({
    getState: jest.fn().mockReturnValue({ auth: { accessToken } }),
    dispatch: jest.fn(),
});

describe('apiClient — request interceptor', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    const runRequestInterceptor = (config: Partial<InternalAxiosRequestConfig> = {}) => {
        const interceptors = (
            apiClient.interceptors.request as unknown as {
                handlers: Array<{
                    fulfilled: (c: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
                } | null>;
            }
        ).handlers;
        const handler = interceptors.find(Boolean)!.fulfilled;
        return handler({
            headers: { ...axios.defaults.headers.common },
            ...config,
        } as InternalAxiosRequestConfig);
    };

    it('attaches Bearer token when accessToken exists in localStorage', () => {
        localStorage.setItem('accessToken', 'my-secret-token');
        const result = runRequestInterceptor();
        expect(result.headers?.Authorization).toBe('Bearer my-secret-token');
    });

    it('does not attach Authorization header when localStorage has no token', () => {
        const result = runRequestInterceptor();
        expect(result.headers?.Authorization).toBeUndefined();
    });

    it('overwrites a pre-existing Authorization header with the stored token', () => {
        localStorage.setItem('accessToken', 'new-token');
        const result = runRequestInterceptor({
            headers: { Authorization: 'Bearer old-token' } as InternalAxiosRequestConfig['headers'],
        });
        expect(result.headers?.Authorization).toBe('Bearer new-token');
    });

    it('passes config through unchanged when no token is set', () => {
        const config = { headers: {}, url: '/api/posts' } as InternalAxiosRequestConfig;
        const result = runRequestInterceptor(config);
        expect(result.url).toBe('/api/posts');
    });
});

describe('setupInterceptors — response interceptor', () => {
    beforeEach(() => {
        const responseInterceptors = (
            apiClient.interceptors.response as unknown as {
                handlers: Array<unknown>;
            }
        ).handlers;
        responseInterceptors.forEach((_, id) => apiClient.interceptors.response.eject(id));
    });

    const registerInterceptor = (store: ReturnType<typeof makeStore>) => {
        setupInterceptors(store as never);
    };

    const getResponseHandlers = () => {
        const interceptors = (
            apiClient.interceptors.response as unknown as {
                handlers: Array<{
                    fulfilled: (r: unknown) => unknown;
                    rejected: (e: unknown) => unknown;
                } | null>;
            }
        ).handlers;
        return interceptors.find(Boolean)!;
    };

    it('returns the response unchanged on success', () => {
        const store = makeStore();
        registerInterceptor(store);
        const { fulfilled } = getResponseHandlers();
        const response = { data: { id: 1 }, status: 200 };
        expect(fulfilled(response)).toBe(response);
    });

    it('dispatches logout when response status is 401 and token exists in store', async () => {
        const store = makeStore('existing-token');
        registerInterceptor(store);
        const { rejected } = getResponseHandlers();
        const error = { response: { status: 401 } };
        await expect(rejected(error)).rejects.toEqual(error);
        expect(store.dispatch).toHaveBeenCalledWith(logout());
    });

    it('does NOT dispatch logout on 401 when store has no accessToken', async () => {
        const store = makeStore(null);
        registerInterceptor(store);
        const { rejected } = getResponseHandlers();
        const error = { response: { status: 401 } };
        await expect(rejected(error)).rejects.toEqual(error);
        expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('does NOT dispatch logout when response status is 403', async () => {
        const store = makeStore('some-token');
        registerInterceptor(store);
        const { rejected } = getResponseHandlers();
        const error = { response: { status: 403 } };
        await expect(rejected(error)).rejects.toEqual(error);
        expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('does NOT dispatch logout when response status is 500', async () => {
        const store = makeStore('some-token');
        registerInterceptor(store);
        const { rejected } = getResponseHandlers();
        const error = { response: { status: 500 } };
        await expect(rejected(error)).rejects.toEqual(error);
        expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('does NOT dispatch logout when error has no response object', async () => {
        const store = makeStore('some-token');
        registerInterceptor(store);
        const { rejected } = getResponseHandlers();
        const error = new Error('Network Error');
        await expect(rejected(error)).rejects.toEqual(error);
        expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('rejects the promise with the original error on non-401', async () => {
        const store = makeStore('token');
        registerInterceptor(store);
        const { rejected } = getResponseHandlers();
        const error = { response: { status: 404 } };
        await expect(rejected(error)).rejects.toBe(error);
    });

    it('rejects the promise with the original error on 401', async () => {
        const store = makeStore('token');
        registerInterceptor(store);
        const { rejected } = getResponseHandlers();
        const error = { response: { status: 401 } };
        await expect(rejected(error)).rejects.toBe(error);
    });
});
