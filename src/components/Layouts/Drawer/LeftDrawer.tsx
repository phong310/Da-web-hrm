import { Hidden } from '@mui/material'
import { default as Drawer, default as MuiDrawer } from '@mui/material/Drawer'
import { CSSObject, styled, Theme } from '@mui/material/styles'
import Logo from '../../../assets/images/logo.png'
export const drawerWidth = 320

export const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}))

type PropsType = {
  open: boolean
  setOpen: () => void
  children: any
}

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden'
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 29px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 29px)`
  }
})

const CustomDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    overflowY: 'auto',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme)
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme)
    })
  })
)

const DrawerLeft: React.FC<PropsType> = ({ children, open, setOpen }) => {
  return (
    <>
      <Hidden mdDown>{DesktopDrawer(children, open)}</Hidden>
      <Hidden mdUp>{MobileDrawer(children, open, setOpen)}</Hidden>
    </>
  )
}

const DesktopDrawer = (children: React.ReactNode, open: boolean) => {
  return (
    <>
      <CustomDrawer open={open} variant="permanent">
        {children}
      </CustomDrawer>
    </>
  )
}

const MobileDrawer = (children: React.ReactNode, open: boolean, setOpen: () => void) => {
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          border: 'none'
        }
      }}
      elevation={0}
      anchor="left"
      open={open}
      onClose={setOpen}
    >
      <DrawerHeader>
        <img src={Logo} alt="logo" />
      </DrawerHeader>
      {children}
    </Drawer>
  )
}

export { DrawerLeft }
