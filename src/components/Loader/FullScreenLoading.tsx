import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

function FullScreenLoading() {
  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}
    >
      <CircularProgress />
    </Box>
  )
}

export { FullScreenLoading }
