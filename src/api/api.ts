import axios from 'axios';

const API_PREFIX = import.meta.env.VITE_API_BASE_PREFIX;

const api = axios.create({
    baseURL: API_PREFIX,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    }
});

let accessToken: string | null = null;

export const setApiAccessToken = (token: string | null) => {
    accessToken = token;
};
api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const rs = await axios.get(`${API_PREFIX}/refresh`, {
                    withCredentials: true
                });

                const { accessToken: newAccessToken } = rs.data;

                setApiAccessToken(newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (_error) {
                return Promise.reject(_error);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
