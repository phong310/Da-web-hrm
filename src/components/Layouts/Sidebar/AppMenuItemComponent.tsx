/* eslint-disable react/display-name */
/* eslint-disable react/no-children-prop */
import { ListItem } from '@mui/material'
import { useAtom } from 'jotai'
// import { monthCalendarAtom } from 'lib/atom'
// import { checkIsManager, formatDateTime } from 'lib/utils'
import { NavLink, useLocation } from 'react-router-dom'

const AppMenuItemComponent = (props: {
  className: any
  onClick: any
  link: any
  children: any
}) => {
  const { className, onClick, link, children } = props
  //   const [_, setMonthAtom] = useAtom(monthCalendarAtom)
  const location = useLocation()

  const handleClick = (link: string) => {
    // if (location.pathname === link) return
    // if (checkIsManager(link)) {
    //   setMonthAtom('')
    // } else {
    //   setMonthAtom(formatDateTime(new Date()))
    // }
  }

  if (typeof link === 'function') {
    return <ListItem button className={className} children={children} onClick={link} />
  }
  if (!link || typeof link !== 'string') {
    return <ListItem button className={className} children={children} onClick={onClick} />
  }

  return (
    <ListItem
      button={true}
      className={className}
      children={children}
      component={NavLink}
      to={link}
      // sx={{ marginTop: 4, marginBottom: 4, marginLeft: 10, color: '#B1B1B1' }}
      onClick={() => handleClick(link)}
    />
  )
}

export default AppMenuItemComponent
