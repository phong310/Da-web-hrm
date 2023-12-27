import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Collapse, Grid, List, ListItemIcon, ListItemText, SvgIconProps } from '@mui/material'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import AppMenuItemComponent from './AppMenuItemComponent'
import { Route } from './Sidebar'
import { useLocation } from 'react-router-dom'

export const AppMenuItemPropTypes = {
  name: PropTypes.string.isRequired,
  link: PropTypes.string,
  Icon: PropTypes.elementType,
  items: PropTypes.array
}

const AppMenuItem = (props: {
  level?: number
  label?: string
  path?: string
  Icon?: (props: SvgIconProps) => JSX.Element
  Icon_active?: (props: SvgIconProps) => JSX.Element
  children?: Route[]
  expand: boolean
  setExpand: React.Dispatch<React.SetStateAction<boolean[]>>
  index: number
  open?: boolean
}) => {
  const { label, path, Icon, Icon_active, children = [], expand, setExpand, index } = props
  const level = props.level || 0
  const indent = (() => {
    switch (level) {
      case 0:
        return 0
      case 1:
        return 6.5
      case 2:
        return 46
      default:
        return 16
    }
  })()

  const useStyles = {
    wrapItem: {
      padding: 10
    },
    menuItem: {
      color: '#000',
      marginLeft: 6,
      marginBottom: 5,
      borderRadius: 8,
      padding: '6px 12px 6px 12px',
      '&:hover': {
        background: 'rgba(89, 195, 255, 0.1)',
        color: '#146BD2',
        '& .MuiListItemIcon-root': {
          color: '#F89E49'
        }
      },
      '& .MuiListItemIcon-root': {
        minWidth: 35
      }
    },

    menuItemIcon: {
      // marginTop: 1,
      // marginBottom: 1,
      alignItem: 'center',
      marginLeft: 2,
      minWidth: 36,
      color: '#B1B1B1'
    },
    label: {
      fontWeight: 500,
      fontSize: 16,
      paddingLeft: indent
    },
    divider: {
      height: 3,
      backgroundColor: 'green',
      marginBottom: 3
    },
    active: { color: '#404DA8', background: 'rgba(89, 195, 255, 0.1)' },

    collapse: {
      // padding: '5px 0px 2px 0px',
      // background: 'rgba(89, 195, 255, 0.1)',
      borderRadius: 8

      // marginLeft: 10
    }
  }

  const classes = useStyles
  const isExpandable = children && children.length > 0
  const [childExpand, setChildExpand] = useState(() => children.map(() => false))
  const location = useLocation()
  function handleClick() {
    //i === index ? !item : false
    setExpand((expands: boolean[]) => expands.map((item, i) => (i === index ? !item : false)))
  }

  const MenuItemRoot = (
    <Grid
      sx={
        location.pathname === path
          ? { color: '#404DA8', background: 'rgba(89, 195, 255, 0.1)' }
          : {}
      }
    >
      <AppMenuItemComponent
        className={`${useStyles.menuItem} ${location.pathname === path ? useStyles.active : ''}`}
        link={path}
        onClick={handleClick}
      >
        {location.pathname === path && !!Icon_active ? (
          <ListItemIcon sx={classes.menuItemIcon}>
            <Icon_active />
          </ListItemIcon>
        ) : (
          !!Icon && (
            <ListItemIcon sx={classes.menuItemIcon}>
              <Icon />
            </ListItemIcon>
          )
        )}
        <ListItemText primary={label} inset={false} className="nav-label-text" sx={classes.label} />
        {isExpandable && !expand && <ExpandMoreIcon className="menu-expand" />}
        {isExpandable && expand && <ExpandLessIcon className="menu-expand" />}
      </AppMenuItemComponent>
    </Grid>
  )

  const MenuItemChildren = isExpandable ? (
    <Collapse in={expand} timeout="auto" unmountOnExit sx={classes.collapse}>
      <Box>
        <List className="menu-list" component="div">
          {children.map((item, index) => (
            <AppMenuItem
              {...item}
              level={level + 1}
              key={index}
              index={index}
              expand={childExpand[index]}
              setExpand={setChildExpand}
            />
          ))}
        </List>
      </Box>
    </Collapse>
  ) : null

  return (
    <Box>
      {MenuItemRoot}
      {MenuItemChildren}
    </Box>
  )
}

export default AppMenuItem
