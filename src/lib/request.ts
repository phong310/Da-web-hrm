import Axios, { AxiosRequestConfig } from 'axios'
import interceptor from "./interceptor";
import { UserToken } from './types/auth';

const baseURL = import.meta.env.VITE_API_URL as string



async function authRequestInterceptor(config: AxiosRequestConfig) {
    const _token = await localStorage.getItem('user-token')
    const locale = await localStorage.getItem('language')
    // Fix stupid axios typescript
    if (_token && _token !== 'undefined' && config.headers) {
        const token = JSON.parse(_token) as UserToken
        config.headers.authorization = `Bearer ${token.access_token}`
    }
    //@ts-ignore
    config.headers.common['Accept-Language'] = locale

    return config
}

export type RefreshTokenResponse = {
    refresh_token: string
    access_token: string
}

export const request = Axios.create({
    baseURL
})
// @ts-ignore
request.interceptors.request.use(authRequestInterceptor)
request.interceptors.response.use(undefined, interceptor(request))
