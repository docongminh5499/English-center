import axios from "axios";
import https from 'https';
import { Url } from "./constants";
const httpsAgent = new https.Agent({ keepAlive: true });

const axiosApi = axios.create({
    baseURL: Url.baseUrl,
    timeout: 5000,
});

axiosApi.interceptors.response.use(
    response => Promise.resolve(response.data),
    error => Promise.reject(error.response || error),
);

const API = {
    get: (url: string, params?: Record<string, any>): Promise<any> => {
        return axiosApi.get(url, { httpsAgent, params: params || {} });
    },

    post: (url: string, body?: Record<string, any>, params?: Record<string, any>): Promise<any> => {
        return axiosApi.post(url, body || {}, { params: params || {} });
    },

    put: (url: string, body?: Record<string, any>, params?: Record<string, any>): Promise<any> => {
        return axiosApi.put(url, body || {}, { params: params || {} });
    },

    patch: (url: string, body?: Record<string, any>, params?: Record<string, any>): Promise<any> => {
        return axiosApi.patch(url, body || {}, { params: params || {} });
    },

    delete: async (url: string, params?: Record<string, any>) => {
        return axiosApi.delete(url, { params: params || {} });
    },
}

export default API
