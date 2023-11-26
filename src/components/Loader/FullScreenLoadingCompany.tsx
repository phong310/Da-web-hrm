import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

function FullScreenLoadingCompany() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(0px)',
        zIndex: 9999
      }}
    >
      <CircularProgress size={80} />
    </Box>
  )
}

export { FullScreenLoadingCompany }
