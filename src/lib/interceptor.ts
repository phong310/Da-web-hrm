import { RefreshTokenResponse } from "./request";
import { V1 } from 'constants/apiVersion'
import { toast } from 'react-toastify'
import Axios from 'axios'
import { UserToken } from "./types/auth";
const baseURL = import.meta.env.VITE_API_URL as string
const refetchTokenURL = `${baseURL}/${V1}/user/refresh-token`

// for multiple requests
let isRefreshing = false;
let failedQueue: any = [];


const processQueue = (error: any, token: any = null) => {
    failedQueue.forEach((prom: any) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

async function refreshToken(token: UserToken) {
    try {
        const res = await Axios.request<RefreshTokenResponse>({
            method: 'POST',
            baseURL: refetchTokenURL,
            data: {
                refresh_token: token.refresh_token
            }
        })

        return res.data
    } catch (error) {
        throw Error('refetching token failed.')
    }
}

const interceptor = (axiosInstance: any) => (error: any) => {
    const _axios = axiosInstance;
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
            return new Promise(function (resolve, reject) {
                failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    //   originalRequest.headers["Authorization"] = "Bearer " + token;
                    return _axios.request(originalRequest);
                })
                .catch((err) => {
                    return Promise.reject(err);
                });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        return new Promise(async (resolve, reject) => {
            const _token = localStorage.getItem('user-token')
            try {

                if (_token) {
                    const token = JSON.parse(_token) as UserToken

                    const response = await refreshToken(token)

                    if (response && response.access_token && response.access_token) {
                        // error.config.headers.authorization = `Bearer ${response?.access_token}`
                        localStorage.setItem('user-token', JSON.stringify(response))
                        // error.config.headers.authorization = `Bearer ${response?.access_token}`
                        // _axios.defaults.headers.common.authorization = `Bearer ${response?.access_token}`
                        // originalRequest.headers.authorization = `Bearer ${response?.access_token}`
                        processQueue(null, response.access_token);
                        resolve(_axios(originalRequest));
                    } else {
                        localStorage.removeItem('user-token')
                        window.location.replace('/login')
                        console.log("here");
                    }
                }

            } catch (err) {
                processQueue(err, null);
                reject(err);
            } finally {
                isRefreshing = false;
            }
        });
    }

    if (error.response && error.response.status === 403) {
        if (error.response.data.message) {
            toast.error(error.response.data.message)
        }
    }

    //   return Promise.reject(error);
    return Promise.reject(error.response.data)
};

export default interceptor;