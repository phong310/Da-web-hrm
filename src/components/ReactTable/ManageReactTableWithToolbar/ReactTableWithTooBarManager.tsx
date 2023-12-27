// @ts-nocheck
import { Box, Checkbox, Grid, Tab, Tabs, Typography } from '@mui/material'
import { RoundPaper } from 'components/Layouts/Page/RoundPaper'
import { useAtom } from 'jotai'
import { initialSearchParams, searchParamsAtom } from 'lib/atom/searchAtom'
import { usePaginationQuery } from 'lib/hook/usePaginationQuery'
import { UnknownObj } from 'lib/types/utils'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { CellProps, Column, TableOptions } from 'react-table'
import { toast } from 'react-toastify'
import ToolbarManager from '../ToolbarManager'
import { ReactTableManager } from '../ReactTableManager'
import { a11yProps } from 'components/Tab/TabPannel'

export interface TabTitle {
  title: React.ReactElement | JSX.Element | string
}

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
  setTabChange?: (index: number) => void
  data: readonly T[]
  reRender?: any
  forceReRender?: any // use for parent component that have additional api call
  titleDelete?: string | React.ReactNode
  tabIndex?: number
  tabTitle: TabTitle[]
  showCheckCol?: boolean
  isShowSearchFast?: boolean
}

function ReactTableWithTooBarManager<T extends object>(props: ReactTableWithToolBarProps<T>) {
  const {
    columns,
    endpoint,
    searchColumns,
    deleteApi,
    onRowClick,
    edit,
    onCellClick,
    params,
    defaultActionEdit = false,
    selection = false,
    defaultActionDelete = false,
    exportUrl,
    headerOptions,
    isTableCalendar = false,
    isShowSearchFast,
    exportFileName,
    quickSearchField,
    title,
    setTabChange,
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
  const { tabTitle, tabIndex, rightElement } = props

  const navigate = useNavigate()
  const [, setSearchParams] = useAtom(searchParamsAtom)
  const { watch, setValue } = useForm<{ tabIndex: number }>({
    defaultValues: {
      tabIndex: tabIndex ?? 0
    }
  })
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSearchParams(initialSearchParams)
    setTabChange && setTabChange(newValue)
    navigate('', { state: { tabIndex: newValue } })
  }
  const refetchWhenParamsChange = useMemo(() => handleChangeParams(params), [params])
  refetchWhenParamsChange

  useEffect(() => {
    refetch()
  }, [edit, reRender])

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
    <>
      <Typography sx={{ ...styleTitle }}>{title}</Typography>
      <Grid
        item
        xs={12}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          alignItems: 'center'
        }}
      >
        <Tabs
          value={watch('tabIndex')}
          onChange={handleChange}
          sx={{ ...tabListStyle }}
          aria-label="icon label tabs example"
        >
          {tabTitle.map((element, index) => {
            return (
              <Tab
                sx={{ ...tabItemStyle }}
                key={index}
                icon={element.title}
                {...a11yProps(index)}
              />
            )
          })}
        </Tabs>
        <Box sx={{ ...styleDatePicker }}>{props.leftHeader}</Box>
      </Grid>
      <RoundPaper>
        <ToolbarManager
          searchColumns={searchColumns}
          handleChangeParams={handleChangeParams}
          callBackColumnsDisplay={callBackColumnsDisplay}
          quickSearchField={quickSearchField}
          loading={props.loading}
          {...props}
          leftHeader={props.leftHeader}
          isTableCalendar={isTableCalendar}
          isShowSearchFast={isShowSearchFast}
          headerOptions={headerOptions}
        />
        <ReactTableManager
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
      </RoundPaper>
    </>
  )
}

const tabListStyle = {
  color: '#878C95',
  borderRadius: '8px 8px 0 0',
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: '20px',
  textTransform: 'inherit',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  '@media (max-width: 600px)': {
    minWidth: 0
  },
  '@media (min-width: 768px) and (max-width: 1180px)': {
    minWidth: '150px'
  },
  '& .Mui-selected': {
    color: '#404DA8',
    backgroundColor: '#fff',
    boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10)'
  },
  '&.MuiTabs-flexContainer': {
    gap: '8px'
  }
}
const styleDatePicker = {
  display: { xs: 'none', sm: 'block' },
  width: { xs: '100px', sm: 'auto' }
  // '@media (min-width: 600px) and (max-width: 1366px)': {
  //   display: 'none'
  // }
}
const styleTitle = {
  display: { xs: 'block', sm: 'none' },
  fontSize: { xs: '16px', sm: '20px', md: '24px' },
  fontFamily: 'Lato',
  color: 'rgb(20, 107, 210)',
  fontWeight: '800',
  textTransform: 'uppercase',
  lineHeight: '36px',
  marginBottom: { xs: '12px', sm: '20px' },
  '@media (min-width: 600px) and (max-width: 1366px)': {
    display: 'block'
  }
}
const tabItemStyle = {
  minWidth: { xs: '118px', sm: '150px', md: '195px' },
  textAlign: 'center',
  textTransform: 'inherit',
  color: '#878C95',
  padding: { xs: '6px', sm: '12px 16px' },
  whiteSpace: 'nowrap',
  borderRadius: '8px 8px 0 0',
  marginRight: '4px',
  backgroundColor: '#f0f0f0',
  '&:hover': {
    backgroundColor: '#fff',
    borderBottom: '2px solid #146BD2'
  },
  '&.MuiButtonBase-root .MuiTypography-root': {
    fontSize: { xs: '14px', sm: '16px' }
  },
  '@media (min-width: 1024px) and (max-width: 1366px)': {
    minWidth: '150px'
  }
}

export default memo(ReactTableWithTooBarManager) as typeof ReactTableWithTooBarManager
