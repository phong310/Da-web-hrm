import { addDays, differenceInMinutes } from 'date-fns'
import i18n from 'lib/lang/translations/i18n'
import { CompensatoryWorkingDayData, WorkingDayData } from 'lib/types/timeSheet'
import { formatDate, formatDateTime, formatFullTime } from './format'
import { COMPENSATORY_WD_TYPE, HOLIDAY_TYPE } from './contants'
import { HolidayType } from 'lib/types/applicationForm'

function getDaysInMonth(year: number, month: number) {
    const date = new Date(year, month, 1)

    const days: number[] = []
    while (date.getMonth() === month) {
        days.push(date.getDate())
        date.setDate(date.getDate() + 1)
    }

    return days
}

function getLastDateinMonth() {
    const lastDate = new Date()
    lastDate.setMonth(lastDate.getMonth() + 1)
    lastDate.setDate(0)
    return lastDate
}

// new
const minutesToOnlyHours = (m: number | string) => {
    m = Number(m)
    if (m % 60 === 0) {
        return m / 60
    }

    if (Number(m / 60) < 0.01) {
        return 0
    }

    return Number((m / 60).toFixed(1)) == Number((m / 60).toFixed(2))
        ? (m / 60).toFixed(1)
        : (m / 60).toFixed(2)
}

const minutesToDays: any = (
    m: number,
    fullText?: boolean,
    t?: any,
    days?: boolean,
    hours?: boolean,
    minutes?: boolean
) => {
    m = Math.floor(m)
    const day = Math.floor(m / 60 / 8)
    const hour = Math.floor(m / 60) % 8
    const minute = m % 60

    let res = ''

    if (fullText) {
        if (day != 0) {
            res += day + ` ${i18n.t('day')} `

            if (days) {
                return res
            }
        }

        if (hour != 0) {
            res += hour + ` ${i18n.t('hour')} `
            if (hours) {
                return res
            }
        }

        if (minute != 0) {
            res += minute + ` ${i18n.t('minute')} `
        }
    } else {
        if (day != 0) {
            res += day + 'd '

            if (days) {
                return res
            }
        }

        if (hour != 0) {
            res += hour + 'h'
        }

        if (minute != 0) {
            res += minute + 'm'
        }
    }

    return res
}

const isPast = (date: Date | string) => {
    const d = new Date(date)
    return d < new Date()
}

const minutesToHours = (m: number) => {
    m = Math.floor(m)
    const hour = Math.floor(m / 60)
    const minute = m % 60

    let res = ''

    if (hour != 0) {
        res += hour + 'h'
    }

    if (minute != 0) {
        res += minute + 'm'
    }

    return res
}

const getDayIdInDate = (date: Date | string) => {
    const d = new Date(date)
    const res = Number(d.getDay()) == 0 ? 7 : Number(d.getDay())
    return res
}

const addHours = (numOfHours: any, date: any = new Date()) => {
    date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000)

    return date
}

const isFuture = (date: Date | string) => {
    const d = new Date(date)
    return d > new Date()
}


const isWeekend = (date: Date | string) => {
    const d = new Date(date)

    return d.getDay() === 0 || d.getDay() === 6
}

const isDayOff = (date: Date | string, workingDays: WorkingDayData[] | undefined) => {
    if (workingDays) {
        const check = workingDays.some((wd) => wd.day_in_week_id === getDayIdInDate(date))
        return check
    }
}

const isCompensatoryWorkingDay = (
    date: Date | string,
    compensatoryWD: CompensatoryWorkingDayData[]
) => {
    return compensatoryWD.find((c: CompensatoryWorkingDayData) => {
        let type_format = 'dd/MM/yyyy'
        if (c.type === COMPENSATORY_WD_TYPE['ANNUAL']) {
            type_format = 'dd/MM'
        }
        return (
            formatDate(c.start_date, type_format) <= formatDate(date, type_format) &&
            formatDate(c.end_date, type_format) >= formatDate(date, type_format)
        )
    })
}
const isHoliday = (date: Date | string, holidays: HolidayType[]) => {
    return !!holidays.find((h: HolidayType) => {
        let type_format = 'dd/MM/yyyy'

        if (h.type === HOLIDAY_TYPE['ANNUAL']) {
            type_format = 'dd/MM'
        }
        return (
            formatDate(h.start_date, type_format) <= formatDate(date, type_format) &&
            formatDate(h.end_date, type_format) >= formatDate(date, type_format)
        )
    })
}

export const isWorkingDay = (
    date: Date | string,
    workingDays: WorkingDayData[],
    holidays: HolidayType[]
) => {
    return (
        workingDays?.find((wd) => wd.day_in_week_id == getDayIdInDate(date)) &&
        !isHoliday(date, holidays)
    )
}

export const diffTimeInMinutes = (time1: Date | string, time2: Date | string) => {
    if (!time1 || !time2) return 0

    const diff = differenceInMinutes(
        formatFullTime(time2) == '00:00:00' ? addDays(new Date(time2), 1) : new Date(time2),
        new Date(time1)
    )
    return diff >= 0 ? diff : 0
}

export const addDayWhenZeroHour = (date: Date | string, day: number) => {
    return formatFullTime(date) == '00:00:00'
        ? formatDateTime(addDays(new Date(date), day))
        : formatDateTime(new Date(date))
}

export const greaterThanOrEqualHour = (date1: Date | string, date2: Date | string) => {
    return new Date(date1) >= new Date(date2)
}

export const greaterThanHour = (date1: Date | string, date2: Date | string) => {
    return new Date(date1) > new Date(date2)
}

export const lessThanOrEqualHour = (date1: Date | string, date2: Date | string) => {
    return new Date(date1) <= new Date(date2)
}

export const lessThanHour = (date1: Date | string, date2: Date | string) => {
    return new Date(date1) < new Date(date2)
}

export const addOneDayWhenZeroHour = (date: Date | string) => {
    return addDayWhenZeroHour(date, 1)
}

export const subOneDayWhenZeroHour = (date: Date | string) => {
    return addDayWhenZeroHour(date, -1)
}

export const setInitTime = (time: string) => formatDateTime(new Date('2020-01-01 ' + time))

export const dayAfterOneYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1))

export {
    addHours, getDayIdInDate, getDaysInMonth,
    getLastDateinMonth, isCompensatoryWorkingDay, isDayOff, isFuture, isHoliday, isPast, isWeekend, minutesToDays, minutesToHours,
    minutesToOnlyHours
}

