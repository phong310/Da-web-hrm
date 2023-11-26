//@ts-nocheck
import { List, ListItemIcon, Tooltip } from '@mui/material'
// import { makeStyles } from '@mui/styles'
import React from 'react'
import { Link } from 'react-router-dom'
import { drawerWidth } from '../Drawer'
import AppMenuItem from './AppMenuItem'
import { Route } from './Sidebar'
// import { useAuth } from 'lib/hooks'
// import { checkHasRole } from 'constants/roles'

type RouteType =
  | { label?: string; path?: string | undefined; children?: Route[] | undefined }
  | undefined

const AppMenu = ({
  items,
  expand,
  setExpand,
  open
}: {
  items?: RouteType[]
  expand: boolean[]
  setExpand: React.Dispatch<React.SetStateAction<boolean[]>>
  open: boolean
}) => {
  if (!expand) expand = []
  const classes = useStyles
  //   const { permissions, role } = useAuth()

  //   const checkHasPermission = (children: Array<string> | undefined) => {
  //     if (!permissions) {
  //       return false
  //     }

  //     return children?.every(
  //       ((i) => (c: string) => {
  //         return permissions.indexOf(c, i) !== -1
  //       })(0)
  //     )
  //   }

  const filterSidebar = (sidebarItems) => {
    const filteredItems = []
    for (const item of sidebarItems) {
      if (!item.children) {
        filteredItems.push(item)
      } else {
        // Tìm children có permissions hoặc role thỏa mãn
        const filteredChildren = item.children.filter((child) => {
          if (!!child.path) {
            return true
          } else if (child.role) {
            return checkHasRole(child.role, role)
          } else if (child.permissions) {
            return checkHasPermission(child.permissions)
          }
          return true
        })
        if (filteredChildren.length > 0) {
          const newItem = { ...item, children: filteredChildren }
          filteredItems.push(newItem)
        }
      }
    }
    return filteredItems
  }

  const filteredSidebar = filterSidebar(items)
  return (
    <List component="nav" sx={classes.appMenu} disablePadding>
      {open
        ? filteredSidebar?.map((item, index) => (
            <AppMenuItem
              {...item}
              key={index}
              index={index}
              expand={expand[index]}
              setExpand={setExpand}
              open={open}
            />
          ))
        : filteredSidebar.map((i, index) => (
            <List
              key={index}
              className="menu-list"
              component="div"
              disablePadding
              sx={{ ...styleList }}
            >
              {!!i.Icon && (
                <Link to={i.path}>
                  <Tooltip title={i.label} arrow placement="right">
                    <ListItemIcon sx={classes.menuItemIcon}>
                      <i.Icon sx={{ ...styleListIconItem }} />
                    </ListItemIcon>
                  </Tooltip>
                </Link>
              )}
            </List>
          ))}
    </List>
  )
}

AppMenu.defaultProps = {
  expand: () => null,
  setExpand: () => null
}

const useStyles = {
  appMenu: {
    width: drawerWidth
  },
  navList: {
    width: drawerWidth
  },
  menuItem: {
    width: drawerWidth
  },
  menuItemIcon: {
    minWidth: 0,
    justifyContent: 'center',
    color: '#000',
    borderRadius: 8,
    padding: '18px 15px 18px 18px ',
    '&.active': {
      color: '#404DA8',
      background: 'rgba(89, 195, 255, 0.1)'
    },
    '&:hover': {
      background: 'rgba(89, 195, 255, 0.1)',
      cursor: 'pointer',
      color: '#000',
      '& .MuiListItemIcon-root': {
        color: '#F89E49'
      }
    },
    '& .MuiListItemIcon-root': {
      minWidth: 35
    }
  }
}

const styleList = {
  marginLeft: '16px'
}

const styleListIconItem = {
  fontSize: '30px',
}

export default AppMenu
