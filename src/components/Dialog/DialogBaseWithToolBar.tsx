import { AppBar, Dialog, DialogContent, DialogProps, Toolbar, Typography } from '@mui/material'
import { SxProps } from '@mui/system'

type PropType = DialogProps & {
  title?: string
  contentSx?: SxProps
  handleAccept?: () => void
}

const DialogBaseWithToolBar: React.VFC<PropType> = ({
  open,
  title,
  onClose,
  children,
  contentSx,
  maxWidth,
  ...props
}) => {
  return (
    <Dialog
      PaperProps={{ elevation: 2 }}
      open={open}
      maxWidth={maxWidth}
      fullWidth
      keepMounted
      {...props}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          {/* <IconButton
            edge="start"
            color="inherit"
            onClick={onClose as () => void}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton> */}

          <Typography sx={{ flex: 1, fontSize: '16px' }} variant="h6" component="div">
            {title}
          </Typography>
        </Toolbar>
      </AppBar>

      <DialogContent sx={{ p: 3, pb: 0, ...contentSx }}>{children}</DialogContent>
    </Dialog>
  )
}

export { DialogBaseWithToolBar }
