import { AxiosRequestConfig } from 'axios'
import { request } from '../request'

export function uploadApi(file: File, config?: AxiosRequestConfig) {
    const formData = new FormData()
    formData.append('file', file)

    return request({
        ...config,
        data: formData,
        method: config?.method || 'POST',
        url: config?.url || 'upload'
    })
}
