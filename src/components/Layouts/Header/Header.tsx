import { useMediaQuery, useTheme } from '@mui/material'
import React from 'react'
import { DesktopHeader } from './DesktopHeader'
import { MobileHeader } from './MobileHeader'
import { UnknownObj } from '../../../lib/types/utils'

export type PropsType = {
  triggerSidebar: () => void
}

export type ReponsiveHeaderPropsType = {
  triggerSidebar: () => void
  notifications: Notification[]
  unreadCount: number
  handleChangeParams: (newParams: UnknownObj) => void
  markAsRead: (id: string) => Promise<void>
}

const Header: React.VFC<PropsType> = ({ triggerSidebar }) => {
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <>
      {hidden ? (
        <DesktopHeader triggerSidebar={triggerSidebar} />
      ) : (
        <MobileHeader triggerSidebar={triggerSidebar} />
      )}
    </>
  )
}

export { Header }
