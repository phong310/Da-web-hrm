// @ts-nocheck
import { Skeleton, Table, TableBody, TableContainer, TableHead } from '@mui/material'
import { Cell, Row } from 'components/ReactTable/StyledComponent'

export type TableSkeletonType = {
  row_number?: number
  col_number?: number
}

const TableSkeleton: React.VFC<TableSkeletonType> = ({ col_number = 4, row_number = 3 }) => {
  return (
    <TableContainer sx={{ mb: 10 }}>
      <Table size="small">
        <TableHead>
          <Row>
            {new Array(col_number).fill(0).map((el, idx) => (
              <Cell key={idx} size="medium">
                <Skeleton variant="text" />
              </Cell>
            ))}
          </Row>
        </TableHead>

        <TableBody>
          {new Array(row_number).fill(0).map((el, idx) => (
            <Row key={idx}>
              <Cell colSpan={col_number} size="medium">
                <Skeleton variant="text" />
              </Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export { TableSkeleton }
