export type Relative = {
    id: number
    first_name: string
    last_name: string
    birthday: string
    relationship_type: number | any,
    ward: string
    address: string
    district: string
    province: string
    phone: number | any
    sex: number | any
    employee_id: number | any,
    is_dependent_person: boolean | any,
    date_apply: Date | any
}

export type Relatives = Array<Relatives>
export type RelativesObj = {
    id: number
    relatives: Array<Relative>
}
