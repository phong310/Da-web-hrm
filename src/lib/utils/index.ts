export const contentText = {
    fontSize: { xs: 16, sm: 16, md: 22, lg: 30 },
    lineHeight: '36px',
    fontWeight: 700,
    color: '#111111',
}

export const reportAmountArr = ['working_time', 'late_time', 'early_time', 'over_time']
export const reportTotalAmountArr = [
    {
        key: 'leave_app',
        titleSuffix: 'leave_management',
        userApiPrefix: 'leave-form'
    },
    {
        key: 'over_time_app',
        titleSuffix: 'overtime_management',
        userApiPrefix: 'overtimes'
    },
    {
        key: 'request_change_timesheet_app',
        titleSuffix: 'request_change_timesheet_management',
        userApiPrefix: 'request-change-timesheets'
    },
    {
        key: 'compensatory_leave_app',
        titleSuffix: 'compensatory_leave_management',
        userApiPrefix: 'compensatory-leaves'
    }
]
export const reportAllTotalAmountArr = [
    {
        key: 'all_leave_app',
        titleSuffix: 'leave_management',
        adminApiPrefix: 'manager/leave-form'
    },
    {
        key: 'all_over_time_app',
        titleSuffix: 'overtime_management',
        adminApiPrefix: 'manager/overtimes'
    },
    {
        key: 'all_request_change_timesheet_app',
        titleSuffix: 'request_change_timesheet_management',
        adminApiPrefix: 'manager/request-change-timesheets'
    },
    {
        key: 'all_compensatory_leave_app',
        titleSuffix: 'compensatory_leave_management',
        adminApiPrefix: 'manager/compensatory-leaves'
    }
]

export const reportTotalLaborContractArr = [
    {
        key: 'all_total_labor_contract',
        titleSuffix: 'total_labor_contract',
        adminApiPrefix: 'employees/labor-contract/list-contract',
    },
    {
        key: 'expired_contract',
        titleSuffix: 'labor_contract_expried',
        adminApiPrefix: '/employees/labor-contract/list-history',
    },
    {
        key: 'almost_expired_contract',
        titleSuffix: 'labor_contract_almost_expried',
        adminApiPrefix: 'employees/labor-contract/list-contract?is_expiring=true',
    },
]
