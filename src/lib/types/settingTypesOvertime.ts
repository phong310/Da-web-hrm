export type SettingTypesOvertimeType = {
    id: number
    company_id: number
    type: number
    setting_ot_salary_coefficients: SettingOvertimeSalaryCoefficient[]
}

export type SettingOvertimeSalaryCoefficient = {
    id: number
    company_id: number
    start_time: string | Date | null
    end_time: string | Date | null
    salary_coefficient: number
    total_time: number
}
