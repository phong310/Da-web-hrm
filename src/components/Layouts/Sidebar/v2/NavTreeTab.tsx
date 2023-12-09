import { Box, List } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React from 'react'
import { Route } from '../Sidebar'
import AppMenuItem from './AppMenuItem'

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
  const classes = useStyles()
  const extractItem = []
  for (const item of items || []) {
    if (item?.children) {
      extractItem.push(...item.children)
    }
    if (item?.path) {
      extractItem.push(item)
    }
  }

  return (
    <Box
      sx={{
        ...styleBoxListAppMenu
      }}
    >
      <List component="nav" className={classes.appMenu} disablePadding>
        {items?.map((item, index) => (
          <AppMenuItem
            {...item}
            key={index}
            index={index}
            expand={expand[index]}
            setExpand={setExpand}
            open={open}
          />
        ))}
      </List>
    </Box>
  )
}

AppMenu.defaultProps = {
  expand: () => null,
  setExpand: () => null
}

const useStyles = makeStyles({
  appMenu: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    gap: '4px',

    // overflow: 'auto',
    '&::-webkit-scrollbar': {
      height: 1
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'grey',
      outline: '1px solid grey',
      padding: 1
    },
    '@media (max-width: 600px)': {
      alignItems: 'stretch'
    },
    '@media (max-width: 540px)': {
      overflow: 'auto'
    }
  }
})

const styleBoxListAppMenu = {
  width: { xs: '100%', md: '52%' },
  display: 'flex',
  alignItems: 'center',
  borderRadius: '8px 8px 0 0',
  '@media (max-width: 600px)': {
    flexDirection: 'column',
    alignItems: 'stretch'
  }
}

export default AppMenu
