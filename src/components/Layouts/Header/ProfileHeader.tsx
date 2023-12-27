//@ts-nocheck
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import ContactPageIcon from '@mui/icons-material/ContactPage'
import { atom } from 'jotai'
import {
  Box,
  Hidden,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  styled,
  SvgIcon
} from '@mui/material'
import { DialogBase } from '../../Dialog/DialogBase'
import { useAtom } from 'jotai'
import { useAuth } from 'lib/hook/useAuth'
import { MouseEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Divider from '@mui/material/Divider'
import LockIcon from '@mui/icons-material/Lock'
import { AvatarCustom } from '../../Form/Components/AvatarCustom'
import { AVATAR_SIZE } from 'lib/utils/contants'
import { Setting } from 'screen/profile/Setting'

export const avatarProfile = atom<File | null>(null)
export const updateName = atom('')

export const ProfileHeader = () => {
  const navigate = useNavigate()
  const { logout, auth, user } = useAuth()
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const [openDialog, setOpenDialog] = useState<boolean>(false)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    try {
      if (auth) {
        await logout()
        handleClose()
        navigate('/login')
      }
    } catch (error) {
    }
  }

  // const onProfileClick = () => {
  //   navigate('/general/profile')
  //   handleClose()
  // }

  // const onSettingClick = () => {
  //   navigate('/general/setting')
  //   handleClose()
  // }

  const handleChangePasswod = () => {
    setOpenDialog(true)
    handleClose()
  }
  const handleCloseDialog = () => {
    setOpenDialog(false)
  }
  const [avatar, setAvatar] = useAtom(avatarProfile)
  const [name, setName] = useAtom(updateName)

  return (
    <Box sx={{ ...styleBoxContainer }}>
      {user && (
        <Hidden mdDown>
          <UserName>{name ? name : `${user?.employee?.personal_information.full_name}`}</UserName>
        </Hidden>
      )}
      <IconButton
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{
          ...styleIconButton
        }}
      >
        <AvatarCustom
          thumbnail_url={
            avatar ? URL.createObjectURL(avatar) : user?.employee.personal_information.thumbnail_url
          }
          size={AVATAR_SIZE.ORDINARY}
          alt="AvatarHeader"
        />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{ ...styleMenu }}
        PaperProps={{
          sx: {
            ...styleContainerMenu
          }
        }}
      >
        <MenuItem onClick={() => navigate('/general/profile')}>
          <ListItemIcon>
            <SvgIcon>
              <AccountCircleIcon sx={{ ...styleIcon }} />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText>{t('setting.profile')}</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => navigate('/individual-contract/list')}>
          <ListItemIcon>
            <SvgIcon>
              <ContactPageIcon sx={{ ...styleIcon }} />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText>{t('labor_contract.name')}</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleChangePasswod}>
          <ListItemIcon>
            <SvgIcon>
              <LockIcon sx={{ ...styleIcon }} />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText>{t('setting.change_password')}</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <SvgIcon>
              <LogoutIcon sx={{ ...styleIcon }} />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText>{t('profile.logout')}</ListItemText>
        </MenuItem>
      </Menu>
      <DialogBase
        title={t('setting.change_password')}
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
      >
        <Setting />
      </DialogBase>
    </Box>
  )
}

const UserName = styled('p')(() => ({
  minWidth: '100px',
  color: '#000',
  textAlign: 'center',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
}))

const styleMenu = {
  mt: { xs: '10px', md: 'unset' }
}

const styleContainerMenu = {
  borderRadius: '12px',
  width: { lg: '230px' },
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

const styleIconButton = {
  padding: '0',
  margin: '0',
  '&:hover': {
    boxShadow: 'none',
    backgroundColor: '#ffffff'
  }
}

const styleIcon = {
  width: '24px',
  height: '24px'
}

const styleBoxContainer = {
  display: 'flex',
  gap: 1
}
