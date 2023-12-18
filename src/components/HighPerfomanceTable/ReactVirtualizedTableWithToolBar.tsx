// @ts-nocheck
import { Pagev2 } from 'components/Layouts/Page/Pagev2'
import { usePaginationQuery } from 'lib/hook/usePaginationQuery'
import { useState } from 'react'
import { Column } from 'react-table'
import { ColumnProps, TableProps } from 'react-virtualized'
import { BaseReactVirtualizedTableProps, BaseReactVirtualizedTablev2 } from './BaseReactVirtualizedTable'
import Toolbarv2 from 'components/ReactTable/Toolbarv2'
export interface ReactVirtualizedTableWithToolBarProps extends Partial<TableProps> {
  serachField: ColumnProps[]
  title: string
  endpoint: string
  data: any
  params?: Record<string, unknown>
  quickSearchField?: any
  headerOptions?: React.ReactElement
  columns: ColumnProps[]
  rowHeight?: number
  isShowSearchFast?: any
  searchField?:any
}
export const ReactVirtualizedTableWithToolBar = (
  props: ReactVirtualizedTableWithToolBarProps
) => {
  const {
    searchField,
    title,
    endpoint,
    data,
    columns,
    headerOptions,
    quickSearchField,
    isShowSearchFast = true,
    params,
    rowHeight,
    ...tableProps
  } = props
  const [displayColumns, setDisplayColumns] = useState<any>([])

  const { paginationData, isLoading, handleChangeParams } = usePaginationQuery(
    endpoint,
    params
  )

  const callBackColumnsDisplay = (cols: Column) => {
    //@ts-ignore
    cols = cols?.filter((col: Column & { display: boolean }) => col.display)
    setDisplayColumns(cols || [])
  }

  const baseTableProps = {
    ...tableProps,
    ...paginationData,
    rowHeight,
    columns
  } as BaseReactVirtualizedTableProps

  return (
    <Pagev2 title={title}>
      <Toolbarv2
        isShowSearchFast={isShowSearchFast}
        searchColumns={searchField}
        loading={isLoading}
        columns={columns as any}
        handleChangeParams={handleChangeParams}
        callBackColumnsDisplay={callBackColumnsDisplay}
        isTableCalendar={true}
        headerOptions={headerOptions}
        quickSearchField={quickSearchField}
      />
      <BaseReactVirtualizedTablev2 {...baseTableProps} />
    </Pagev2>
  )
}
