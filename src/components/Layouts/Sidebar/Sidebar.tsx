import { Box, Hidden, Stack, SvgIconProps, Toolbar } from '@mui/material'
// import { LanguageHeader } from 'components/Layouts/Header'

import { useEffect, useState } from 'react'
import NavTree from './NavTree'
import { DrawerLeft } from '../Drawer'
import { checkHasRole } from '../../../constants/roles'
import { useAuth } from '../../../lib/hook/useAth'
import { LanguageHeader } from '../Header/LanguageHeader'
export type Route = {
  label?: string
  path?: string
  children?: Route[]
  Icon?: (props: SvgIconProps) => JSX.Element
  Icon_active?: (props: SvgIconProps) => JSX.Element
  permissions?: string[]
  role?: string
}
type PropsType = {
  isSidebarOpen: boolean
  triggerSidebar: () => void
  sidebar: Route[]
}
const Sidebar: React.VFC<PropsType> = ({ isSidebarOpen, triggerSidebar, sidebar }) => {
  const { permissions, role } = useAuth()
  const checkHasPermission = (children: Array<string> | undefined) => { 
    if (!permissions) {
      return false
    }
    return children?.every(
      ((i) => (c: string) => {
        return permissions.indexOf(c, i) !== -1
      })(0)
    )
  }
  const filtered = sidebar.filter((route) => {
    const hasAnyPermission = route && route.permissions
    const hasAnyRole = route && route.role
    const hasPermission = hasAnyPermission ? checkHasPermission(route.permissions) : true
    const hasRole = hasAnyRole ? checkHasRole(route.role, role) : true
    const hasChildren = route?.children ? route.children.length > 0 : true
    return hasPermission && hasChildren && hasRole
  })
  const [expand, setExpand] = useState<boolean[]>(() => [...filtered, 'last'].map(() => false))
  useEffect(() => {
    setExpand([...filtered, 'last'].map(() => false))
  }, [filtered.length])
  return (
    <>
      <DrawerLeft open={isSidebarOpen} setOpen={triggerSidebar}>
        <Toolbar sx={{ ...styleToolBar }} />
        {filtered?.length > 0 && (
          <Box sx={{ ...styleBoxNavTree }}>
            <NavTree items={filtered} expand={expand} setExpand={setExpand} open={isSidebarOpen} />
            <Hidden mdUp>
              <Stack sx={{ ...styleStack }}> <LanguageHeader /> </Stack>
            </Hidden>
          </Box>
        )}
      </DrawerLeft>
    </>
  )
}
const styleToolBar = {
  display: { xs: 'none', md: 'unset' }
}
const styleBoxNavTree = {
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column'
}
const styleStack = {
  position: 'absolute',
  bottom: '10px',
  left: 10
}
export { Sidebar }
