import { useCallback, useMemo, useReducer } from 'react'
import { ColumnProps } from 'react-virtualized'

type VirtualizedTableProps = {
    columns: ColumnProps[]
    data: []
    pageSize?: number
    pageCount?: number
}

type VirtualizedTableState = {
    pageIndex: number
    pageSize: number
}

type VirtualizedTableAction =
    | { type: 'SET_PAGE_SIZE'; pageSize: number }
    | { type: 'NEXT_PAGE' }
    | { type: 'PREVIOUS_PAGE' }
    | { type: 'GOTO_PAGE'; pageIndex: number }

const initialState: VirtualizedTableState = {
    pageIndex: 0,
    pageSize: 10
}

const virtualizedTableReducer = (
    state: VirtualizedTableState,
    action: VirtualizedTableAction
): VirtualizedTableState => {
    switch (action.type) {
        case 'SET_PAGE_SIZE':
            return { ...state, pageSize: action.pageSize }
        case 'NEXT_PAGE':
            return { ...state, pageIndex: state.pageIndex + 1 }
        case 'PREVIOUS_PAGE':
            return { ...state, pageIndex: state.pageIndex - 1 }
        case 'GOTO_PAGE':
            return { ...state, pageIndex: action.pageIndex }
        default:
            return state
    }
}

const useVirtualizedTable = (props: VirtualizedTableProps) => {
    const { columns, data, pageCount } = props

    const [state, dispatch] = useReducer(virtualizedTableReducer, initialState)

    const nextPage = useCallback(() => {
        dispatch({ type: 'NEXT_PAGE' })
    }, [])

    const previousPage = useCallback(() => {
        dispatch({ type: 'PREVIOUS_PAGE' })
    }, [])

    const gotoPage = useCallback((newPage: number) => {
        dispatch({ type: 'GOTO_PAGE', pageIndex: newPage })
    }, [])

    const setPageSize = (pageSize: number) => {
        dispatch({ type: 'SET_PAGE_SIZE', pageSize })
    }

    const instance = useMemo(
        () => ({
            pageCount,
            state,
            allColumns: {
                length: columns.length
            },
            nextPage,
            previousPage,
            gotoPage,
            setPageSize
        }),
        [columns, state, pageCount, data]
    )

    return instance
}

export { useVirtualizedTable }
