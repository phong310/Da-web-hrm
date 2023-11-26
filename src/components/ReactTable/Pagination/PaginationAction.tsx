import FirstPageIcon from '@mui/icons-material/FirstPage'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import LastPageIcon from '@mui/icons-material/LastPage'
import { Pagination } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import * as React from 'react'

interface TablePaginationActionsProps {
  count: number
  page: number
  rowsPerPage: number
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const { count, page, rowsPerPage, onPageChange } = props

  const [currentPage, setCurrentPage] = React.useState(props.page)
  const [isPage, setIsPage] = React.useState<boolean>(true)

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isPage) {
      onPageChange(event, 0)
      setCurrentPage(1)
    } else {
      onPageChange(event, 0)
      setCurrentPage(0)
    }
  }

  React.useEffect(() => {
    isPage ? setCurrentPage(0) : setCurrentPage(1)
  }, [rowsPerPage])

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsPage(true)
    const backPage = page - 1
    onPageChange(event, backPage)
    setCurrentPage(backPage)
  }

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsPage(true)
    const nextPage = page + 1
    onPageChange(event, nextPage)
    setCurrentPage(nextPage)
  }

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isPage) {
      onPageChange(event, count - 1)
      setCurrentPage(count)
    } else {
      onPageChange(event, count - 1)
      setCurrentPage(count - 1)
    }
  }

  const handleChangePanigate = (event: React.ChangeEvent<unknown>, pageNumber: number) => {
    setIsPage(false)
    const newPage = pageNumber - 1
    onPageChange(event as React.MouseEvent<HTMLButtonElement, MouseEvent>, newPage)
    setCurrentPage(pageNumber)
  }

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5, display: 'flex', alignItems: 'center' }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        <KeyboardArrowLeft />
      </IconButton>
      <Pagination
        sx={{ '.MuiPagination-ul li button': { fontSize: { xs: '12px', md: '14px' } } }}
        count={count}
        hidePrevButton
        hideNextButton
        onChange={handleChangePanigate}
        page={isPage ? currentPage + 1 : currentPage}
      />
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= count - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= count - 1}
        aria-label="last page"
      >
        <LastPageIcon />
      </IconButton>
    </Box>
  )
}

export default TablePaginationActions
