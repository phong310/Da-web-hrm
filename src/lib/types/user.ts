import { Address } from "./address"
import { BaseMaster } from "./baseMaster"
import { Company } from "./companyGroup"
import { SystemSetting } from "./system_setting"

export type UserType = {
    id: number
    email: string
    name: string
    user_name?: string
    phone: string
    password: string | null
    all_permissions: string[]
    role: string
    created_at: string | null
    deleted_at: string | null
    updated_at: string | null
    email_verified_at: string | null
    employee_id: number | null
    noti_channel: string
    is_first_time_login: boolean | number
    company: Company
    setting: SystemSetting
    employee: EmployeeType
}

export type PersonalInformationType = {
    id: number
    first_name: string
    last_name: string
    job_id: number
    nickname: string | undefined
    birthday: string
    marital_status: string | null
    sex: number | null
    education_level_id: number
    email: string | undefined
    phone: string
    note: string | null
    country_id: number
    country: { name: string }
    ethnic_id: number
    deleted_at: string
    full_name: string
    ethnic: string
    addresses: Address[]
    position_id: number
    job: { name: string }
    thumbnail_url: string
    title: { name: string }
}

export type EmployeeType = {
    id: number
    card_number: number
    employee_code: string
    official_employee_date: string
    date_start_work: string
    position_id: number
    department_id: number
    branch_id: number
    branch: BaseMaster
    department: BaseMaster
    position: BaseMaster
    personal_information_id: number
    personal_information: PersonalInformationType
    full_name: string
    status: string
    deleted_at: string
    bank_branch: string
    account_name: string
    bank_name: string
    account_number: number
    ID_no: number
    issued_by: string
    issued_date: string
    ID_expire: string
    province: string
    district: string
    ward: string
    address: string
    provinceOrigin: string
    districtOrigin: string
    wardOrigin: string
    addressOrigin: string
}
