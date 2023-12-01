export type TimeOff = {
    id: number
    date: string | (() => string)
    number_of_minutes: number
    number_of_hours: number
    number_of_days: number
    employee_id: number | string
    type: number | string
}

export type ListTimeOff = Array<TimeOff>
export type ListTimeOffObj = {
    id: number
    listTimeOff: Array<TimeOff>
}
