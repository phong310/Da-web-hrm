import {
  Pagination as MPagination,
  PaginationProps as MPaginationProps,
  TablePagination
} from '@mui/material'
import { ReactElement, useCallback } from 'react'
import { TableInstance } from 'react-table'
import TablePaginationActions from './PaginationAction'

type PaginationProps<T extends object> = {
  instance: TableInstance<T>
  type?: 'table' | 'normal'
  nPaginationProps?: MPaginationProps
}

function Pagination<T extends object>({
  instance,
  type = 'table',
  nPaginationProps
}: PaginationProps<T>): ReactElement {
  const {
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // Get the state from the instance
    state: { pageIndex, pageSize }
  } = instance

  const handleChangePage = useCallback(
    (_:any, newPage: number) => {
      if (newPage === pageIndex + 1) {
        nextPage()
      } else if (newPage === pageIndex - 1) {
        previousPage()
      } else {
        gotoPage(newPage)
      }
    },
    [gotoPage, nextPage, pageIndex, previousPage]
  )

  const handleChangeRowsPerPage = useCallback(
    (e:any) => {
      const newPageSize = Number(e.target.value)
      setPageSize(newPageSize)
      gotoPage(0)
    },
    [setPageSize, gotoPage]
  )

  const handleChangeNormalPage = (event: React.ChangeEvent<unknown>, value: number) => {
    gotoPage(value - 1)
  }

  return type === 'table' ? (
    <TablePagination
      rowsPerPageOptions={[10, 20, 30, 50, 100]}
      colSpan={instance.allColumns.length}
      count={pageCount}
      rowsPerPage={pageSize}
      page={pageIndex}
      SelectProps={{
        inputProps: {
          'aria-label': 'rows per page'
        },
        native: true
      }}
      sx={{
        overflow: 'unset',
        border: 'none',
        fontSize: {
          xs: '12px',
          sm: '16px'
        },
        '&.MuiTablePagination-root': {
          '.MuiTablePagination-displayedRows': {
            display: 'none',
            fontSize: {
              xs: '12px',
              sm: '16px'
            }
          },
          '.MuiTablePagination-selectLabel': {
            fontSize: {
              xs: '12px',
              sm: '16px'
            }
          }
        },
        '.MuiTablePagination-toolbar': {
          padding: 0
        }
      }}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      ActionsComponent={TablePaginationActions}
    />
  ) : (
    <MPagination //skip because type alway = 'tablek'
      count={Math.ceil(pageCount / pageSize)}
      color="primary"
      page={pageIndex + 1}
      onChange={handleChangeNormalPage}
      {...nPaginationProps}
    />
  )
}

export { Pagination }
