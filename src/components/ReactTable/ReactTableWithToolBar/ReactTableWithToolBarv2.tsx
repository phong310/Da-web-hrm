import { Checkbox } from '@mui/material'
import { Pagev2 } from 'components/Layouts/Page/Pagev2'
import { usePaginationQuery } from 'lib/hook/usePaginationQuery'
import { UnknownObj } from 'lib/types/utils'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import { CellProps, Column, TableOptions } from 'react-table'
import { toast } from 'react-toastify'
import Toolbarv2 from '../Toolbarv2'
import { ReactTablev2 } from '../ReactTablev2'
interface ReactTableWithToolBarProps<T extends object> extends TableOptions<T> {
  searchColumns?: any
  handleChangeParams?: (params: UnknownObj) => void
  endpoint: string
  exportUrl?: string
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
  title: string | React.ReactNode
  paperOptions?: any
  sxCustom?: any
  data: readonly T[]
  reRender?: any
  forceReRender?: any // use for parent component that have additional api call
  titleDelete?: string | React.ReactNode
  showCheckCol?: boolean
}

function ReactTableWithToolBarv2<T extends object>(props: ReactTableWithToolBarProps<T>) {
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
    isShowSearchFast = true,
    exportFileName,
    quickSearchField,
    title,
    data,
    isDisableBreadcrumb,
    paperOptions,
    sxCustom,
    reRender,
    forceReRender,
    titleDelete,
    showCheckCol
  } = props

  const location = useLocation()
  const [displayColumns, setDisplayColumns] = useState<any>([])
  const { paginationData, handleChangeParams, refetch } = usePaginationQuery<any>(endpoint, params)
  const [seletedItems, setSeletedItems] = useState<number[] | []>([])

  const refetchWhenParamsChange = useMemo(() => handleChangeParams(params), [params])
  refetchWhenParamsChange

  useEffect(() => {
    refetch()
  }, [location.pathname, reRender])

  const handleCheckRow = (row: any) => {
    let ids: number[] = [...seletedItems]
    if (ids.includes(row.id)) {
      ids = ids.filter((item) => item !== row.id)
    } else {
      ids.push(row.id)
    }

    setSeletedItems(ids)
  }

  const handleCheckAll = () => {
    if (seletedItems.length === paginationData?.data.length) {
      setSeletedItems([])
    } else {
      const ids: number[] = []
      paginationData?.data.map((d) => {
        ids.push(d.id)
      })
      setSeletedItems(ids)
    }
  }

  useEffect(() => {
    let columnsArr = [...columns]
    if (showCheckCol) {
      columnsArr = [
        {
          Header: (
            <Checkbox
              onClick={() => handleCheckAll()}
              checked={
                seletedItems.length > 0 && seletedItems.length === paginationData?.data.length
                  ? true
                  : false
              }
            />
          ),
          id: 'selection',
          width: 40,
          Cell: ({ row }: any) => (
            <Checkbox
              onClick={() => handleCheckRow(row.original)}
              //@ts-ignore
              checked={seletedItems.includes(row.original?.id)}
            />
          )
        }
      ].concat(columnsArr)
    }

    setDisplayColumns(columnsArr || [])
  }, [columns, seletedItems])

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
    <Pagev2
      {...paperOptions}
      sxCustom={sxCustom}
      isDisableBreadcrumb={isDisableBreadcrumb}
      title={title}
      leftHeader={props.leftHeader}
    >
      <Toolbarv2
        searchColumns={searchColumns}
        handleChangeParams={handleChangeParams}
        callBackColumnsDisplay={callBackColumnsDisplay}
        quickSearchField={quickSearchField}
        loading={props.loading}
        {...props}
        isTableCalendar={isTableCalendar}
        isShowSearchFast={isShowSearchFast}
        headerOptions={headerOptions}
      />
      <ReactTablev2
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
      />
    </Pagev2>
  )
}

export default memo(ReactTableWithToolBarv2) as typeof ReactTableWithToolBarv2
