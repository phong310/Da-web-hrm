export type BaseMaster = {
    id: number
    name: string
}
export type RegionData = {
    id: number
    name: string
    code: string
    level: number
    parent_id: number
    parent_name?: string
}
export type LaborContractTypeData = {
    id: number
    name: string
    duration_of_contract: number | null
    allowances?: AllowanceData[] | number[]
    status_apply_holiday: number
}
export type AllowanceData = {
    id: number
    name: string
    status: number
    amount_of_money: number
}

export type BaseMasterResponse = {
    data: BaseMaster[]
}
