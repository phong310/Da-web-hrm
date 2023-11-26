import MenuIcon from '@mui/icons-material/Menu'
import { AppBar, Box, Grid, IconButton, Stack, styled, Toolbar } from '@mui/material'
import Logo from '../../../assets/images/logo.png'

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { drawerWidth } from '../Drawer'
import { PropsType } from './Header'
import { LanguageHeader } from './LanguageHeader'
// import { NavLinkHeader } from './NavLinkHeader'
// import { Notification } from './v2/Notification'
// import ProfileHeader from './v2/ProfileHeader'
import { CustomBreadCrumbs } from '../../BreadCrumbs/CustomBreadCrumbs'
import { allPermissions, Permissions } from '../../../constants/permissions'
import { Notification } from './Notification'
import {ProfileHeader} from './ProfileHeader'

const DesktopHeader: React.VFC<PropsType> = ({ triggerSidebar }) => {
  const { t } = useTranslation()

  const applicationRoutes = [
    {
      name: t('menu.my_application'),
      path: '/applications/leave-form',
      permissions: []
    },
    {
      name: t('menu.management'),
      path: '/applications/manager/leave-form',
      permissions: [
        allPermissions.overtime_manage,
        allPermissions['request-change-timesheets_manage'],
        allPermissions['leave-form_manage'],
        allPermissions.compensatory_leave_manage
      ]
    },
    {
      name: t('menu.employee_application'),
      path: '/applications/leave-form/all',
      permissions: []
    }
  ]

  const timekeepingRoutes = [
    {
      name: t('menu.timekeeping'),
      path: '/time-keeping/timekeeping',
      permissions: []
    },
    {
      name: t('menu.management_timekeeping'),
      path: '/time-keeping/manager/timesheet',
      permissions: [Permissions.requestChangeTimesheetsManage]
    }
  ]

  const employeeManagementRoutes = [
    {
      name: t('menu.employee_management'),
      path: '/employees/manager',
      permissions: [allPermissions.employees_manage]
    },
    {
      name: t('menu.labor_contract'),
      path: '/employees/labor-contract/list-contract',
      permissions: [allPermissions.employees_manage]
    },
    {
      name: t('salary.salary_managerment'),
      path: '/employees/salary-managerment/salaries',
      permissions: [allPermissions.employees_manage]
    }
  ]

  const navLinks = [
    {
      title: t('menu.timekeeping'),
      childRoutes: timekeepingRoutes,
      matchRoute: '/time-keeping'
    },
    {
      title: t('menu.application'),
      childRoutes: applicationRoutes,
      matchRoute: '/application'
    },
    // {
    //   title: t('menu.labor_contract'),
    //   childRoutes: laborContractRoute,
    //   matchRoute: '/labor-contract'
    // },
    {
      title: t('menu.employee_management'),
      childRoutes: employeeManagementRoutes,
      matchRoute: '/employees'
    }
  ]

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ pl: 0, zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#fff' }}
        elevation={0}
      >
        <Toolbar>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item sm={8} lg={8.5}>
              <Stack direction="row" alignItems="center">
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-around"
                  sx={{ width: drawerWidth }}
                >
                  <Link to="/">
                    <LogoImg src={Logo} alt="logo" />
                  </Link>

                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={triggerSidebar}
                    edge="start"
                  >
                    <MenuIcon color="primary" />
                  </IconButton>
                </Stack>
                <CustomBreadCrumbs />
              </Stack>
            </Grid>

            {/* <Grid item md={7.5} lg={8}>
              <Stack
                direction="row"
                spacing={5}
                ml={8}
                sx={{
                  ml: {
                    md: 10,
                    lg: 8
                  }
                }}
              >
                {navLinks.map((navLink) => (
                  <NavLinkHeader
                    key={navLink.matchRoute}
                    childRoutes={navLink.childRoutes}
                    matchRoute={navLink.matchRoute}
                  >
                    {navLink.title}
                  </NavLinkHeader>
                ))}
              </Stack>
            </Grid> */}
            <Grid item sm={4} lg={3.5}>
              <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1}>
                <LanguageHeader />
                <Notification />
                <ProfileHeader />
              </Stack>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  )
}

const LogoImg = styled('img')(({ theme }) => ({
  height: theme.spacing(4),
  lineHeight: theme.spacing(2)
}))

export { DesktopHeader }
