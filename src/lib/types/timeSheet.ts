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

export type DaysInWeekData = {
    id: number
    name: string
    symbol: string
}