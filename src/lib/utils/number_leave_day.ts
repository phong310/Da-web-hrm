import { CompensatoryWorkingDayData, WorkingDayData } from "lib/types/timeSheet"
import { formatDate, formatTime } from "./format"
import { getDayIdInDate } from "./datetime"

export const numberLeaveDay = (
    start: Date | string,
    end: Date | string,
    workingDays: WorkingDayData[] | undefined,
    compensatoryWorkingDays: CompensatoryWorkingDayData[] | undefined
) => {
    const timeOfStartTime = formatTime(start)
    const timeOfEndTime = formatTime(end)

    let total = 0
    for (let d = new Date(start); d <= new Date(end); d.setDate(d.getDate() + 1)) {
        const date = formatDate(d, 'yyyy/MM/dd')
        const workingDay = workingDays?.find((wd) => wd.day_in_week_id == getDayIdInDate(date))

        const compensatoryWorkingDay = compensatoryWorkingDays?.find(
            (c) =>
                formatDate(c.start_date, 'yyyy/MM/dd') <= date &&
                formatDate(c.end_date, 'yyyy/MM/dd') >= date
        )

        if (compensatoryWorkingDay) {
            switch (true) {
                case formatDate(start, 'yyyy/MM/dd') == formatDate(end, 'yyyy/MM/dd'):
                    total += getTotalTime(timeOfStartTime, timeOfEndTime, compensatoryWorkingDay)
                    break
                case date === formatDate(start, 'yyyy/MM/dd'):
                    total += getTotalTime(
                        timeOfStartTime,
                        compensatoryWorkingDay.end_time,
                        compensatoryWorkingDay
                    )
                    break
                case date === formatDate(end, 'yyyy/MM/dd'):
                    total += getTotalTime(
                        compensatoryWorkingDay.start_time,
                        timeOfEndTime,
                        compensatoryWorkingDay
                    )
                    break
                default:
                    total += getTotalTime(
                        compensatoryWorkingDay.start_time,
                        compensatoryWorkingDay.end_time,
                        compensatoryWorkingDay
                    )
            }
        }

        if (workingDay) {
            switch (true) {
                case formatDate(start, 'yyyy/MM/dd') == formatDate(end, 'yyyy/MM/dd'):
                    total += getTotalTime(timeOfStartTime, timeOfEndTime, workingDay)
                    break
                case date === formatDate(start, 'yyyy/MM/dd'):
                    total += getTotalTime(timeOfStartTime, workingDay.end_time, workingDay)
                    break
                case date === formatDate(end, 'yyyy/MM/dd'):
                    total += getTotalTime(workingDay.start_time, timeOfEndTime, workingDay)
                    break
                default:
                    total += getTotalTime(workingDay.start_time, workingDay.end_time, workingDay)
            }
        }
    }
    return total
}

export const getTotalWorkingDays = (
    start: Date | string,
    end: Date | string,
    start_lunch_break: Date | undefined | string,
    end_lunch_break: Date | undefined | string
): number => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    let startLunchBreak
    if (start_lunch_break) {
        startLunchBreak = new Date(start_lunch_break)
    }
    let endLunchBreak
    if (end_lunch_break) {
        endLunchBreak = new Date(end_lunch_break)
    }
    let lunchBreakTime
    if (startLunchBreak && endLunchBreak) {
        lunchBreakTime =
            (endLunchBreak.getHours() - startLunchBreak.getHours()) * 60 +
            (endLunchBreak.getMinutes() - startLunchBreak.getMinutes())
    }
    const workingTimeDiff =
        (endDate.getHours() - startDate.getHours()) * 60 +
        (endDate.getMinutes() - startDate.getMinutes())
    let totalTimeWithoutLunchBreak
    if (lunchBreakTime) {
        totalTimeWithoutLunchBreak = workingTimeDiff - lunchBreakTime
    } else {
        totalTimeWithoutLunchBreak = workingTimeDiff
    }
    return totalTimeWithoutLunchBreak
}

