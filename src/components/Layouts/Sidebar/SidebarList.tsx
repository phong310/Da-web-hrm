import system_management_active from 'assets/svgs/sidebar-icons/System_management _active.svg'
import system_management from 'assets/svgs/sidebar-icons/System_management.svg'
import TimeSheet from 'assets/svgs/sidebar-icons/TimeSheet.svg'
import TimeSheet_active from 'assets/svgs/sidebar-icons/TimeSheet_active.svg'
import category_management from 'assets/svgs/sidebar-icons/category_management.svg'
import category_management_active from 'assets/svgs/sidebar-icons/category_management_active.svg'
import employeeManage from 'assets/svgs/sidebar-icons/employeeManage.svg'
import employeeManage_active from 'assets/svgs/sidebar-icons/employeeManage_active.svg'
import labor_contract from 'assets/svgs/sidebar-icons/labor_contract.svg'
import labor_contract_active from 'assets/svgs/sidebar-icons/labor_contract_active.svg'
import manage_application from 'assets/svgs/sidebar-icons/manage_application.svg'
import manage_timeKeeping from 'assets/svgs/sidebar-icons/manage_timeKeeping.svg'
import manage_timeKeeping_active from 'assets/svgs/sidebar-icons/manage_timeKeeping_active.svg'
import { allPermissions } from 'constants/permissions'
import { allRoles } from 'constants/roles'
import i18n from 'lib/lang/translations/i18n'
import Overview from '../../../assets/svgs/sidebar-icons/Overview.svg'
import Overview_active from '../../../assets/svgs/sidebar-icons/Overview_active.svg'
import TimeKeeping from '../../../assets/svgs/sidebar-icons/TimeKeeping.svg'
import TimeKeeping_active from '../../../assets/svgs/sidebar-icons/TimeKeeping_active.svg'
import application from '../../../assets/svgs/sidebar-icons/application.svg'
import application_active from '../../../assets/svgs/sidebar-icons/application_active.svg'
import LateEarlyIcon from '../../../assets/svgs/sidebar-icons/application/late_early_icon.svg'
import TimekeepingIcon from '../../../assets/svgs/sidebar-icons/timekeeping/timekeeping_icon.svg'
import TimesheetIcon from '../../../assets/svgs/sidebar-icons/timekeeping/timesheet_icon.svg'
import LeaveApplicationIcon from '../../../assets/svgs/sidebar-icons/application/leave_icon.svg'
import OvertimeIcon from '../../../assets/svgs/sidebar-icons/application/overtime_icon.svg'
import RequestChangeTimesheetIcon from '../../../assets/svgs/sidebar-icons/timekeeping/request_update_timekeeping_icon.svg'
import { Route } from './Sidebar'

