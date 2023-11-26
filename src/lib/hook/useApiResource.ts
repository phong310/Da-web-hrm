import { AxiosRequestConfig } from 'axios'
import { request } from 'lib/request'
import { useCallback } from 'react'
// import { TypeIBackAccount } from 'screen/profile/UserBankAccount'
// import { TypeIndentification } from 'screen/profile/Identification'
import { ServerResponse } from 'lib/types/utils'

export interface InstanceCommon {
    id: number
}
export type TypeIBackAccount = {
    account_number: string
    account_name: string
    bank_branch: string
    bank_name: string
}

export type TypeIndentification = {
    ID_no: string
    issued_by: string
    issued_date: string
    ID_expire: string
}
const useApiResource = <
    TInstance extends InstanceCommon,
    TCreateValues = Omit<TInstance, 'id'>,
    TUpdateValues extends InstanceCommon = TInstance
>(
    url: string
) => {
    const indexApi = useCallback(() => request.get<TInstance[]>(url), [url])

    const createApi = useCallback(
        <TResponse = TInstance>(values: TCreateValues, config?: AxiosRequestConfig) =>
            request.post<TResponse>(url, values, config),
        [url]
    )

    const updateApi = useCallback(
        <TResponse = ServerResponse<TInstance>>(values: TUpdateValues, config?: AxiosRequestConfig) =>
            request.patch<TResponse>(`${url}/${(values as TUpdateValues).id}`, values, config),
        [url]
    )

    const createOrUpdateApi = useCallback(
        <TResponse = ServerResponse<TInstance>>(
            values: TCreateValues | TUpdateValues | FormData | TypeIBackAccount | TypeIndentification,
            config?: AxiosRequestConfig
        ) => {
            if ((values as TUpdateValues).id) {
                return request.patch<TResponse>(`${url}/${(values as TUpdateValues).id}`, values, config)
            } else {
                return request.post<TResponse>(url, values, config)
            }
        },
        [url]
    )

    const showApi = useCallback(
        <TResponse = TInstance>(id: number, config?: AxiosRequestConfig) =>
            request.get<TResponse>(`${url}/${id}`, config),
        [url]
    )

    const deleteApi = useCallback(
        <TResponse = ServerResponse<boolean>>(id: number, config?: AxiosRequestConfig) =>
            request.delete<TResponse>(`${url}/${id}`, config),
        [url]
    )

    return {
        indexApi,
        createApi,
        updateApi,
        showApi,
        deleteApi,
        createOrUpdateApi
    }
}

export { useApiResource }
