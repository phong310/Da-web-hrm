// @ts-nocheck
export enum Permissions {
    timeKeeping = 'timekeeping.list',
    overtimeManage = 'overtime.manage',
    leaveFormManage = 'leave-form.manage',
    requestChangeTimesheetsManage = 'request-change-timesheets.manage',
    salariesManage = 'salaries.manage'
    // laborContractManage = 'labor-contracts.manage',
    // employeeManage = 'employees.manage'
}

export const checkHasPermissons = (permissons: string | string[]) => {
    if (typeof permissons === 'string') {
        Object.keys(allPermissions).forEach(function (key, index) {
            //@ts-ignore
            if (allPermissions[key] === permissons) {
                return true;
            }
        });
        return false;
    }

    permissons.map(p => {
        Object.keys(allPermissions).forEach(function (key, index) {
            //@ts-ignore
            if (allPermissions[key] === p) {
                return true;
            }
        });
    })
    return false;

}

export const allPermissions = {
    "users_list": "users.list",
    "users_store": "users.store",
    "users_update": "users.update",
    "users_detail": "users.detail",
    "users_destroy": "users.destroy",
    "roles_list": "roles.list",
    "roles_store": "roles.store",
    "roles_update": "roles.update",
    "roles_detail": "roles.detail",
    "roles_destroy": "roles.destroy",
    "holiday_list": "holiday.list",
    "holiday_store": "holiday.store",
    "holiday_update": "holiday.update",
    "holiday_detail": "holiday.detail",
    "holiday_destroy": "holiday.destroy",
    "working-day_list": "working-day.list",
    "working-day_store": "working-day.store",
    "working-day_update": "working-day.update",
    "working-day_detail": "working-day.detail",
    "working-day_destroy": "working-day.destroy",
    "regions_list": "regions.list",
    "regions_store": "regions.store",
    "regions_update": "regions.update",
    "regions_detail": "regions.detail",
    "regions_destroy": "regions.destroy",
    "jobs_list": "jobs.list",
    "jobs_store": "jobs.store",
    "jobs_update": "jobs.update",
    "jobs_detail": "jobs.detail",
    "jobs_destroy": "jobs.destroy",
    "positions_list": "positions.list",
    "positions_store": "positions.store",
    "positions_update": "positions.update",
    "positions_detail": "positions.detail",
    "positions_destroy": "positions.destroy",
    "peoples_list": "peoples.list",
    "peoples_store": "peoples.store",
    "peoples_update": "peoples.update",
    "peoples_detail": "peoples.detail",
    "peoples_destroy": "peoples.destroy",
    "departments_list": "departments.list",
    "departments_store": "departments.store",
    "departments_update": "departments.update",
    "departments_detail": "departments.detail",
    "departments_destroy": "departments.destroy",
    "titles_list": "titles.list",
    "titles_store": "titles.store",
    "titles_update": "titles.update",
    "titles_detail": "titles.detail",
    "titles_destroy": "titles.destroy",
    "branch_list": "branch.list",
    "branch_store": "branch.store",
    "branch_update": "branch.update",
    "branch_detail": "branch.detail",
    "branch_destroy": "branch.destroy",
    "kind-of-leave_list": "kind-of-leave.list",
    "kind-of-leave_store": "kind-of-leave.store",
    "kind-of-leave_update": "kind-of-leave.update",
    "kind-of-leave_detail": "kind-of-leave.detail",
    "kind-of-leave_destroy": "kind-of-leave.destroy",
    "days-in-week_list": "days-in-week.list",
    "days-in-week_store": "days-in-week.store",
    "days-in-week_update": "days-in-week.update",
    "days-in-week_detail": "days-in-week.detail",
    "days-in-week_destroy": "days-in-week.destroy",
    "education-level_list": "education-level.list",
    "education-level_store": "education-level.store",
    "education-level_update": "education-level.update",
    "education-level_detail": "education-level.detail",
    "education-level_destroy": "education-level.destroy",
    "employees_list": "employees.list",
    "employees_store": "employees.store",
    "employees_update": "employees.update",
    "employees_detail": "employees.detail",
    "employees_destroy": "employees.destroy",
    "timekeeping_list": "timekeeping.list",
    "timekeeping_store": "timekeeping.store",
    "timekeeping_update": "timekeeping.update",
    "timekeeping_detail": "timekeeping.detail",
    "timekeeping_destroy": "timekeeping.destroy",
    "timekeeping_manage": "timekeeping.manage",
    "leave-form_list": "leave-form.list",
    "leave-form_store": "leave-form.store",
    "leave-form_update": "leave-form.update",
    "leave-form_detail": "leave-form.detail",
    "leave-form_destroy": "leave-form.destroy",
    "leave-form_manage": "leave-form.manage",
    "overtime_list": "overtime.list",
    "overtime_store": "overtime.store",
    "overtime_update": "overtime.update",
    "overtime_detail": "overtime.detail",
    "overtime_destroy": "overtime.destroy",
    "overtime_manage": "overtime.manage",
    "request-change-timesheets_list": "request-change-timesheets.list",
    "request-change-timesheets_store": "request-change-timesheets.store",
    "request-change-timesheets_update": "request-change-timesheets.update",
    "request-change-timesheets_detail": "request-change-timesheets.detail",
    "request-change-timesheets_destroy": "request-change-timesheets.destroy",
    "request-change-timesheets_manage": "request-change-timesheets.manage",
    "companies_list": "companies.list",
    "companies_store": "companies.store",
    "companies_update": "companies.update",
    "companies_detail": "companies.detail",
    "companies_destroy": "companies.destroy",
    "timesheet-logs_list": "timesheet-logs.list",
    "timesheet-logs_store": "timesheet-logs.store",
    "timesheet-logs_update": "timesheet-logs.update",
    "timesheet-logs_detail": "timesheet-logs.detail",
    "timesheet-logs_destroy": "timesheet-logs.destroy",
    "timesheet-logs_manage": "timesheet-logs.manage",
    "compensatory_leave_list": "compensatory_leave.list",
    "compensatory_leave_store": "compensatory_leave.store",
    "compensatory_leave_update": "compensatory_leave.update",
    "compensatory_leave_detail": "compensatory_leave.detail",
    "compensatory_leave_destroy": "compensatory_leave.destroy",
    "compensatory_leave_manage": "compensatory_leave.manage",
    "employees_manage": "employees.manage",
    "labor-contracts_list": "labor-contracts.list",
    "labor-contracts_store": "labor-contracts.store",
    "labor-contracts_update": "labor-contracts.update",
    "labor-contracts_detail": "labor-contracts.detail",
    "labor-contracts_destroy": "labor-contracts.destroy",
    "labor-contracts_manage": "labor-contracts.manage",
    "salaries_list": "salaries.list",
    "salaries_store": "salaries.store",
    "salaries_update": "salaries.update",
    "salaries_detail": "salaries.detail",
    "salaries_destroy": "salaries.destroy",
    "salaries_manage": "salaries.manage"
}
