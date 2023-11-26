import { SelectOption } from 'components/Form/Autocomplete/Select'
import { UnknownObj } from 'lib/types/utils'
import { useMemo } from 'react'
import { useQuery } from 'react-query'

export type UseSelectQueryReturn = {
    options: SelectOption[]
}

export type UseSelectQueryOptions<T> = {
    endpoint?: string
    params?: UnknownObj
    labelValueKeys: [keyof T, keyof T]
    enabled?: boolean
}

function useSelectQuery<T extends UnknownObj>({
    endpoint,
    params,
    labelValueKeys,
    enabled
}: UseSelectQueryOptions<T>) {
    const { data, ...queryResult } = useQuery<T[]>([endpoint, params], {
        enabled
    })

    const options = useMemo<SelectOption[]>(() => {
        if (!data) return []
        return data.map((el) => ({
            label: el[labelValueKeys[0]] as string,
            value: el[labelValueKeys[1]]
        }))
    }, [data, labelValueKeys])

    return { options, ...queryResult }
}

export { useSelectQuery }
