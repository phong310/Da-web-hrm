import {
  styled,
  TableCell,
  tableCellClasses,
  TableRow,
  tableRowClasses,
  TableSortLabel
} from '@mui/material'

// const Cell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: theme.palette.grey[300],
//     fontWeight: 'bold'
//   },
//   [`&.${tableCellClasses.body}`]: {
//     borderColor: theme.palette.grey[200]
//   }
// }))

const Cell = styled(TableCell, {
  shouldForwardProp: (prop) => prop !== 'hasCellClick'
})<{ hasCellClick?: boolean }>(({ theme, hasCellClick }) => ({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  [`&.${tableCellClasses.hover}`]: {
    cursor: hasCellClick ? 'pointer' : 'auto',
    '&$hover:hover': {
      backgroundColor: theme.palette.grey[100],
      '& td': {
        backgroundColor: theme.palette.grey[100]
      }
    }
  },
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#F0F0F0',
    fontWeight: 'bold'
  },
  [`&.${tableCellClasses.body}`]: {
    borderColor: theme.palette.grey[200]
  }
}))

const CalendarCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.grey[300],
    fontWeight: 'bold'
  }
}))

const StickyLeftCell = styled(Cell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    left: 0,
    position: 'sticky',
    zIndex: 1102,
    backgroundColor: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    left: 0,
    position: 'sticky',
    zIndex: 1101,
    backgroundColor: theme.palette.common.white
  }
}))

const StickyRightCell = styled(Cell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    right: 0,
    position: 'sticky',
    zIndex: 1102,
    backgroundColor: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    right: 0,
    position: 'sticky',
    zIndex: 1101,
    backgroundColor: theme.palette.common.white
  }
}))

const CellInSticky = styled(Cell)({
  padding: 0,
  margin: 0,
  border: 'none'
})

const Row = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== 'hasRowClick'
})<{ hasRowClick?: boolean }>(({ theme, hasRowClick }) => ({
  [`&.${tableRowClasses.hover}`]: {
    cursor: hasRowClick ? 'pointer' : 'auto',
    '&$hover:hover': {
      backgroundColor: theme.palette.grey[100],
      '& td': {
        backgroundColor: theme.palette.grey[100]
      }
    }
  }
}))

const SortLabel = styled(TableSortLabel)({})

export { Cell, StickyLeftCell, StickyRightCell, CellInSticky, Row, SortLabel, CalendarCell }