export const getTotalTime = (
    start_time: number | string,
    end_time: number | string,
    workingDay: WorkingDayData | CompensatoryWorkingDayData
) => {
    const setting_start_work = workingDay.start_time
    const setting_end_work = workingDay.end_time
    const start_lunch_break = workingDay.start_lunch_break
    const end_lunch_break = workingDay.end_lunch_break

    let start_time_calculate: any = setting_start_work
    let end_time_calculate: any = setting_end_work
    let total_time: any = 0

    // Nếu ngày làm đó chỉ làm nửa ngày
    if (!start_lunch_break || !end_lunch_break) {
        if (start_time > setting_start_work) {
            start_time_calculate = start_time
        }

        if (end_time < setting_end_work) {
            end_time_calculate = end_time
        }

        total_time = floatDiffInMinutes(start_time_calculate, end_time_calculate)
    } else {
        // 1. Check nếu bắt đầu nghỉ sau giờ bắt đầu làm việc
        let is_check_late_time = true

        if (start_time > setting_start_work) {
            // Thời gian bắt đầu nghỉ muộn hơn thời gian bắt đầu làm việc và trước thời gian ăn trưa
            if (start_lunch_break >= start_time && is_check_late_time) {
                start_time_calculate = start_time
                is_check_late_time = false
            }

            // Nếu bắt đầu nghỉ trước giờ bắt đầu ăn trưa và sau giờ kết thúc ăn trưa
            if (start_time <= end_lunch_break && is_check_late_time) {
                start_time_calculate = end_lunch_break
                is_check_late_time = false
            }

            // Nếu bắt đầu nghỉ sau giờ bắt đầu ăn trưa
            if (start_time >= end_lunch_break && is_check_late_time) {
                start_time_calculate = start_time
            }
        }

        // 2. Check nếu kết thúc nghỉ trước thời gian kết thúc làm việc trong ngày
        let is_check_time_early = true
        if (end_time < setting_end_work) {
            // Thời gian kết thúc nghỉ trước giờ làm việc
            if (start_lunch_break >= end_time && is_check_time_early) {
                is_check_time_early = false
                end_time_calculate = end_time
            }

            // Thời gian kết thúc nghỉ sau o thoi gian an trua
            if (end_time > start_lunch_break && end_time <= end_lunch_break && is_check_time_early) {
                is_check_time_early = false
                end_time_calculate = end_lunch_break
            }

            // Thời gian kết thúc nghỉ sau thoi gian an trua
            if (end_time > end_lunch_break && is_check_time_early) {
                end_time_calculate = end_time
            }
        }
        // Neu thoi gian nghi ko nam trong thoi gian lam viec
        if (
            (start_time <= setting_start_work && end_time <= setting_start_work) ||
            (start_time >= setting_end_work && end_time >= setting_end_work)
        ) {
            return (total_time = 0)
        }

        // Nếu thời gian bắt đầu nghỉ và kết thúc nghỉ đều nằm trước thời gian bắt đầu ăn trưa hoặc sau thời gian ăn trưa
        if (
            (start_time_calculate <= start_lunch_break && end_time_calculate <= start_lunch_break) ||
            (start_time_calculate >= end_lunch_break && end_time_calculate >= end_lunch_break)
        ) {
            total_time = floatDiffInMinutes(start_time_calculate, end_time_calculate)
        } else {
            total_time =
                floatDiffInMinutes(start_time_calculate, start_lunch_break) +
                floatDiffInMinutes(end_lunch_break, end_time_calculate)
        }
    }
    return total_time
}

export const floatDiffInMinutes = (start: any, end: any) => {
    const start_time = Number(new Date(formatDate(new Date(), 'yyyy/MM/dd') + ' ' + start))
    const end_time = Number(new Date(formatDate(new Date(), 'yyyy/MM/dd') + ' ' + end))

    const diff = Math.abs(end_time - start_time)
    return Math.round(diff / 1000 / 60)
}
