import {
  Box,
  ClickAwayListener,
  PaginationProps,
  Paper,
  Stack,
  StackProps,
  Table,
  TableBody,
  TableContainer,
  TableContainerProps,
  TableHead,
  TableProps,
  TableRow,
  Typography
} from '@mui/material'
import { SxProps } from '@mui/system'
import { TableSkeleton, TableSkeletonType } from 'components/Skeleton/TableSkeleton'
import { UnknownObj } from 'lib/types/utils'
// import { TableSkeleton, TableSkeletonType } from 'components/Skeleton'
// import { RoundPaperv2 } from 'components/v2/RoundPaperv2'
// import { UnknownObj } from 'lib/types'
import { ReactElement, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { CellProps, Column, Row as RowProps, TableOptions, useTable } from 'react-table'
import { actionHook, hooks, selectionHook } from './tableHooks'
import { RoundPaper } from 'components/Layouts/Page/RoundPaper'
import { FilterBar } from './FilterBar'
import { EmptyTable } from './EmptyTable'
import { CalendarCell, Cell, Row, SortLabel } from './StyledComponent'
import { blueV2 } from 'styles/colors'
import { Pagination } from './Pagination/Pagination'
// import { blueV2 } from 'styles/v2/colors'
// import { EmptyTable } from '../EmptyTable'
// import { Pagination } from '../Pagination'
// import { CalendarCell, Cell, FilterBar, Row, SortLabel } from '../components'
// import { actionHook, hooks, selectionHook } from '../tableHooks'

export type PaginationMeta = {
  page: number
  per_page: number
}

export type ActionColumnConfig = {
  editText?: string
  deleteText?: string
  needConfirm?: boolean
  deleteConfirmText?: string
}
enum TypeCell {
  Header = 0,
  Body = 1
}
interface TableProperties<T extends object> extends TableOptions<T> {
  tableProps?: TableProps
  sx?: SxProps
  onRowClick?(row: RowProps<T>): void
  onCellClick?(cell: CellProps<T>): void
  onClickAway?(): void
  loading?: boolean
  searchable?: boolean
  selection?: boolean
  isTableCalendar?: boolean
  skeletonConfig?: TableSkeletonType
  pageCount?: number
  handleChangeParams?(params: UnknownObj): void
  handleChangePagination?(paginationMeta: PaginationMeta): void
  isPreviousData?: boolean
  actionConfig?: ActionColumnConfig
  onActionEdit?(props: CellProps<T>): void
  onActionDelete?(props: CellProps<T>): void
  defaultActionEdit?: boolean
  paginationType?: 'table' | 'normal'
  nPaginationProps?: PaginationProps
  nPaginationContainerProps?: StackProps
  tableContainerProps?: TableContainerProps
}

function ReactTable<T extends object>(props: TableProperties<T>): ReactElement {
  const {
    columns,
    data,
    pageCount = 0,
    total,
    tableProps,
    selection = false,
    searchable = false,
    actionConfig,
    onActionEdit,
    onActionDelete,
    onRowClick,
    onCellClick,
    onClickAway = () => undefined,
    handleChangeParams,
    handleChangePagination,
    loading,
    isTableCalendar = false,
    defaultActionEdit,
    skeletonConfig,
    sx,
    paginationType = 'table',
    nPaginationProps,
    nPaginationContainerProps,
    tableContainerProps,
    ...useTableOptions
  } = props

  const instance = useTable<T>(
    {
      columns,
      data,
      initialState: { pageSize: 20 },
      manualPagination: true,
      autoResetPage: false,
      autoResetSortBy: false,
      pageCount,
      ...useTableOptions
    },
    ...hooks,
    selectionHook(selection),
    actionHook({ actionConfig, onActionEdit, onActionDelete, defaultActionEdit })
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { pageIndex, pageSize }
  } = instance

  const { t } = useTranslation()
  const hasRowClick = typeof onRowClick === 'function'
  const hasCellClick = typeof onCellClick === 'function'

  useEffect(() => {
    if (typeof handleChangePagination === 'function') {
      handleChangePagination({ page: pageIndex + 1, per_page: pageSize })
    }
  }, [handleChangePagination, pageIndex, pageSize])

  // if (loading && !data.length) {
  //   return <TableSkeleton {...skeletonConfig} />
  // }

  // if (!loading && !data.length) {
  //   return <EmptyTable />
  // }

  return (
    <RoundPaper elevation={0}>
      {handleChangeParams && (
        <FilterBar
          searchColumns={columns as Column<UnknownObj>[]}
          watchMode={true}
          handleChangeParams={handleChangeParams}
          mb={2}
        />
      )}

      {loading && !data.length ? (
        <TableSkeleton {...skeletonConfig} />
      ) : !loading && !data.length ? (
        <EmptyTable />
      ) : (
        <ClickAwayListener onClickAway={onClickAway}>
          <TableContainer component={Paper} sx={sx} elevation={0} {...tableContainerProps}>
            <Table {...tableProps} {...getTableProps()}>
              <TableHead>
                {headerGroups.map((headerGroup) => {
                  const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps()

                  return (
                    <Row key={key} {...headerGroupProps}>
                      {headerGroup.headers.map((column, index) => {
                        const { key, ...cellHeaderProps } = column.getHeaderProps([
                          column.getSortByToggleProps(),
                          {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            //@ts-ignore
                            style: column.style
                          }
                        ])

                        return isTableCalendar ? (
                          <CalendarCell
                            variant="head"
                            sortDirection={column.isSortedDesc ? 'desc' : 'asc'}
                            key={key}
                            {...cellHeaderProps}
                            sx={{
                              paddingY: '16px',
                              backgroundColor: selection
                                ? index != 0
                                  ? blueV2[20]
                                  : blueV2[20]
                                : blueV2[20],
                              minWidth: 200,
                              paddingX: index == 0 ? '16px' : '8px',
                              ...stickyFirstCol(index, TypeCell.Header, selection)
                            }}
                          >
                            <SortLabel
                              // active={column.isSorted}
                              // react-table has a unsorted state which is not treated here
                              // direction={column.isSortedDesc ? 'desc' : 'asc'}
                              hideSortIcon={true}
                              sx={{
                                width: '100%',
                                ...cellHeaderProps?.style
                              }}
                            >
                              <Stack
                                direction="row"
                                sx={{
                                  fontSize: {
                                    xs: '12px',
                                    sm: '14px'
                                  }
                                }}
                              >
                                {column.render('Header')}
                              </Stack>
                            </SortLabel>
                          </CalendarCell>
                        ) : (
                          <Cell
                            variant="head"
                            sortDirection={column.isSortedDesc ? 'desc' : 'asc'}
                            key={key}
                            {...cellHeaderProps}
                            sx={{
                              width: column.id === '__action' ? 50 : 'auto',
                              padding: index === 0 ? '16px 16px' : '16px 8px'
                            }}
                          >
                            <SortLabel
                              active={column.isSorted}
                              // react-table has a unsorted state which is not treated here
                              direction={column.isSortedDesc ? 'desc' : 'asc'}
                              hideSortIcon={column.id === '_selector' || column.id === '__action'}
                              sx={{
                                width: '100%',
                                ...cellHeaderProps?.style
                              }}
                            >
                              <Stack direction="row">{column.render('Header')}</Stack>
                            </SortLabel>
                          </Cell>
                        )
                      })}
                    </Row>
                  )
                })}
              </TableHead>

              <TableBody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row)
                  const { key, ...getRowProps } = row.getRowProps()
                  return (
                    <Row
                      onClick={() => hasRowClick && onRowClick(row)}
                      hasRowClick={hasRowClick}
                      hover
                      key={key}
                      {...getRowProps}
                    >
                      {row.cells.map((cell, index) => {
                        const { key, ...getCellProps } = cell.getCellProps([
                          {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            //@ts-ignore
                            style: cell.column?.style
                          }
                        ])
                        return (
                          <Cell
                            hasCellClick={hasCellClick}
                            onClick={() => onCellClick?.(cell as any)}
                            key={index}
                            variant="body"
                            {...getCellProps}
                            sx={{
                              padding: 1,
                              minWidth: cell.column.id === '__action' ? 50 : 200,
                              backgroundColor: 'white',
                              borderRight: 1,
                              ...stickyFirstCol(index, TypeCell.Body, selection, isTableCalendar)
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                ...getCellProps?.style
                              }}
                            >
                              {cell.render('Cell')}
                            </Box>
                          </Cell>
                        )
                      })}
                    </Row>
                  )
                })}
              </TableBody>

              {/* {paginationType === 'table' && (
                  <TableFooter>
                    <TableRow>
                      <Pagination<T> instance={instance} />
                    </TableRow>
                  </TableFooter>
                )} */}
            </Table>

            {/* {paginati onType === 'normal' && (
                <Stack direction="row" my={3} {...nPaginationContainerProps} justifyContent="center">
                  <Pagination<T>
                    type={paginationType}
                    instance={instance}
                    nPaginationProps={nPaginationProps}
                  />
                </Stack>
              )} */}
          </TableContainer>
        </ClickAwayListener>
      )}
      {paginationType === 'table' && (
        <Table>
          <TableBody>
            <TableRow>
              <Cell
                sx={{
                  fontWeight: 500,
                  minWidth: { xs: 150, sm: 200 },
                  lineHeight: '22px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  overflow: 'auto'
                }}
              >
                <Typography
                  sx={{
                    fontSize: {
                      xs: 12,
                      sm: 14
                    },
                    minWidth: 100
                  }}
                >
                  {t('table.total_records')}: {total}
                </Typography>
                <Pagination<T> instance={instance} />
              </Cell>
            </TableRow>
          </TableBody>
        </Table>
      )}
      {paginationType === 'normal' && (
        <Stack direction="row" my={3} {...nPaginationContainerProps} justifyContent="center">
          <Pagination<T>
            type={paginationType}
            instance={instance}
            nPaginationProps={nPaginationProps}
          />
        </Stack>
      )}
    </RoundPaper>
  )
}

const stickyFirstCol = (
  index: number,
  type: number,
  selection?: boolean,
  isTableCalendar?: boolean
) => {
  if ((index == 0 || (selection && index == 1)) && type === TypeCell.Header) {
    return {
      position: 'sticky',
      left: 0,
      zIndex: 1
    }
  } else if (
    (index == 0 || (selection && index == 1)) &&
    type === TypeCell.Body &&
    isTableCalendar
  ) {
    return {
      position: 'sticky',
      left: 0,
      zIndex: 1
    }
  }
}

export { ReactTable }

