import { Drawer, Grid, IconButton, Typography } from '@mui/material'
import { ReactChild, ReactFragment, ReactPortal } from 'react'
import { GridCloseIcon } from '@mui/x-data-grid'
import { Base, blueV2 } from 'styles/colors'
interface DrawerProps {
  title: string
  children: React.ReactNode | ReactChild | ReactFragment | ReactPortal
  open: boolean
  handleOpen: () => void
}

const DrawerAdmin: React.FC<DrawerProps> = ({ title, children, open, handleOpen }) => {
  return (
    <Drawer sx={{ zIndex: '10000' }} anchor="left" open={open} onClose={handleOpen}>
      <Grid container sx={{ ...styleContainer }} role="presentation">
        <Grid
          item
          xs={12}
          sx={{
            ...styleDrawser
          }}
        >
          <Typography sx={{ ...styleTitle }}>{title}</Typography>
          <IconButton edge="end" color="inherit" aria-label="close" onClick={handleOpen}>
            <GridCloseIcon sx={{ color: Base['white'] }} />
          </IconButton>
        </Grid>
        {children}
      </Grid>
    </Drawer>
  )
}
const styleContainer = {
  maxWidth: { sm: '400px', xs: '300px' }
}
const styleDrawser = {
  padding: '8px 16px',
  backgroundColor: blueV2[50],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}
const styleTitle = {
  ontSize: '16px',
  color: '#fff'
}
export { DrawerAdmin }
