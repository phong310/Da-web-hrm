import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import {
  Box,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography
} from '@mui/material'
import DeleteIcon from '../../../assets/svgs/delete.svg'
import EditIcon from '../../../assets/svgs/edit.svg'
import { t } from 'i18next'
import { memo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CellProps } from 'react-table'
import i18n from 'lib/lang/translations/i18n'
import { DialogBase } from 'components/Dialog/DialogBase'
import { UnknownObj } from 'lib/types/utils'
import { ActionColumnConfig } from '../ReactTable'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
import { CellContainer } from './CellContainer'


interface TableActionProps<T extends object> extends CellProps<T> {
  actionConfig?: ActionColumnConfig
  onActionEdit?(props: CellProps<T>): void
  onActionDelete?(props: CellProps<T>): void
  defaultActionEdit?: boolean
  titleDelete?: string
  titleDeleteAppBar?: string
}

const defaultConfig = {
  editText: i18n.t('button.edit'),
  deleteText: i18n.t('button.delete'),
  deleteConfirmText: i18n.t('title_delete'),
  needConfirm: true
}

export const TableActionContainer = <Stack onClick={(e) => e.stopPropagation()} />

function TableAction<T extends object>(props: TableActionProps<T>) {
  const {
    row,
    actionConfig,
    onActionEdit,
    onActionDelete,
    defaultActionEdit,
    titleDelete,
    titleDeleteAppBar
  } = props
  const { editText, deleteText, deleteConfirmText, needConfirm } = Object.assign(
    defaultConfig,
    actionConfig
  )

  const { original } = row
  const navigate = useNavigate()
  // const dialog = useDialog()
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [dialogTitle, setDialogTitle] = useState<string>('')
  const dialogFn = useRef<(props: CellProps<T, any>) => void>()

  const hasEdit = typeof onActionEdit === 'function'
  const hasDelete = typeof onActionDelete === 'function'

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const defaultEditAction = () => {
    navigate(`edit/${(original as UnknownObj).id}`)
  }

  const handleEdit = () => {
    if (hasEdit) {
      onActionEdit(props)
    } else {
      defaultEditAction()
    }
    handleClose()
  }

  const _delete = () => {
    if (hasDelete) {
      onActionDelete(props)
    }
  }

  const deleteConfirm = async () => {
    try {
      if (hasDelete) {
        // await dialog({ description: deleteConfirmText })
        setOpenDialog(true)
        if (titleDeleteAppBar) {
          setDialogTitle(titleDeleteAppBar)
        } else {
          setDialogTitle(deleteConfirmText)
        }
        dialogFn.current = onActionDelete
        // onActionDelete(props);
      }
    } catch (error) {}
  }

  const handleDelete = () => {
    if (needConfirm) {
      deleteConfirm()
    } else {
      _delete()
    }
    handleClose()
  }

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleAcceptDialog = () => {
    dialogFn.current && dialogFn.current(props)
    setOpenDialog(false)
  }

  const handleCloseModal = () => {
    setOpenDialog(false)
  }

  const deleteModalContent = (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h6"
        sx={{ fontSize: '16px' }}
        component="h2"
        id="modal-modal-description"
      >
        {titleDelete}
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={6} alignItems="center">
          <ButtonCommon error={true} variant="outlined" onClick={handleCloseModal}>
            {t('button.cancel')}
          </ButtonCommon>
        </Grid>
        <Grid item xs={6} alignItems="center">
          <ButtonCommon
            type="submit"
            variant="contained"
            sx={{ width: '100%', fontSize: '16px' }}
            onClick={handleAcceptDialog}
          >
            {t('button.delete')}
          </ButtonCommon>
        </Grid>
      </Grid>
    </Box>
  )

  return (
    <CellContainer direction="row" spacing={1}>
      <IconButton size="medium" onClick={handleOpenMenu}>
        <MoreHorizIcon fontSize="inherit" />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {!!(defaultActionEdit || hasEdit) && (
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
                <img src={EditIcon} alt="" />
            </ListItemIcon>
            <ListItemText>{editText}</ListItemText>
          </MenuItem>
        )}
        {hasDelete && (
          <MenuItem onClick={handleDelete}>
            <ListItemIcon>
                <img src={DeleteIcon} alt="" />
            </ListItemIcon>
            <ListItemText>{deleteText}</ListItemText>
          </MenuItem>
        )}
      </Menu>
      <DialogBase
        handleAccept={handleAcceptDialog}
        open={openDialog}
        title={dialogTitle}
        onClose={() => {
          setOpenDialog(false)
        }}
      >
        {deleteModalContent}
      </DialogBase>
    </CellContainer>
  )
}

export default memo(TableAction) as typeof TableAction
