import { Badge, IconButton } from '@mui/material'
import BellIcon from 'assets/svgs/navbar-icons/bell.svg'

export const Notification = () => {
  return (
    <IconButton>
      <Badge color="error">
        <img src={BellIcon} alt="" />
      </Badge>
    </IconButton>
  )
}
