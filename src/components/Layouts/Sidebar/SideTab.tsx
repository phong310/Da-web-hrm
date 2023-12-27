import i18n from 'lib/lang/translations/i18n'
import * as React from 'react'
import { matchPath, useLocation, useNavigate, useSearchParams } from 'react-router-dom'

// import { useHistory } from 'lib/hooks'
import { useTranslation } from 'react-i18next'
import { Route } from './Sidebar'
import {
  sidebarApp,
  sidebarEmployeeManagement,
  sidebarTimeKeeping,
  sidebarTimekeepingManager
} from './SidebarList'
import { useAtom } from 'jotai'
import { useHistory } from 'lib/hook/useHistory'
import { initialSearchParams, searchParamsAtom } from 'lib/atom/searchAtom'
import NavTreeTab from './v2/NavTreeTab'

const sidebarAppManager = [
  {
    label: i18n.t('application_management.leave_management'),
    path: '/applications/leave-form'
  },
  {
    label: i18n.t('application_management.overtime_management'),
    path: '/applications/overtimes'
  },
  {
    label: i18n.t('application_management.request_change_timesheet_management'),
    path: '/applications/request-change-timesheets'
  },
  {
    label: i18n.t('application_management.compensatory_leave_management'),
    path: '/applications/compensatory-leaves'
  }
]

const SideTab = () => {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [sidebar, setSidebar] = React.useState<Route[]>([])
  const { push } = useHistory()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const tabItems = [
    {
      label: t('menu.timekeeping'),
      display: true,
      path: '/time-keeping/timekeeping',
      handleClick: () => {
        navigate('/time-keeping/timekeeping')
      }
    },
    {
      label: t('menu.my_application'),
      display: true,
      path: '/applications/leave-form'
    },
    {
      label: t('menu.abbreviation.management_timekeeping'),
      display: true,
      path: '/time-keeping/manager'
    },
    {
      label: t('menu.abbreviation.management'),
      display: true,
      path: '/applications/manager/leave-form'
    }
  ]
  // @ts-ignore
  const [value, setValue] = React.useState(0)
  const [, setSearchParams] = useAtom(searchParamsAtom)
  React.useEffect(() => {
    const path = `${location.pathname}?${searchParams.toString()}`
    push(path)

    switch (true) {
      case path.indexOf('/time-keeping/timekeeping') > -1:
        setSidebar(sidebarTimeKeeping)
        break
      case path.indexOf('/time-keeping/manager') > -1:
        setSidebar(sidebarTimekeepingManager)
        break
      case path.indexOf('/applications/manager') > -1:
        setSidebar(sidebarAppManager)
        break
      case path.indexOf('/applications') > -1:
        setSidebar(sidebarApp)
        break
      case path.indexOf('/employees') > -1:
        setSidebar(sidebarEmployeeManagement)
        break
      default:
        setSidebar(sidebarTimeKeeping)
    }

    tabItems.forEach((value, index) => {
      if (matchPath(value.path, path)) {
        setValue(index)
        return
      }
    })
    setSearchParams(initialSearchParams)
  }, [location.pathname])

  const filtered = sidebar
    .map((route) => route)
    .filter((route) => route)
    .filter((route) => (route?.children ? route.children.length > 0 : true))
  const [expand, setExpand] = React.useState<boolean[]>(() =>
    [...filtered, 'last'].map(() => false)
  )

  React.useEffect(() => {
    setExpand([...filtered, 'last'].map(() => false))
  }, [filtered.length])

  return <NavTreeTab items={filtered} expand={expand} setExpand={setExpand} open={true} />
}

export default SideTab
