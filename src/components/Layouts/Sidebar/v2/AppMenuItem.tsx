import { Box, ListItemText } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React from 'react'
import AppMenuItemComponent from '../AppMenuItemComponent'

const AppMenuItem = (props: {
  label?: string
  path?: string
  expand: boolean
  setExpand: React.Dispatch<React.SetStateAction<boolean[]>>
  index: number
  open?: boolean
}) => {
  const { label, path, setExpand, index } = props

  const classes = useStyles()

  function handleClick() {
    setExpand((expands: boolean[]) => expands.map((item, i) => (i === index ? !item : false)))
  }

  const MenuItemRoot = (
    <AppMenuItemComponent className={classes.menuItem} link={path} onClick={handleClick}>
      <ListItemText
        primary={label}
        inset={false}
        className="nav-label-text"
        classes={{ primary: classes.label }}
      />
    </AppMenuItemComponent>
  )

  return <Box sx={{ ...styleBox }}>{MenuItemRoot}</Box>
}

export default AppMenuItem
const useStyles = makeStyles({
  menuItem: {
    color: '#878C95',
    borderRadius: '8px 8px 0 0',
    padding: '8px 12px 8px 12px',
    minWidth: '118px',
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '20px',
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
    whiteSpace: 'nowrap',
    '@media (max-width: 600px)': {
      padding: '6px',
      minWidth: 0
    },
    '@media (min-width: 768px) and (max-width: 1180px)': {
      padding: '4px 8px 4px 8px',
      minWidth: '150px'
    },
    '&.active': {
      color: '#146BD2',
      background: '#fff',
      borderBottom: '2px solid #146BD2',
      boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10)'
    },
    '&:hover': {
      color: '#146BD2',
      background: '#fff',
      borderBottom: '2px solid #146BD2',
      '& .MuiListItemIcon-root': {
        color: '##878C95'
      }
    }
  },
  label: {
    fontSize: 16,
    '@media (max-width: 600px)': {
      fontSize: 10
    },
    '@media (min-width: 768px) and (max-width: 1180px)': {
      fontSize: 10
    }
  }
})

const styleBox = {
  width: '100%'
}
