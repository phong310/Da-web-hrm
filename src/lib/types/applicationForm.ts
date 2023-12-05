export type KindOfLeaveType = {
    id: number
    name: string
    coefficients_salary: number
    symbol: string
}

export type KolData = {
    id: number
    name: string
    symbol: string
    type: number
}

export type NumberOfDaysOffType = {
    number_of_minutes: string | number
    date: string
    employee_id: number
    number_of_days: number
}

export type InfoBankingUserType = {
    account_name: string
    account_number: number
    bank_name: string
    bank_branch: string
    type?: number
    id?: number
    personal_information_id?: number
}
export type relativesType = {
    first_name: string
    last_name: string
    birthday: string | Date
    relationship_type: number
    ward: string
    address: string
    district: string
    province: string
    phone: string
    sex: number
    is_dependent_person: boolean
    date_apply: string | Date
}
export type HolidayType = {
    name: string
    start_date: string | Date
    type: number
    id: number
    end_date: string | Date
}
export type GPSType = {
    id: number
    address: string
    longitude: number | string
    latitude: number | string
    allowable_radius: number | string
    note: string
    company_id: number
}
export type CompensatoryWorkingDayType = {
    id: number
    start_date: string
    end_date: string
    start_time: string
    end_time: string
    start_lunch_break: string | null
    end_lunch_break: string | null
    name: string
    type: number
}
export type WorkingType = {
    id: number
    name: string
    start_time: string
    end_time: string
    start_lunch_break: string
    end_lunch_break: string
    day_in_week_name: string
}
export type LeaveFormType = {
    check_out_time: string | Date
    check_in_time: string | Date
    id: number
    employee_id: number
    start_time: string | Date
    end_time: string | Date
    kind_leave_id: number
    kind_of_leave: KindOfLeaveType
    reason: string
    number_leave_day: number | string
    approver_id: number
    approver_id_1: number
    approver_id_2: number
    approval_deadline: string
    card_number: number
    approvers: [ModelHasApproversType]
    employee_name: string
    date: string
    note: string
    status: number
    model_type: string
    approver_1: string
    approver_2: string
    created_at: string | Date
    updated_at: string | Date
    number_of_days_off: NumberOfDaysOffType
    is_salary: number | boolean
    status_model_has_approve: number
}

export type LeaveFormTypeV2 = {
    check_out_time: string | Date
    check_in_time: string | Date
    id: number
    employee_id: number
    start_time: string | Date
    end_time: string | Date
    kind_leave_id: number
    kind_of_leave: KindOfLeaveType
    reason: string
    number_leave_day: number | string
    approver_id: number
    approver_id_1: number
    approver_id_2: number
    approval_deadline: string
    card_number: number
    approvers: [ModelHasApproversType]
    employee_name: string
    date: string
    note: string
    status: number
    model_type: string
    approver_1: string
    approver_2: string
    created_at: string | Date
    updated_at: string | Date
    number_of_days_off: NumberOfDaysOffType
    is_salary: number
    status_model_has_approve: number
    total_time_off: number
}
export type OvertimeFormType = {
    id: number
    employee_id: number
    card_number: number
    created_at: string
    start_time: string
    end_time: string
    reason: string
    approver: string
    approval_deadline: string
    approver_id_1: number
    approver_id_2: number
    approver_1: string
    approver_2: string
    approvers: [ModelHasApproversType]
    note: string
    status: number
    model_type: string
    date: string
    total_time_work: string
    employee_name: string
    status_model_has_approve: number
}

export type RequestChangeTimesheetFormType = {
    id: number
    employee_id: number
    card_number: number
    created_at: string
    check_in_time: string
    check_out_time: string
    date: string
    approver_1: string
    approvers: [ModelHasApproversType]
    approver_2: string
    approval_deadline: string
    approver_id_1: number
    approver_id_2: number
    note: string
    status: number
    model_type: string
    status_model_has_approve: number
    time_sheet: any
    timesheets_logs: any
}

export type CompensatoryLeaveFormType = {
    id: number
    employee_id: number
    start_time: string | Date
    end_time: string | Date
    kind_leave_id: number
    kind_of_leave: KindOfLeaveType
    reason: string
    number_leave_day: number | string
    approver_id: number
    approver_id_1: number
    approver_id_2: number
    approval_deadline: string
    card_number: number
    approvers: [ModelHasApproversType]
    employee_name: string
    date: string
    note: string
    status: number
    model_type: string
    approver_1: string
    approver_2: string
    created_at: string | Date
    updated_at: string | Date
    number_of_days_off: NumberOfDaysOffType
    status_model_has_approve: number
}
export type position = {
    id: number
    name: string
    company_id: number
}
export type ModelHasApproversType = {
    avatar: any
    full_name: string
    approval_time: string
    rejected_time: string
    status: number
    employee_code: string
    position: position
}
