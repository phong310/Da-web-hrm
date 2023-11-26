import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Login } from '../screen/auth'
import Dashboard from '../screen/dashboard/Dashboard'
import { Layout } from '../components/Layouts/Sidebar/Layout'
import TimeKeeping from '../screen/timekeeping/TimeKeeping'
import { allPermissions } from '../constants/permissions'
import { RequireAuth } from './RequireAuth'
import { useAuth } from 'lib/hook/useAth'
import { FullScreenLoading } from 'components/Loader'
import i18n from 'lib/lang/translations/i18n'
import { CompanyForm } from 'screen/Company/CompanyForm'

interface RouterItem {
  path: string
  protected: boolean
  element: JSX.Element
  permissions?: string[]
  role?: string // Thêm kiểu cho trường role
  breadCrumb?: {
    name: string
    parents: { name: string; link: string }[]
  }
}

export const routers: RouterItem[] = [
  {
    path: '/',
    protected: true,
    element: <Dashboard />,
    permissions: []
  },
  //Timekeeping
  {
    path: '/time-keeping/timekeeping',
    protected: true,
    element: <TimeKeeping />,
    permissions: [allPermissions.timekeeping_list],
    breadCrumb: {
      name: i18n.t('menu.timekeeping'),
      parents: [
        {
          name: i18n.t('menu.overview'),
          link: '/'
        }
      ]
    }
  }
]

const Router: React.VFC = () => {
    const { loading } = useAuth()

      if (loading) {
        return <FullScreenLoading />
      }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/companies/create" element={<CompanyForm />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        {routers.map((router, index) => {
          return (
            <Route
              key={index}
              path={router.path}
              element={React.cloneElement(router.element, { breadCrumb: router.breadCrumb })}
            />
          )
        })}
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  )
}

export { Router }
