export type TimeSheetData = {
    [x: string]: any
    id: number
    employee_id: number | null
    start_time: string | Date
    end_time: string | Date
    type: number
    date: string | Date
    company_id: number
    deleted_at: string | null
    total_time_work: number
    total_time_work_without_time_off: number
    late_time: number
    time_early: number
    overtime: any
    leave_form_has_timesheets: any
    compensatory_leave: any
    compensatory_leave_has_timesheet: any
    leave_form: any
    time_off: number
    type_time: number
}

export type TimeSheetLogData = {
    id: number
    employee_id: number | null
    date_time: string
    type: number
    note: string
}

export type TimesheetCalendarType = {
    message: any
    id: number
    employee_id: number | null
    employee_full_name?: string | null
    check_in_time: string
    check_out_time: string
    type: number
    date: string | Date
    approver_id: number
    approval_date: string
    note: string
    timesheet_id: number
    total_time_work: number
    total_time_work_without_time_off: number
    late_time: number
    time_early: number
    overtime: OvertimeType
    leave_form_has_timesheets: LeaveFormHasTimesheetType[]
    compensatory_leave_has_timesheet: CompensatoryLeaveHasTimesheetType
    employee_fullname: string
}

export type TimeSheetLogTodayData = {
    last: string
    first: string
}

export type DaysInWeekData = {
    id: number
    name: string
    symbol: string
}

export type WorkingDayData = {
    id: number
    name: string
    type: string
    start_time: string
    end_time: string
    end_lunch_break: string
    start_lunch_break: string
    day_in_week_id: number | string
    day_in_week_name?: string
}

export type OvertimeType = {
    id: number
    employee_id: number
    timesheet_id: number
    start_time: string
    end_time: string
    reason: string
    note: string
    status: number
    total_time_work: string
    approver_id: number
    approval_date: string
    coefficient_salary: number
    overtime_salary_coefficients: []
}

export type LeaveFormHasTimesheetType = {
    id: number
    timesheet_id: number
    leave_form_id: number
    start_time: string
    end_time: string
    time_off: string | number
    leave_form: {
        kolSymbol: object
        is_salary: number
    }
}

export type CompensatoryLeaveHasTimesheetType = {
    id: number
    timesheet_id: number
    compensatory_leave_id: number
    start_time: string
    end_time: string
    time_off: string | number
    compensatory_leave: {
        kolSymbol: string | ''
    }
}

export type OvertimeSalaryCoefficientsType = {
    id: number
    overtime_id: number
    start_time: string
    end_time: string
    salary_coefficient: number
    total_time_work: number
    working_time: number
    type_time?: number
}

export type CompensatoryWorkingDayData = {
    id: number
    start_date: string
    end_date: string
    start_time: string
    end_time: string
    start_lunch_break: string | null
    end_lunch_break: string | null
    name: string
    type: number
    total_time_work?: number
}
