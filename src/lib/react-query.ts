import { AxiosRequestConfig } from 'axios'
import { DefaultOptions, QueryClient, QueryKey } from 'react-query'
import { request } from './request'

const defaultFn = async ({ queryKey }: { queryKey: QueryKey }) => {
    const [endpoint, params, options] = queryKey as Array<string | Record<string, unknown>>

    const res = await request.get(endpoint as string, {
        params,
        ...(options as AxiosRequestConfig)
    })
    return res.data
}

const queryConfig: DefaultOptions = {
    queries: {
        queryFn: defaultFn,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        retry: false
    }
}

export const queryClient = new QueryClient({ defaultOptions: queryConfig })
