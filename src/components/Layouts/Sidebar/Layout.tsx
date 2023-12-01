import { Box, Hidden, styled, Tab, Tabs, Theme, Toolbar, useMediaQuery } from '@mui/material'
// import LeaveApplicationIcon from 'assets/svgs/sidebar-icons/application/leave_icon.svg?component'
// import OvertimeIcon from 'assets/svgs/sidebar-icons/application/overtime_icon.svg?component'
// import RequestChangeTimesheetIcon from 'assets/svgs/sidebar-icons/timekeeping/request_update_timekeeping_icon.svg?component'
// import { MessageAlert } from 'components/MessageAlert'
// import { Permissions } from '../../constants/permissions'
// import { useAuth, useHistory } from 'lib/hooks'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useNavigate } from 'react-router-dom'
// import { ModalTimekeepingReminderV2 } from 'screen/application/v2/ModalTimekeepingReminderV2'
import { blue } from '../../../styles/colors'
import { Header } from '../Header/Header'
import { Route } from './Sidebar'
import * as _ from 'lodash'
// import {
//   sidebarApp,
//   sidebarAppManager,
//   sidebarEmployeeManagement,
//   sidebarList,
//   sidebarTimekeepingManager
// } from '../Sidebar/v2/SidebarList'

import { sidebarList } from './SidebarList'
// import { initialSearchParams, searchParamsAtom } from 'lib/atom'
// import { useAtom } from 'jotai'
import Application from 'assets/svgs/sidebar-icons/application.svg'
import Manage_application from 'assets/svgs/sidebar-icons/manage_application.svg'
import Manage_timeKeeping from 'assets/svgs/sidebar-icons/manage_timeKeeping.svg'
import TimeKeeping from 'assets/svgs/sidebar-icons/TimeKeeping.svg'
import { Sidebar } from './Sidebar'
import { useAuth } from 'lib/hook/useAth'

const Layout: React.VFC = () => {
  // const { push, history } = useHistory()
  const isDesktop = useMediaQuery<Theme>((theme) => theme.breakpoints.up('md'), { noSsr: true })
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(isDesktop)
  const [sidebar, setSidebar] = useState<Route[]>([])
  const triggerSidebar = () => {
    setSidebarOpen(!isSidebarOpen)
  }
  // const location = useLocation()
  // console.log(location)

  // const [searchParams] = useSearchParams()
  const { t } = useTranslation()

  const { permissions } = useAuth()
  const hasManagePermission = _.values(Permissions).every((value:any) => {
    return permissions?.includes(value)
  })
  const navigate = useNavigate()

  const [value, setValue] = React.useState(0)
  const tabItems = [
    {
      label: 'Thời gian biểu',
      display: true,
      path: '/time-keeping/timekeeping',
      Icon: <img src={TimeKeeping} />,
      handleClick: () => {
        navigate('/time-keeping/timekeeping')
      }
    },
    {
      label: 'Đơn của tôi',
      display: true,
      path: '/applications/leave-form',
      Icon: <img src={Application} />
    },
    {
      label: t('menu.abbreviation.management_timekeeping'),
      display: hasManagePermission,
      path: '/time-keeping/manager/timesheet',
      Icon:<img src={Manage_timeKeeping} />,
    },
    {
      label: t('menu.abbreviation.management'),
      display: hasManagePermission,
      path: '/applications/manager/leave-form',
      Icon: <img src={Manage_application} />
    }
  ]
  // const [setSearchParams] = useAtom(searchParamsAtom)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    navigate(tabItems[newValue].path)
  }
  return (
    <>
      <Box sx={{ display: 'flex' }} bgcolor="background.default">
        <Header triggerSidebar={triggerSidebar} />

        <Sidebar
          isSidebarOpen={isSidebarOpen}
          triggerSidebar={triggerSidebar}
          sidebar={sidebarList}
        />
        {/* )} */}
        <Main open={isSidebarOpen}>
          <Toolbar />
          <Outlet />
        </Main>

        {/* <MessageAlert /> */}
      </Box>
      <Hidden mdUp>
        <CustomTabs
          value={value}
          onChange={handleChange}
          aria-label="icon tabs example"
          sx={{
            zIndex: 100,
            position: 'sticky',
            bottom: 0,
            width: '100%',
            backgroundColor: 'white',
            boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.05)',
            '& [aria-label="icon tabs example"]': {
              justifyContent: 'space-around !important'
            },
            '& .css-12sna7q-MuiTabs-indicator': {
              display: 'none'
            },
            '& .css-17b9t07': {
              display: 'none'
            }
          }}
        >
          {tabItems.map((tab, index) =>
            tab.display ? (
              <Tab
                onClick={tab?.handleClick}
                key={index}
                aria-label={tab.label}
                icon={<BoxWrapIcon active={index === value}>{tab.Icon}</BoxWrapIcon>}
                label={
                  <span
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: '100%'
                    }}
                  >
                    {tab.label}
                  </span>
                }
                sx={{
                  padding: { xs: ' 6px 3px', sm: 'initial' },
                  textTransform: 'unset',
                  fontSize: { xs: '10px', sm: 'initial' },
                  width: '25vw'
                }}
              />
            ) : null
          )}
        </CustomTabs>
      </Hidden>

      {/* <ModalTimekeepingReminderV2 /> */}
    </>
  )
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'isSidebarOpen' })<{
  open?: boolean
}>(({ theme, open = true }) => ({
  backgroundColor: theme.palette.background.default,
  flexGrow: 1,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflow: 'hidden',
  minHeight: '100vh',
  width: 'calc(100% - 260px)',
  paddingTop: theme.spacing(1),

  ...(useMediaQuery(theme.breakpoints.up('md'), { noSsr: true }) && {
    // marginLeft: `-${drawerWidth}px`,
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1)
  }),

  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  })
}))

const CustomTabs = styled(Tabs)({
  '& .MuiTabs-flexContainer css-heg063-MuiTabs-flexContainer': {
    alignItem: 'baseline'
  }
})

const BoxWrapIcon = styled(Box, { shouldForwardProp: (prop) => prop !== 'active' })<{
  active: boolean
}>(({ theme, active }) => ({
  borderRadius: '30%',
  padding: '10px',
  backgroundColor: active ? blue[10] : 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))
export { Layout }
