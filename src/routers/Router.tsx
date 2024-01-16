import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Login } from '../screen/auth'
import { Layout } from '../components/Layouts/Sidebar/Layout'
import { allPermissions } from '../constants/permissions'
import { RequireAuth } from './RequireAuth'
import { useAuth } from 'lib/hook/useAuth'
import { FullScreenLoading } from 'components/Loader'
import i18n from 'lib/lang/translations/i18n'
import { CompanyForm } from 'screen/Company/CompanyForm'
import { ListEmployee } from 'screen/employee/ListEmployee'
import { allRoles, checkHasRole } from 'constants/roles'
import { NewEmployeeForm } from 'screen/employee/NewEmployeeForm'
import { EmployeeEditForm } from 'screen/employee/EmployeeEditForm'
import { EmployeeBankAccount } from 'screen/employee/EmployeeBankAccount'
import { EmployeeIdenCard } from 'screen/employee/EmployeeIdenCard'
import { EmployeeAddress } from 'screen/employee/EmployeeAddress'
import { EmployeeEducation } from 'screen/employee/EmployeeEducation'
import { EmployeeAccountInformation } from 'screen/employee/EmployeeAccountInformation'
import { EmployeeNumberTimeOff } from 'screen/employee/EmployeeNumberTimeOff'
import EmployeeRelatives from 'screen/employee/EmployeeRelatives'
import { TimeKeeping } from 'screen/timekeeping/TimeKeeping'
import { Forbidden } from 'screen/forbidden/Forbidden'
import { TableProfileInfo } from 'screen/profile/TableProfileInfo'
import { ProfileInfo } from 'screen/profile/ProfileInfo'
import { UserBankAccount } from 'screen/profile/UserBankAccount'
import { Identification } from 'screen/profile/Identification'
import AddressProfile from 'screen/profile/AddressProfile'
import { Dashboard } from 'screen/dashboard/Dashboard'
import { LeaveApplication } from 'screen/leaveForm/LeaveApplication'
import { OvertimeApplication } from 'screen/OverTime/OvertimeApplication'
import { RequestChangeTimesheetApplication } from 'screen/RequestChangeTimesheet/RequestChangeTimesheetApplication'
import { CompensatoryLeaveApplication } from 'screen/compensatoryLeave/CompensatoryLeaveApplication'
import { ListEmployeeLeaveApplication } from 'screen/leaveForm/ListEmployeeLeaveApplication'
import { TimeSheet } from 'screen/timesheet/TimeSheet'
import { ManagementTimesheet } from 'screen/timesheet/ManagerTimeSheet/ManagementTimeshee'
import { ManagementTimesheetLog } from 'screen/timesheet-log/ManagementTimesheetLog'
import { ManagerLeaveApplication } from 'screen/leaveForm/Managerment/ManagerLeaveApplication'
import { ManagerOvertimeApplication } from 'screen/OverTime/Managerment/ManagerOvertimeApplication'
import { ManagerRequestChangeTimesheetApplication } from 'screen/RequestChangeTimesheet/Managerment/ManagerRequestChangeTimesheetApplication'
import { ManagerCompensatoryLeaveApplication } from 'screen/compensatoryLeave/Managerment/ManagerCompensatoryLeaveApplication'
import ListPositions from 'screen/CategoryManagement/Positions/ListPositions'
import ListDepartment from 'screen/CategoryManagement/Department/ListDepartment'
import ListTitles from 'screen/CategoryManagement/Titles/ListTitles'
import ListBranch from 'screen/CategoryManagement/Branch/ListBranch'
import { TabSetting } from 'screen/CategoryManagement/SettingsCompany'
import ListHoliday from 'screen/SystemManagement/Holiday/ListHoliday'
import ListCompenSatoryWorkingDay from 'screen/SystemManagement/CompenSatoryWorkingDay/ListCompenSatoryWorkingDay'
import ListKindOfLeave from 'screen/SystemManagement/ListOnLeave/ListKindOfLeave'
import { SettingTypesOvertime } from 'screen/SystemManagement/SettingsTypeOvertime/SettingTypesOvertime'
import { LaborContract } from 'screen/labor-contract/LaborContract'
import { ListLaborContract } from 'screen/labor-contract/list/ListLaborContract'
import { ListLaborContractHistory } from 'screen/labor-contract/list/ListLaborContractHistory'
import { ListContractEmployees } from 'screen/labor-contract-employees/List/ListContractEmployees'
import ListLaborContractType from 'screen/SystemManagement/LaborContractType/ListLaborContractType'
import { routerSuperAdmin } from './routePerms'

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

  //timekeep-manager
  {
    path: '/time-keeping/manager/timesheet',
    protected: true,
    element: <ManagementTimesheet />,
    permissions: [allPermissions.timekeeping_manage],
    breadCrumb: {
      name: i18n.t('menu.management_timekeeping'),
      parents: [
        {
          name: i18n.t('dashboard.overview'),
          link: '/'
        }
      ]
    }
  },

  // timesheet-log manager
  {
    path: '/time-keeping/manager/timesheet-log',
    protected: true,
    element: <ManagementTimesheetLog />,
    permissions: [allPermissions.timekeeping_manage], //
    breadCrumb: {
      name: i18n.t('timesheet-log.management'),
      parents: [
        {
          name: i18n.t('dashboard.overview'),
          link: '/'
        }
      ]
    }
  },

  //timesheet
  {
    path: '/time-keeping/timesheet',
    protected: true,
    element: <TimeSheet />,
    permissions: [allPermissions.timekeeping_list],
    breadCrumb: {
      name: i18n.t('timesheet.title'),
      parents: [
        {
          name: i18n.t('dashboard.overview'),
          link: '/'
        }
      ]
    }
  },

  //manager-application
  {
    path: '/applications/manager/leave-form',
    protected: true,
    element: <ManagerLeaveApplication />,
    permissions: [allPermissions['leave-form_manage']],
    breadCrumb: {
      name: i18n.t('application_management.leave_management_breadcrumb'),
      parents: [
        {
          name: i18n.t('dashboard.overview'),
          link: '/'
        }
      ]
    }
  },
  {
    path: '/applications/manager/overtimes',
    protected: true,
    element: <ManagerOvertimeApplication />,
    permissions: [allPermissions.overtime_manage],
    breadCrumb: {
      name: i18n.t('application_management.overtime_management_breadcrumb'),
      parents: [
        {
          name: i18n.t('dashboard.overview'),
          link: '/'
        }
      ]
    }
  },
  {
    path: '/applications/manager/request-change-timesheets',
    protected: true,
    element: <ManagerRequestChangeTimesheetApplication />,
    permissions: [allPermissions['request-change-timesheets_manage']],
    breadCrumb: {
      name: i18n.t('application_management.request_change_timesheet_management_breadcrumb'),
      parents: [
        {
          name: i18n.t('dashboard.overview'),
          link: '/'
        }
      ]
    }
  },
  {
    path: '/applications/manager/compensatory-leaves',
    protected: true,
    element: <ManagerCompensatoryLeaveApplication />,
    permissions: [allPermissions.compensatory_leave_manage],
    breadCrumb: {
      name: i18n.t('application_management.compensatory_leave_management_breadcrumb'),
      parents: [
        {
          name: i18n.t('dashboard.overview'),
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
  },
  {
    path: '/employees/edit/:id',
    protected: true,
    element: <EmployeeEditForm />,
    permissions: [allPermissions.employees_manage],
    breadCrumb: {
      name: i18n.t('employee.edit'),
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
  },
  {
    path: '/employees/edit/:id/bank-account',
    protected: true,
    element: <EmployeeBankAccount />,
    breadCrumb: {
      name: i18n.t('employee.edit'),
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
    },
    permissions: [allPermissions.employees_manage]
  },
  {
    path: '/employees/edit/:id/account-information',
    protected: true,
    element: <EmployeeAccountInformation />,
    breadCrumb: {
      name: i18n.t('employee.edit'),
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
    },
    permissions: [allPermissions.employees_manage]
  },
  {
    path: '/employees/edit/:id/address',
    protected: true,
    element: <EmployeeAddress />,
    breadCrumb: {
      name: i18n.t('employee.edit'),
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
    },
    permissions: [allPermissions.employees_manage]
  },
  {
    path: '/employees/edit/:id/education',
    protected: true,
    element: <EmployeeEducation />,
    breadCrumb: {
      name: i18n.t('employee.edit'),
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
    },
    permissions: [allPermissions.employees_manage]
  },
  {
    path: '/employees/edit/:id/identification-card',
    protected: true,
    element: <EmployeeIdenCard />,
    breadCrumb: {
      name: i18n.t('employee.edit'),
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
    },
    permissions: [allPermissions.employees_manage]
  },
  {
    path: '/employees/edit/:id/working-time-off',
    protected: true,
    element: <EmployeeNumberTimeOff />,
    breadCrumb: {
      name: i18n.t('employee.edit'),
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
    },
    permissions: [allPermissions.employees_manage]
  },
  {
    path: '/employees/edit/:id/relatives',
    protected: true,
    element: <EmployeeRelatives />,
    breadCrumb: {
      name: i18n.t('employee.edit'),
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
    },
    permissions: [allPermissions.employees_manage]
  },

  //all-employee-leave-application
  {
    path: '/applications/leave-form/all',
    protected: true,
    element: <ListEmployeeLeaveApplication />,
    permissions: [],
    breadCrumb: {
      name: i18n.t('menu.employee_application'),
      parents: [
        {
          name: i18n.t('dashboard.overview'),
          link: '/'
        }
      ]
    }
  },

  //my-applications
  {
    path: '/applications/leave-form',
    protected: true,
    element: <LeaveApplication />,
    permissions: [],
    breadCrumb: {
      name: i18n.t('application_form.leave_application'),
      parents: [
        {
          name: i18n.t('dashboard.overview'),
          link: '/'
        }
      ]
    }
  },
  {
    path: '/applications/overtimes',
    protected: true,
    element: <OvertimeApplication />,
    permissions: [],
    breadCrumb: {
      name: i18n.t('application_form.overtime_application'),
      parents: [
        {
          name: i18n.t('dashboard.overview'),
          link: '/'
        }
      ]
    }
  },
  //request-change-timesheet-application
  {
    path: '/applications/request-change-timesheets',
    protected: true,
    element: <RequestChangeTimesheetApplication />,
    permissions: [],
    breadCrumb: {
      name: i18n.t('application_form.request_change_timesheet_application'),
      parents: [
        {
          name: i18n.t('dashboard.overview'),
          link: '/'
        }
      ]
    }
  },
  {
    path: '/applications/compensatory-leaves',
    protected: true,
    element: <CompensatoryLeaveApplication />,
    permissions: [],
    breadCrumb: {
      name: i18n.t('application_form.compensatory_leave_application'),
      parents: [
        {
          name: i18n.t('dashboard.overview'),
          link: '/'
        }
      ]
    }
  },

  //Labor contract
  {
    path: '/employees/labor-contract/list-contract/create',
    protected: true,
    element: <LaborContract />,
    permissions: [allPermissions['labor-contracts_store']],
    breadCrumb: {
      name: i18n.t('labor_contract.create_labor_contract_breadcrumb'),
      parents: [
        {
          name: i18n.t('labor_contract.labor_contract_breadcrumb'),
          link: '/employees/labor-contract/list-contract'
        },
        {
          name: i18n.t('dashboard.overview'),
          link: '/'
        }
      ]
    }
  },
  {
    path: '/employees/labor-contract/list-contract/edit/:id',
    protected: true,
    element: <LaborContract />,
    permissions: [allPermissions['labor-contracts_manage']],
    breadCrumb: {
      name: i18n.t('labor_contract.labor_contract_detail_breadcrumb'),
      parents: [
        {
          name: i18n.t('labor_contract.labor_contract_breadcrumb'),
          link: '/employees/labor-contract/list-contract'
        },
        {
          name: i18n.t('dashboard.overview'),
          link: '/'
        }
      ]
    }
  },
  {
    path: '/employees/labor-contract/list-contract',
    protected: true,
    element: <ListLaborContract />,
    permissions: [allPermissions['labor-contracts_manage']],
    breadCrumb: {
      name: i18n.t('labor_contract.labor_contract_breadcrumb'),
      parents: [
        {
          name: i18n.t('dashboard.overview'),
          link: '/'
        }
      ]
    }
  },
  {
    path: '/employees/labor-contract/list-history',
    protected: true,
    element: <ListLaborContractHistory />,
    permissions: [allPermissions['labor-contracts_manage']],
    breadCrumb: {
      name: i18n.t('labor_contract.labor_contract_history_breadcrumb'),
      parents: [
        {
          name: i18n.t('dashboard.overview'),
          link: '/'
        }
      ]
    }
  },

  // Quản trị danh mục
  {
    path: '/setting/positions',
    protected: true,
    element: <ListPositions />,
    role: allRoles.admin,
    breadCrumb: {
      name: i18n.t('Category_management.location'),
      parents: [
        {
          name: i18n.t('dashboard.overview'),
          link: '/'
        }
      ]
    }
  },
  {
    path: '/setting/departments',
    protected: true,
    element: <ListDepartment />,
    role: allRoles.admin,
    breadCrumb: {
      name: i18n.t('Category_management.part'),
      parents: [
        {
          name: i18n.t('dashboard.overview'),
          link: '/'
        }
      ]
    }
  },
  {
    path: '/setting/titles',
    protected: true,
    element: <ListTitles />,
    role: allRoles.admin,
    breadCrumb: {
      name: i18n.t('Category_management.titles'),
      parents: [
        {
          name: i18n.t('dashboard.overview'),
          link: '/'
        }
      ]
    }
  },
  {
    path: '/setting/branch',
    protected: true,
    element: <ListBranch />,
    role: allRoles.admin,
    breadCrumb: {
      name: i18n.t('Category_management.branch'),
      parents: [
        {
          name: i18n.t('dashboard.overview'),
          link: '/'
        }
      ]
    }
  },
  {
    path: '/general/companies-setting',
    protected: true,
    element: <TabSetting />,
    role: allRoles.admin,
    breadCrumb: {
      name: i18n.t('Category_management.setting_company'),
      parents: [
        {
          name: i18n.t('dashboard.overview'),
          link: '/'
        }
      ]
    }
  },

  // System Management
  {
    path: '/settings/holiday',
    protected: true,
    element: <ListHoliday />,
    role: allRoles.admin,
    breadCrumb: {
      name: i18n.t('System_Management.list_holiday'),
      parents: [
        {
          name: i18n.t('dashboard.overview'),
          link: '/'
        }
      ]
    }
  },
  {
    path: '/setting/working-day',
    protected: true,
    element: <ListCompenSatoryWorkingDay />,
    role: allRoles.admin,
    breadCrumb: {
      name: i18n.t('System_Management.list_working_days'),
      parents: [
        {
          name: i18n.t('dashboard.overview'),
          link: '/'
        }
      ]
    }
  },
  {
    path: '/setting/labor-contract-types',
    protected: true,
    element: <ListLaborContractType />,
    role: allRoles.admin,
    breadCrumb: {
      name: i18n.t('System_Management.labor_contract_types'),
      parents: [
        {
          name: i18n.t('dashboard.overview'),
          link: '/'
        }
      ]
    }
  },
  {
    path: '/setting/kind-of-leave',
    protected: true,
    element: <ListKindOfLeave />,
    role: allRoles.admin,
    breadCrumb: {
      name: i18n.t('System_Management.on_leave'),
      parents: [
        {
          name: i18n.t('dashboard.overview'),
          link: '/'
        }
      ]
    }
  },
  {
    path: '/setting/setting-types-overtime',
    protected: true,
    element: <SettingTypesOvertime />,
    role: allRoles.admin,
    breadCrumb: {
      name: i18n.t('System_Management.set_overtime_type'),
      parents: [
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
          } else {
            return <Route key={index} path={router.path} element={<Forbidden />} />
          }
        })}

        {routerSuperAdmin.map((router, index) => {
          let path = router.path

          if (!router.permissions || !router.permissions.length) {
            return <Route key={index} path={path} element={router.element} />
          }
          let checkHas = checkHasPermission(router.permissions)
          if (checkHas) {
            return <Route key={index} path={path} element={router.element} />
          } else {
            return <Route key={index} path={path} element={<Forbidden />} />
          }
        })}

        <Route index element={<Dashboard />} />

        <Route path="/general/profile" element={<ProfileInfo />}>
          <Route path="/general/profile" element={<TableProfileInfo />} />
          <Route path="/general/profile/edit" element={<TableProfileInfo />} />
          <Route path="/general/profile/bank-account" element={<UserBankAccount />} />
          <Route path="/general/profile/identification" element={<Identification />} />
          <Route path="/general/profile/address" element={<AddressProfile />} />
        </Route>
        <Route path="/individual-contract/list" element={<ListContractEmployees />} />
        <Route path="/forbidden" element={<Forbidden />} />
      </Route>
    </Routes>
  )
}

export { Router }
