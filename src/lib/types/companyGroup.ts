import { SystemSetting } from './system_setting'

type CompanyGroup = {
    id: number
    name: string
    companies_count: number
}

// type CompanyGroupRelation = {
//   companies: CompanyGroupType[] | number[]
// }

// type GroupCompany = CompanyGroup & CompanyGroupRelation

export type { CompanyGroup }

export type Company = {
    id: number
    name: string
    phone_number: string
    tax_code: string
    address: string
    start_time: string
    end_time: string
    register_date: string
    created_at: string | null
    updated_at: string | null
    setting: SystemSetting
}

export type CompanyData = {
    id: number
    name: string
    phone_number: string
    tax_code: string
    address: string
    status: number
    type_of_business: number,
    representative: string,
    logo: string
    start_time?: Date | string
    end_time?: Date | string
    register_date?: Date | string
    is_create?: number
}