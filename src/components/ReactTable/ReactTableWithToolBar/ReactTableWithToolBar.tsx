import { RoundPaper } from 'components/Layouts/Page/RoundPaper'
import { usePaginationQuery } from 'lib/hook/usePaginationQuery'
import { UnknownObj } from 'lib/types/utils'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { CellProps, Column, TableOptions } from 'react-table'
import { toast } from 'react-toastify'
import { ReactTable } from '../ReactTable'
import Toolbar from '../Toolbar'
import { PageTable } from 'components/Layouts/Page/PageTable'
interface ReactTableWithToolBarProps<T extends object> extends TableOptions<T> {
  searchColumns?: any
  handleChangeParams?: (params: UnknownObj) => void
  endpoint: string
  exportUrl?: string
  importUrl?: string
  exportFileName?: string
  templateUrl?: string
  headerOptions?: React.ReactElement
  isTableCalendar?: boolean
  defaultActionEdit?: boolean
  defaultActionDelete?: boolean
  selection?: boolean
  columns: any
  params?: Record<string, unknown>
  quickSearchField?: any
  paperOptions?: any
  sxCustom?: any
  data: readonly T[]
  reRender?: any
  edit?: boolean
  titlePage?: string
  forceReRender?: any // use for parent component that have additional api call
  titleDelete?: string | React.ReactNode
  titleDeleteAppBar?: string | React.ReactNode
}

function ReactTableWithToolBar<T extends object>(props: ReactTableWithToolBarProps<T>) {
  const {
    columns,
    endpoint,
    searchColumns,
    deleteApi,
    onRowClick,
    onCellClick,
    params,
    defaultActionEdit = false,
    selection = false,
    defaultActionDelete = false,
    exportUrl,
    headerOptions,
    isTableCalendar = false,
    edit,
    isShowSearchFast = true,
    exportFileName,
    quickSearchField,
    title,
    isDisableBreadcrumb,
    paperOptions,
    sxCustom,
    reRender,
    forceReRender,
    titleDelete,
    titlePage,
    titleDeleteAppBar,
    importUrl
  } = props

//   const location = useLocation()
  const [displayColumns, setDisplayColumns] = useState<any>([])
  const { paginationData, handleChangeParams, refetch } = usePaginationQuery<any>(endpoint, params)
//   const { t, i18n } = useTranslation()

  const refetchWhenParamsChange = useMemo(() => handleChangeParams(params), [params])
  refetchWhenParamsChange

  useEffect(() => {
    refetch()
  }, [edit, reRender])

  useEffect(() => {
    setDisplayColumns(columns || [])
  }, [columns])

  const onActionDelete = useCallback(async ({ row }: CellProps<any>) => {
    try {
      const res = await deleteApi(Number(row.original.id))
      if (res.status === 200) {
        toast.success(res.data.message)
      }
      refetch()
      forceReRender?.(1)
    } catch (error) {}
  }, [])

  const callBackColumnsDisplay = (cols: Column) => {
    //@ts-ignore
    cols = cols?.filter((col: Column & { display: boolean }) => col.display)
    setDisplayColumns(cols || [])
  }

  return (
    <PageTable
      {...paperOptions}
      title={titlePage}
      sxCustom={sxCustom}
      isDisableBreadcrumb={isDisableBreadcrumb}
      leftHeader={props.leftHeader}
    >
      <RoundPaper>
        <Toolbar
          title={title}
          searchColumns={searchColumns}
          handleChangeParams={handleChangeParams}
          callBackColumnsDisplay={callBackColumnsDisplay}
          quickSearchField={quickSearchField}
          loading={props.loading}
          {...props}
          isTableCalendar={isTableCalendar}
          isShowSearchFast={isShowSearchFast}
          headerOptions={headerOptions}
          importUrl={importUrl}
        />
        <ReactTable
          onActionEdit={props?.onActionEdit}
          columns={displayColumns}
          defaultActionEdit={defaultActionEdit}
          onRowClick={onRowClick}
          onCellClick={onCellClick}
          onActionDelete={defaultActionDelete ? onActionDelete : undefined}
          selection={selection}
          exportUrl={exportUrl}
          isTableCalendar={isTableCalendar}
          exportFileName={exportFileName}
          {...paginationData}
          templateUrl={''}
          titleDelete={titleDelete}
          titleDeleteAppBar={titleDeleteAppBar}
        />
      </RoundPaper>
    </PageTable>
  )
}

export default memo(ReactTableWithToolBar) as typeof ReactTableWithToolBar
