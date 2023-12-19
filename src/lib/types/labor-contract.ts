export type LaborContractType = {
    id: number
    employee_id: number | any
    branch_id: number
    position_id: number
    code: string
    labor_contract_type_id: number
    sign_date: string | Date
    effective_date: string | Date
    expire_date: string | Date
    note: string
    status: number,
    basic_salary: number
    insurance_salary: number | string
    termination_date: string | Date,
    labor_contract_type: LaborContractTypeType,
    reason_contract_termination: string
    allowances?: AllowanceType[] | number[]
    addresses?: AddressType[]
    is_health_insurance: boolean
    is_syndicate: boolean
    is_unemployment_insurance: boolean
    is_social_insurance: boolean,
    employee: LaborContract_Employee,
    hourly_salary: number,
    is_system_insurance_salary: number
}



export type SalaryTaxCoefficientSettingsType = {
    id: number
    currency: string
    amount_money_syndicate: number | null
    percent_social_insurance: number
    percent_medical_insurance: number
    percent_unemployment_insurance: number
    reduce_yourself: number
    family_allwances: number
    insurance_salary: number
    percent_syndicate: number | null
}

export type AllowanceType = {
    id: number
    name: string
    status: number
    amount_of_money: number
    company_id: number
}

export type LaborContractTypeHasAllowanceType = {
    id: number
    labor_contract_type_id: number
    allowance_id: number
}

export type LaborContractHasAllowanceType = {
    id: number
    labor_contract_id: number
    allowance_id: number
}

export type LaborContractTypeType = {
    id: number
    name: string
    company_id: number
    duration_of_contract: number
    allowances?: AllowanceType[]
}

export type AddressType = {
    id: number
    province: string
    district: string
    ward: string
    address: string
    type: number
    labor_contract_id?: number
    personal_information_id?: number
}

export type LaborContract_Employee = {
    employee_code: string
    personal_information: {
        birthday: string | Date
        email: string
        full_name: string
        phone: string
        sex: number
    }
    position: {
        name: string | any
    }
    branch: {
        name: string | any
    }
    department: {
        name: string | any
    }
}