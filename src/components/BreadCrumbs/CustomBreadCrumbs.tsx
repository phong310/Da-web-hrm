import { Link, styled } from '@mui/material'
import Breadcrumbs, { BreadcrumbsProps } from '@mui/material/Breadcrumbs'

import React, { useEffect, useState } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'

import { useHistory } from '../../lib/hook/useHistory'
import { routers } from '../../routers'
type BreadCrumbsParent = {
  name: string
  link: string
}
export type CustomBreadCrumbProps = {
  isDisableBreadcrumb?: boolean
  name?: string
  parent?: BreadCrumbsParent[]
} & BreadcrumbsProps

const CustomBreadCrumbs: React.VFC<CustomBreadCrumbProps> = ({
  isDisableBreadcrumb
}: CustomBreadCrumbProps) => {
  const location = useLocation()
  const { history } = useHistory()
  const [routeMatch, setRouteMatch] = useState<any>([])
  const [currName, setCurrName] = useState<string | undefined>('')

  // check if url declare in Router(source) is same with current url (dest)
  const checkRouteMatch = (source: string, dest: string) => {
    const sourceStrToArr = source.split('/')
    const destStrToArr = dest.split('/')

    if (sourceStrToArr.length !== destStrToArr.length) {
      return false
    } else {
      for (let i = 0; i < sourceStrToArr.length; i++) {
        if (!sourceStrToArr[i].includes(':') && !destStrToArr[i].includes('?')) {
          if (sourceStrToArr[i] !== destStrToArr[i]) {
            return false
          }
        }
      }
    }

    return true
  }

  // find route match in history
  const findRouteMatchInHistory = (path: string) => {
    for (const historyUrl of history.reverse()) {
      if (checkRouteMatch(path, historyUrl)) {
        return historyUrl
      }
    }
    return path
  }

  useEffect(() => {
    const routeMatch = routers.filter((item) => checkRouteMatch(item.path, location.pathname))[0]
    // @ts-ignore
    const newRouteMatch: any = routeMatch?.breadCrumb?.parents.map((item: any, index: number) => {
      return {
        link: findRouteMatchInHistory(item.link),
        name: item.name
      }
    })
    setCurrName(routeMatch?.breadCrumb?.name)
    setRouteMatch(newRouteMatch)
  }, [location.pathname])

  return !isDisableBreadcrumb ? (
    <Breadcrumbs
      aria-label="breadcrumb"
      sx={{
        marginLeft: { xs: 1, md: 'none' },
        '& .MuiBreadcrumbs-separator ': {
          m: 0.5
        }
      }}
    >
      {routeMatch
        ?.map((item: any, index: number) => {
          return (
            <CustomLink key={index} underline="hover" color="inherit">
              <RouterLink
                style={{ textDecoration: 'none', color: 'inherit' }}
                to={item.link}
                // key={index}
              >
                {item.name}
              </RouterLink>
            </CustomLink>
          )
        })
        .reverse()}
      <CustomLink underline="none" color="inherit" sx={{ fontWeight: 900 }}>
        {currName}
      </CustomLink>
    </Breadcrumbs>
  ) : null
}

const CustomLink = styled(Link)({
  fontSize: '14px'
})

export { CustomBreadCrumbs }

