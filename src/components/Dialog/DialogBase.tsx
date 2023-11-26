import CloseIcon from '@mui/icons-material/Close'
import {
  AppBar,
  Dialog,
  DialogContent,
  DialogProps,
  IconButton,
  Toolbar,
  Typography
} from '@mui/material'
import { SxProps } from '@mui/system'

type PropType = DialogProps & {
  title?: string
  contentSx?: SxProps
  handleAccept?: () => void
  defaultAction?: boolean
}

const DialogBase: React.VFC<PropType> = ({
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
      sx={{
        ...styleDialog
      }}
      {...props}
    >
      <AppBar sx={{ ...styleAppBar }}>
        <Toolbar>
          <Typography sx={{ ...styleTitle }} variant="h6" component="div">
            {title}
          </Typography>
          <IconButton
            sx={{ mr: 0 }}
            edge="start"
            color="inherit"
            onClick={onClose as () => void}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <DialogContent
        sx={{
          pb: 0,
          ...contentSx,
          '&.MuiDialogContent-root': {
            padding: 0
          }
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  )
}

const styleDialog = {
  '& .MuiDialog-container': {
    '& .MuiPaper-root': {
      width: 'auto',
      minWidth: { sm: '400px' }
    }
  }
}

const styleAppBar = {
  position: 'relative',
  '&.MuiAppBar-root': {
    paddingRight: '0 !important'
  }
}
const styleTitle = {
  flex: 1,
  fontSize: '16px'
}

export { DialogBase }
