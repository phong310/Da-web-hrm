import {
    Box,
    ClickAwayListener,
    PaginationProps,
    StackProps,
    Typography
} from '@mui/material';
import { RoundPaper } from 'components/Layouts/Page/RoundPaper';
import { EmptyTable } from 'components/ReactTable/EmptyTable';
import { Pagination } from 'components/ReactTable/Pagination/Pagination';
import { TableSkeleton } from 'components/Skeleton/TableSkeleton';
import { PaginationMeta } from 'lib/hook/usePaginationQuery';
import { useVirtualizedTable } from 'lib/hook/useVirtualizedTable';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, ColumnProps, Table, TableProps } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once
import { TimesheetColorNote } from 'screen/timesheet/TimeSheetColorNote';

type TableDataType = {
  label: string | React.ReactNode
} & ColumnProps

type TableColumnType = ColumnProps[]
export interface BaseReactVirtualizedTableProps extends TableProps {
  width: number
  height: number
  rowCount: number
  headerHeight: number
  rowHeight: number
  data: any
  columns: ColumnProps[]
  onClickAway?(): void
  onRowClick?: (rowData: any) => void
  onCellClick?: (cellData: any) => void
  nPaginationContainerProps?: StackProps
  nPaginationProps?: PaginationProps
  pageCount: number
  total: number
  handleChangePagination?(paginationMeta: PaginationMeta): void
}

export const BaseReactVirtualizedTablev2 = (props: BaseReactVirtualizedTableProps) => {
  const {
    width,
    height,
    rowCount,
    headerHeight,
    rowHeight,
    data,
    loading,
    pageCount,
    total,
    columns,
    onRowClick,
    onClickAway = () => undefined,
    handleChangePagination,
    rowGetter,
    paginationType = 'table',
    nPaginationContainerProps,
    nPaginationProps
  } = props

  const { t } = useTranslation()
  const instance: any = useVirtualizedTable({
    columns: columns,
    data: data,

    pageCount: pageCount
  })

  const {
    state: { pageIndex, pageSize }
  } = instance

  // Xử lý phân trang
  useEffect(() => {
    if (typeof handleChangePagination === 'function') {
      handleChangePagination({ page: pageIndex + 1, per_page: pageSize })
    }
  }, [handleChangePagination, pageIndex, pageSize])
  return (
    <Box>
      {loading && !data.length ? (
        <TableSkeleton />
      ) : !loading && !data.length ? (
        <EmptyTable />
      ) : (
        <ClickAwayListener onClickAway={onClickAway}>
          <RoundPaper elevation={0} sx={{ ...styleCalendar }}>
            <Box style={{ display: 'flex', width: '100%' }}>
              {/* First column table */}
              <Box style={{ ...styleColumnsFirst }}>
                <Table
                  width={250}
                  height={70 * (data.length + 1) || 500}
                  headerHeight={headerHeight || 70}
                  rowHeight={rowHeight || 70}
                  rowCount={data.length || 10}
                  rowGetter={({ index }) => (data.length ? data[index] : 0)}
                >
                  <Column
                    label={columns[0].label}
                    dataKey={columns[0].dataKey}
                    width={columns[0].width}
                    headerStyle={columns[0].headerStyle}
                    style={columns[0].style}
                    cellRenderer={columns[0].cellRenderer}
                  />
                </Table>
              </Box>
              {/* Scrollable columns table */}
              <Box sx={{ ...styleCalendar, flex: '1' }}>
                <Box style={{ overflowX: 'auto', width: '100%' }}>
                  <Table
                    width={width - 250}
                    height={70 * (data.length + 1) || 500}
                    headerHeight={headerHeight || 70}
                    rowHeight={rowHeight || 70}
                    rowCount={data.length || 10}
                    rowGetter={({ index }) => (data.length ? data[index] : 0)}
                  >
                    {columns.slice(1).map((item) => (
                      <Column
                        label={item.label}
                        dataKey={item.dataKey}
                        width={item.width}
                        headerStyle={item.headerStyle}
                        style={item.style}
                        cellRenderer={item.cellRenderer}
                        key={item.dataKey}
                      />
                    ))}
                  </Table>
                </Box>
              </Box>
            </Box>
          </RoundPaper>
        </ClickAwayListener>
      )}

      <Box sx={{ backgroundColor: 'white' }}>
        {' '}
        <Box
          sx={{
            padding: '24px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {' '}
          <TimesheetColorNote />
        </Box>
        {/* pagination area */}
        <Box {...nPaginationContainerProps} sx={{ ...styleBoxPagi }}>
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
          <Pagination
            type={paginationType}
            instance={instance as any}
            nPaginationProps={nPaginationProps}
          />
        </Box>
      </Box>
    </Box>
  )
}

const styleCalendar = {
  '& ::-webkit-scrollbar': { width: 2, height: 8 },
  '& ::-webkit-scrollbar-thumb': {
    backgroundColor: '#f0f0f0'
  },
  width: '100%',
  overflow: 'auto'
}

const styleBoxPagi = {
  display: { xs: 'block', md: 'flex' },
  padding: '24px 0 16px 12px',
  justifyContent: 'space-between',
  alignItems: 'center',
  overflow: 'auto'
}

const styleColumnsFirst = {
  flex: '0 0 auto',
  width: '250px',
  overflow: 'hidden'
}