const sidebarList: Route[] = [
  {
    label: i18n.t('menu.overview'),
    path: '/',
    Icon: () => <img src={Overview}></img>,
    Icon_active: () => <img src={Overview_active} />
  },
  {
    label: i18n.t('menu.timekeeping'),
    Icon: () => <img src={TimeKeeping} />,
    Icon_active: () => <img src={TimeKeeping_active} />,
    path: '/time-keeping/timekeeping'
  },
  {
    label: i18n.t('menu.application'),
    Icon: () => <img src={application} />,
    Icon_active: () => <img src={application_active} />,
    children: [
      {
        label: i18n.t('menu.my_application'),
        path: '/applications/leave-form',
        permissions: []
      },
      {
        label: i18n.t('menu.employee_application'),
        path: '/applications/leave-form/all',
        permissions: []
      }
    ]
  },
  {
    label: i18n.t('menu.timesheet'),
    path: '/time-keeping/timesheet',
    Icon: () => <img src={TimeSheet} />,
    Icon_active: () => <img src={TimeSheet_active} />
  },
  {
    label: i18n.t('menu.management_timekeeping'),
    Icon: () => <img src={manage_timeKeeping} />,
    Icon_active: () => <img src={manage_timeKeeping_active} />,
    permissions: [
      allPermissions.timekeeping_manage,
      allPermissions.overtime_manage,
      allPermissions['request-change-timesheets_manage'],
      allPermissions['leave-form_manage'],
      allPermissions.compensatory_leave_manage
    ],
    children: [
      {
        label: i18n.t('menu.management_timekeeping'),
        path: '/time-keeping/manager/timesheet'
      },
      {
        label: i18n.t('menu.management_timesheet_log'),
        path: '/time-keeping/manager/timesheet-log'
      }
    ]
  },
  {
    label: i18n.t('menu.management'),
    Icon: () => <img src={manage_application} />,
    Icon_active: () => <img src={application_active} />,
    permissions: [
      allPermissions.overtime_manage,
      allPermissions['request-change-timesheets_manage'],
      allPermissions['leave-form_manage'],
      allPermissions.compensatory_leave_manage
    ],
    children: [
      {
        label: i18n.t('application_management.leave_management'),
        path: '/applications/manager/leave-form'
      },
      {
        label: i18n.t('application_management.overtime_management'),
        path: '/applications/manager/overtimes'
      },
      {
        label: i18n.t('application_management.request_change_timesheet_management'),
        path: '/applications/manager/request-change-timesheets'
      },
      {
        label: i18n.t('application_management.compensatory_leave_management'),
        path: '/applications/manager/compensatory-leaves'
      }
    ]
  },
  {
    label: i18n.t('menu.employee_management'),
    permissions: [allPermissions.employees_manage],
    Icon: () => <img src={employeeManage} />,
    Icon_active: () => <img src={employeeManage_active} />,
    path: '/employees/manager'
  },
  {
    label: i18n.t('menu.labor_contract'),
    // path: '/employees/labor-contract/list-contract',
    Icon: () => <img src={labor_contract} />,
    Icon_active: () => <img src={labor_contract_active} />,
    permissions: [allPermissions['labor-contracts_manage']],
    children: [
      {
        label: i18n.t('labor_contract.name'),
        path: '/employees/labor-contract/list-contract'
      },
      {
        label: i18n.t('labor_contract.history'),
        path: '/employees/labor-contract/list-history'
      }
    ]
  },
  {
    label: i18n.t('System_Management.system_management'),
    Icon: () => <img style={{ width: '20px', height: '20px' }} src={system_management} />,
    Icon_active: () => (
      <img style={{ width: '20px', height: '20px' }} src={system_management_active} />
    ),
    role: allRoles.admin,
    children: [
      // {
      //   label: i18n.t('System_Management.roles'),
      //   permissions: [],
      //   path: '/setting/roles'
      // },
      // {
      //   label: i18n.t('System_Management.setting_timekeeping'),
      //   path: '/settings/locate'
      // },
      {
        label: i18n.t('System_Management.holiday'),
        path: '/settings/holiday'
      },
      {
        label: i18n.t('System_Management.working_day'),
        path: '/setting/working-day'
      },
      {
        label: i18n.t('System_Management.labor_contract_types'),
        permissions: [allPermissions['labor-contracts_manage']],
        path: '/setting/labor-contract-types'
      },
      {
        label: i18n.t('System_Management.on_leave'),
        path: '/setting/kind-of-leave'
      },
      {
        label: i18n.t('System_Management.set_overtime_type'),
        path: '/setting/setting-types-overtime'
      },
      // {
      //   label: i18n.t('System_Management.setting_personal_income_tax'),
      //   path: '/setting/setting-personal-income-tax'
      // },
      // {
      //   label: i18n.t('System_Management.setting_types_salaries'),
      //   path: '/setting/setting-types-salaries'
      // }
    ]
  },
  {
    label: i18n.t('Category_management.category_management'),
    Icon: () => <img style={{ width: '20px', height: '20px' }} src={category_management} />,
    Icon_active: () => (
      <img style={{ width: '20px', height: '20px' }} src={category_management_active} />
    ),
    role: allRoles.admin,
    children: [
      {
        label: i18n.t('Category_management.location'),
        path: '/setting/positions'
      },
      {
        label: i18n.t('Category_management.part'),
        path: '/setting/departments'
      },
      {
        label: i18n.t('Category_management.titles'),
        path: '/setting/titles'
      },
      {
        label: i18n.t('Category_management.branch'),
        path: '/setting/branch'
      },
      {
        label: i18n.t('Category_management.setting_company'),
        path: '/general/companies-setting'
      }
    ]
  }
]

const sidebarTimeKeeping: Route[] = [
  {
    label: i18n.t('menu.overview'),
    path: '/',
    Icon: () => <img src={LateEarlyIcon} />
  },
  {
    label: i18n.t('menu.timekeeping'),
    path: '/time-keeping/timekeeping',
    Icon: () => <img src={TimekeepingIcon} />
  },
  {
    label: i18n.t('menu.timesheet'),
    path: '/time-keeping/timesheet',
    Icon: () => <img src={TimesheetIcon} />
  }
]

const sidebarTimekeepingManager = [
  {
    label: i18n.t('menu.management_timekeeping'),
    path: '/time-keeping/manager/timesheet',
    Icon: () => <img src={TimesheetIcon} />
  },
  {
    label: i18n.t('menu.management_timesheet_log'),
    path: '/time-keeping/manager/timesheet-log',
    Icon: () => <img src={TimesheetIcon} />
  }
]

const sidebarEmployeeManagement = [
  {
    label: i18n.t('employee.list'),
    path: '/employees/manager',
    Icon: () => <img src={TimesheetIcon} />
  },
  {
    label: i18n.t('labor_contract.name'),
    Icon: () => <img src={TimesheetIcon} />,
    children: [
      {
        label: i18n.t('labor_contract.name'),
        path: '/employees/labor-contract/list-contract'
      },
      {
        label: i18n.t('labor_contract.history'),
        path: '/employees/labor-contract/list-history'
      }
    ]
  }
]

const sidebarApp: Route[] = [
  {
    label: i18n.t('application_form.leave_application'),
    path: '/applications/leave-form',
    Icon: () => <img src={LeaveApplicationIcon} />
  },

  {
    label: i18n.t('application_form.overtime_application'),
    path: '/applications/overtimes',
    Icon: () => <img src={OvertimeIcon} />
  },
  {
    label: i18n.t('application_form.request_change_timesheet_application'),
    path: '/applications/request-change-timesheets',
    Icon: () => <img src={RequestChangeTimesheetIcon} />
  },
  {
    label: i18n.t('application_form.compensatory_leave_application'),
    path: '/applications/compensatory-leaves',
    Icon: () =>  <img src={LeaveApplicationIcon} />
  }
]



export {
  sidebarList,
  sidebarTimeKeeping,
  sidebarTimekeepingManager,
  sidebarEmployeeManagement,
  sidebarApp
}

