// import { SettingTypesOvertimeType } from 'lib/types'
// import {
//     addOneDayWhenZeroHour,
//     diffTimeInMinutes,
//     formatDateTime,
//     formatFullTime,
//     greaterThanOrEqualHour,
//     lessThanOrEqualHour,
//     subOneDayWhenZeroHour

import { SettingTypesOvertimeType } from "lib/types/settingTypesOvertime"
import { formatDateTime, formatFullTime } from "./format"
import { addOneDayWhenZeroHour, diffTimeInMinutes, greaterThanOrEqualHour, lessThanOrEqualHour, subOneDayWhenZeroHour } from "./datetime"

// } from 'lib/utils'
export const handleCalculateTotalOvertime = (
    start_time: string,
    end_time: string,
    date: string,
    type_of_overtime: SettingTypesOvertimeType
) => {
    // eslint-disable-next-line no-var
    var f_start_time = setInitTime(formatFullTime(start_time))
    // eslint-disable-next-line no-var
    var f_end_time = addOneDayWhenZeroHour(setInitTime(formatFullTime(end_time)))

    return type_of_overtime.setting_ot_salary_coefficients.reduce((total, coefficient) => {
        const coefficient_start_time = setInitTime(coefficient.start_time as string)
        const coefficient_end_time = addOneDayWhenZeroHour(setInitTime(coefficient.end_time as string))

        return (
            total + getTotalTime(f_start_time, f_end_time, coefficient_start_time, coefficient_end_time)
        )
    }, 0)
}

const getTotalTime = (
    start_time: string,
    end_time: string,
    coefficient_start_time: string,
    coefficient_end_time: string
) => {
    const total = 0

    if (
        greaterThanOrEqualHour(start_time, coefficient_start_time) &&
        lessThanOrEqualHour(end_time, coefficient_end_time)
    ) {
        return diffTimeInMinutes(start_time, subOneDayWhenZeroHour(end_time))
    }

    if (
        greaterThanOrEqualHour(start_time, coefficient_start_time) &&
        greaterThanOrEqualHour(end_time, coefficient_end_time) &&
        lessThanOrEqualHour(start_time, coefficient_end_time)
    ) {
        return diffTimeInMinutes(start_time, subOneDayWhenZeroHour(coefficient_end_time))
    }

    if (
        lessThanOrEqualHour(start_time, coefficient_start_time) &&
        greaterThanOrEqualHour(end_time, coefficient_end_time)
    ) {
        return diffTimeInMinutes(coefficient_start_time, subOneDayWhenZeroHour(coefficient_end_time))
    }

    if (
        lessThanOrEqualHour(start_time, coefficient_start_time) &&
        lessThanOrEqualHour(end_time, coefficient_end_time)
    ) {
        return diffTimeInMinutes(coefficient_start_time, subOneDayWhenZeroHour(end_time))
    }
    return total
}

const setInitTime = (time: string) => {
    const timeString = '2020/01/01 ' + time
    return formatDateTime(timeString)
}
