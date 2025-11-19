import axios, { AxiosHeaders } from "axios";
import { getTokens, setTokens, deleteUser } from "../../../utils/secure-store";

const PUBLIC_ROUTES = ['auth/login', 'auth/register'];
const REFRESH_ROUTE = '/auth/refresh';

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/${process.env.EXPO_PUBLIC_API_VERSION}`;

const axiosClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': "application/json"
    }
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

axiosClient.interceptors.request.use(async (config) => {
    if (PUBLIC_ROUTES.some(route => config.url?.includes(route))) {
        return config;
    }

    const tokens = await getTokens();

    if (tokens && tokens.token) {
        config.headers = AxiosHeaders.from({
            ...config.headers,
            'Authorization': `Bearer ${tokens.token}`
        });
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        if (originalRequest.url.includes('refresh')) {
            await deleteUser();
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise(function (resolve, reject) {
                failedQueue.push({ resolve, reject });
            }).then(token => {
                originalRequest.headers['Authorization'] = 'Bearer ' + token;
                return axiosClient(originalRequest);
            }).catch(err => {
                return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const tokens = await getTokens();

            if (!tokens || !tokens.refreshToken) {
                throw new Error("No hay refresh token disponible");
            }

            const response = await axios.post(
                `${API_URL}${REFRESH_ROUTE}`,
                { refreshToken: tokens.refreshToken },
                { headers: { 'Content-Type': 'application/json' } }
            );

            const { access_token, refresh_token } = response.data;

            if (!access_token) throw new Error("No hay access_token");

            await setTokens({
                token: access_token,
                refreshToken: refresh_token || tokens.refreshToken
            });

            axiosClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

            processQueue(null, access_token);

            originalRequest.headers['Authorization'] = 'Bearer ' + access_token;
            return axiosClient(originalRequest);

        } catch (refreshError) {
            processQueue(refreshError, null);
            await deleteUser();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default axiosClient;