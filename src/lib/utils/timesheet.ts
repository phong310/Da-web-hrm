// @ts-nocheck
import {
    addDays,
    endOfMonth,
    getISOWeek,
    isSameMonth,
    parse,
    startOfMonth,
    startOfWeek
} from 'date-fns'
import { formatNormalDateV2, formatYearMonth } from './format'

export const getDateOfWeek = (month: Date | string, week: number) => {
    const monthS = formatYearMonth(new Date(month).getMonth() + 1, new Date(month).getFullYear())

    const firstDayOfMonth = startOfMonth(new Date(monthS))

    const firstDayOfWeek = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 })

    const daysToAdd = (week - 1) * 7
    // Tính toán ngày bắt đầu và ngày kết thúc của tuần
    const startDate = addDays(firstDayOfWeek, daysToAdd)
    const endDate = addDays(startDate, 6)
    return {
        startDate: formatNormalDateV2(startDate),
        endDate: formatNormalDateV2(endDate)
    }
}

export const checkDateWeek = (
    startDate: Date | string,
    endDate: Date | string,
    month: Date | string
) => {
    // Lấy đầu tháng và cuối tháng của tháng hiện tại
    const startOfMonthDate = startOfMonth(new Date(month))
    const endOfMonthDate = endOfMonth(new Date(month))
    return {
        startviewDate:
            new Date(startDate) <= startOfMonthDate ? formatNormalDateV2(startOfMonthDate) : startDate,
        endviewDate: new Date(endDate) >= endOfMonthDate ? formatNormalDateV2(endOfMonthDate) : endDate
    }
}

export const getMonthInNow = () => {
    const currentDate = new Date()
    const year = currentDate.getFullYear() // Lấy ra năm
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0') // Lấy ra tháng và định dạng thành chuỗi có 2 chữ số, có thêm số 0 nếu chỉ có 1 chữ số

    const formattedDate = `${year}-${month}`
    return {
        formattedDate: formattedDate
    }
}

export const checkDayOfMonth = (month: string | Date, day: string | Date) => {
    // Lấy đầu tháng và cuối tháng của tháng hiện tại
    const startOfMonthDate = startOfMonth(new Date(month))
    const endOfMonthDate = endOfMonth(new Date(month))

    const targetDate = new Date(day)
    return targetDate >= startOfMonthDate && targetDate <= endOfMonthDate
}

export const WeekOfNumber = () => {
    let currentDate = new Date()
    let dayOfMonth = currentDate.getDate()
    // @ts-ignore
    let dayOfWeek = currentDate.getDay()
    let firstWeekdayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
    if (firstWeekdayOfMonth === 0) {
        firstWeekdayOfMonth = 7
    }
    let weekOfMonth = Math.ceil((dayOfMonth + firstWeekdayOfMonth - 2) / 7)
    return {
        weekOfMonth: weekOfMonth
    }
}

export const isCheckDate = (date: string | Date): boolean => {
    if (date instanceof Date) {
        return !isNaN(date.getTime());
    } else {
        return !isNaN(Date.parse(date));
    }
};