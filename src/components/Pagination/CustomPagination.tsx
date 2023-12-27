import { Box, Pagination } from '@mui/material'

type CustomPaginationProps = {
  onChange: any
  pageCount?: number
}
const CustomPagination = ({ onChange, pageCount }: CustomPaginationProps) => {
  // @ts-ignore
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    onChange(value)
  }

  return (
    <Box>
      <Pagination count={pageCount} showFirstButton showLastButton onChange={handleChange} />
    </Box>
  )
}

export { CustomPagination }
