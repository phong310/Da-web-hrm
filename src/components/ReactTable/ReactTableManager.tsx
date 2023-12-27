import {
  Box,
  ClickAwayListener,
  PaginationProps,
  Stack,
  StackProps,
  Table,
  TableBody,
  TableContainer,
  TableContainerProps,
  TableHead,
  TableProps,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import { styled } from '@mui/material/styles'
import { SxProps } from '@mui/system'
import { ReactElement, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { CellProps, Column, Row as RowProps, TableOptions, useTable } from 'react-table'
import { actionHook } from './tableHooks'
import { hooks } from './tableHooks'
import { selectionHook } from './tableHooks'
import { TableSkeleton, TableSkeletonType } from 'components/Skeleton/TableSkeleton'
import { UnknownObj } from 'lib/types/utils'
import { FilterBar } from './FilterBar'
import { EmptyTable } from './EmptyTable'
import { CalendarCell, Cell, Row, SortLabel } from './StyledComponent'
import { Pagination } from './Pagination/Pagination'
import { grey } from 'styles/colors'
import { bgColorMonth2 } from 'screen/timesheet/timesheetLib'
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

function ReactTableManager<T extends object>(props: TableProperties<T>): ReactElement {
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
      total,
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

  const StyledTableCell = styled(TableCell, {
    shouldForwardProp: (prop) => prop !== 'hasCellClick'
    // @ts-ignore
  })<{ hasCellClick?: boolean }>(({ theme, hasCellClick }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14
    }
  }))

  const StyledTableRow = styled(TableRow, {
    shouldForwardProp: (prop) => prop !== 'hasRowClick'
  })<{ hasRowClick?: boolean }>(({  }) => ({
    // '&:nth-of-type(even)': {
    //   backgroundColor: '#F0F0F0'
    // },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0
    },
    cursor: 'pointer',
    '& tr': {
      border: '1px solid #f0f0f0'
    },
    '&:hover': {
      backgroundColor: '#F0F0F0'
    }
  }))

  return (
    <Box component={'div'}>
      {handleChangeParams && (
        // @ts-ignore
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
          <TableContainer {...tableContainerProps}>
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
                                  ? bgColorMonth2(index)
                                  : grey[200]
                                : bgColorMonth2(index),
                              minWidth: 125,
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
                              <Stack direction="row" sx={{ ...styleHeaderTable }}>
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
                              title={t('sort')}
                              active={column.isSorted}
                              // react-table has a unsorted state which is not treated here
                              direction={column.isSortedDesc ? 'desc' : 'asc'}
                              hideSortIcon={column.id === '_selector' || column.id === '__action'}
                              sx={{
                                minWidth: column.id === '__action' ? '50px' : '0px',
                                ...cellHeaderProps?.style
                              }}
                            >
                              <Stack direction="row" sx={{ ...styleHeaderTable }}>
                                {column.render('Header')}
                              </Stack>
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
                    <StyledTableRow
                      onClick={() => hasRowClick && onRowClick(row)}
                      hasRowClick={hasRowClick}
                      // hover
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
                          <StyledTableCell
                            hasCellClick={hasCellClick}
                            onClick={() => onCellClick?.(cell as any)}
                            key={index}
                            variant="body"
                            {...getCellProps}
                            sx={{
                              paddingX: 1,
                              minWidth:
                                cell.column.id === '__action' ||
                                cell.column.id === 'selection' ||
                                cell.column.id === 'STT' ||
                                cell.column.id === 'No'
                                  ? 'fit-content'
                                  : 200,
                              ...stickyFirstCol(index, TypeCell.Body, selection, isTableCalendar)
                            }}
                          >
                            <Tooltip
                              arrow
                              PopperProps={{
                                sx: {
                                  ...stylePaperPropTooltip
                                }
                              }}
                              placement="top"
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              //@ts-ignore
                              title={cell.column?.is_tooltip ? cell.render('Cell') : ''}
                            >
                              {
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                //@ts-ignore
                                cell.column?.is_long_text ? (
                                  <Box
                                    sx={{
                                      ...styleCellTableToolTip
                                    }}
                                  >
                                    {cell.render('Cell')}
                                  </Box>
                                ) : (
                                  <Box
                                    sx={{
                                      ...styleWidthCellTableTooltip,
                                      ml:
                                        cell.column.id === 'STT' || cell.column.id === 'No'
                                          ? 1.5
                                          : 0
                                    }}
                                  >
                                    {cell.render('Cell')}
                                  </Box>
                                )
                              }
                            </Tooltip>
                          </StyledTableCell>
                        )
                      })}
                    </StyledTableRow>
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
                  ...styleTableRowCell
                }}
              >
                <Box
                  sx={{
                    ...styleBoxPanigation
                  }}
                >
                  <Typography
                    sx={{
                      ...styleTypographyTotal
                    }}
                  >
                    {t('table.total_records')}: {total}
                  </Typography>
                  <Box>
                    <Pagination<T> instance={instance} />
                  </Box>
                </Box>
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
    </Box>
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

export { ReactTableManager }

const styleTypographyTotal = {
  fontSize: {
    xs: 12,
    sm: 16
  },
  minWidth: 100
}

const styleTableRowCell = {
  fontWeight: 500,
  minWidth: 125,
  lineHeight: '22px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  overflow: 'auto'
}

const styleCellTableToolTip = {
  width: 'fit-content',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '150px',
  fontSize: { xs: '14px', md: '16px' }
}

export const styleHeaderTable = {
  fontSize: { xs: '14px', sm: '16px' },
  fontWeight: 'bold'
}

const stylePaperPropTooltip = {
  '& .MuiTooltip-tooltip': {
    backgroundColor: '#243041',
    color: '#fff',
    borderRadius: '4px',
    fontSize: '14px',
    padding: '8px',
    maxWidth: '200px'
  },
  '& .MuiTooltip-arrow': {
    color: '#243041'
  }
}

const styleWidthCellTableTooltip = {
  width: 'fit-content',
  fontSize: { xs: '14px', md: '16px' }
}

const styleBoxPanigation = {
  display: 'flex',
  alignItems: { xs: 'flex-start', md: 'center' },
  justifyContent: 'space-between',
  flexDirection: { xs: 'column', md: 'inherit' },
  width: '100%'
}
