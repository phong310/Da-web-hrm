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
import { ListEmployee } from 'screen/employee/ListEmployee'
import { checkHasRole } from 'constants/roles'
import { NewEmployeeForm } from 'screen/employee/NewEmployeeForm'

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
  },
  // Employee
  {
    path: '/employees/manager',
    protected: true,
    element: <ListEmployee />,
    permissions: [allPermissions.employees_manage],
    breadCrumb: {
      name: i18n.t('employee.employee_management_breadcrumb'),
      parents: [
        {
          name: i18n.t('menu.overview'),
          link: '/'
        }
      ]
    }
  },

  {
    path: '/employees/create',
    protected: true,
    element: <NewEmployeeForm />,
    permissions: [allPermissions.employees_manage],
    breadCrumb: {
      name: i18n.t('employee.create'),
      parents: [
        {
          name: i18n.t('employee.employee_management_breadcrumb'),
          link: '/employees/manager'
        },
        {
          name: i18n.t('dashboard.overview'),
          link: '/'
        }
      ]
    }
  }
]

const Router: React.VFC = () => {
  const { loading, permissions, role } = useAuth()

  if (loading) {
    return <FullScreenLoading />
  }

  const checkHasPermission = (children: Array<string>) => {
    if (!permissions) {
      return false
    }

    return children.every(
      ((i) => (c: string) => {
        return permissions.indexOf(c, i) !== -1
      })(0)
    )
  }

  const checkHas = (router: RouterItem) => {
    if (router.role) {
      return checkHasRole(router.role, role)
    } else if (router.permissions && router.permissions.length > 0) {
      return checkHasPermission(router.permissions)
    }
    return true // Nếu không có cả role và permissions thì mặc định trả về true
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
          if (checkHas(router)) {
            return (
              <Route
                key={index}
                path={router.path}
                element={React.cloneElement(router.element, { breadCrumb: router.breadCrumb })}
              />
            )
          }
        })}
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  )
}

export { Router }
