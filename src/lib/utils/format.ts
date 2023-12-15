//@ts-nocheck
import { format, parseISO } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { enUS, vi } from 'date-fns/locale'
import i18n from 'lib/lang/translations/i18n'
import { SystemSetting } from 'lib/types/system_setting'


const language = localStorage.getItem('language') || 'vi'
const system_setting: SystemSetting = JSON.parse(
    localStorage.getItem('system-setting') == 'undefined'
        ? '{}'
        : localStorage.getItem('system-setting') || '{}'
)

type localeType = {
    [key: string]: Locale
}

const locale: localeType = {
    vi: vi,
    en: enUS,
}

export const formatNormalDate = (d: Date | string) => {
    return format(new Date(d), 'dd/MM/yyyy')
}
export const formatISODate = (date: Date | string) => format(new Date(date), 'yyyy/MM/dd')

export const formatISODateToDashes = (date: Date | string) => format(new Date(date), 'yyyy-MM-dd')

export const formatDateTime = (date: Date | string) => {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(parsedDate.getTime())) {
        return 'Invalid Date';
    }
    const formattedString = format(parsedDate, 'yyyy/MM/dd HH:mm:ss');

    return formattedString;
};

export const getOnlyTimeFromDate = (value: any) => {
    if (!value) {
        return ''
    }
    return new Date(value).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    })
}
export const replaceDashesToSlashes = (d: any) => {
    if (typeof d === 'string') {
        d = d.replace(/-/g, '/')
        return d
    }
    return d
}

export const formatTime = (d: Date | string) => {
    d = replaceDashesToSlashes(d);

    // Kiểm tra xem giá trị có thể chuyển đổi thành đối tượng Date hay không
    if (isNaN(Date.parse(d))) {
        return ''; // hoặc giá trị mặc định khác
    }

    return format(new Date(d), 'HH:mm');
}


export const formatDate = (d: Date | string , formatDate = 'dd/MM/yyyy') => {
    if (!d) {
        return d
    }
    return format(new Date(d), formatDate)
}



export const changeTimeZone = (date: Date | string, timeZone: string) => {
    return utcToZonedTime(date, timeZone)
}

export const convertLocalDatetimeToTZ = (d: Date | string) => {
    d = replaceDashesToSlashes(d)
    const date = new Date(d)
    const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const localDate = changeTimeZone(d, localTimezone)
    //@ts-ignore
    const tzDate = changeTimeZone(d, system_setting?.time_zone)
    const offset = localDate.getTime() - tzDate.getTime()
    date.setTime(date.getTime() - offset)
    return date
}

export const convertDatetimeTZV2 = (d: Date | string, timezone = 'UTC') => {
    const date = typeof d === 'string' ? parseISO(d) : d;

    const utcDate = utcToZonedTime(date, 'UTC');
    const tzDate = utcToZonedTime(date, timezone);

    const offset = utcDate.getTime() - tzDate.getTime();
    date.setTime(date.getTime() - offset);

    return date;
};

export const convertFormatDate = (d: Date | string, format_date = 'yyyy/MM/dd') => {
    if (!d) {
        return null
    }
    // d = replaceDashesToSlashes(d)
    const date = convertDatetimeTZV2(d)

    //@ts-ignore
    return format(new Date(date), format_date)
}


export const formatFullTime = (d: Date | string) => {
  return format(new Date(d), 'HH:mm:ss')
}

export const formatYearMonth = (m: number, y: number) => {
    let month: number | string = m
    if (month < 10) {
        month = '0' + month
    }
    return y + '-' + month
}

export const convertDatetimeTZ = (d: Date | string, timezone = 'UTC') => {
    let date = new Date(d)
    if (typeof d === 'string') {
        date = new Date(d.split(' ').join('T') + 'Z')
    }

    const utcDate = changeTimeZone(d, 'UTC')
    //@ts-ignorez
    const tzDate = changeTimeZone(date, timezone)
    // alert(tzDate)
    const offset = utcDate.getTime() - tzDate.getTime()
    date.setTime(date.getTime() - offset)
    return tzDate
}

export const formatNormalTime = (d: Date | string) => {
    d = replaceDashesToSlashes(d)
    // Kiểm tra xem giá trị có thể chuyển đổi thành đối tượng Date hay không
    if (isNaN(Date.parse(d))) {
        return ''; // hoặc giá trị mặc định khác
    }
    return format(new Date(d), 'HH:mm:ss')
}

export const getAllDaysInMonth = (month: number, year: number) =>
    Array.from(
        { length: new Date(year, month, 0).getDate() }, // get next month, zeroth's (previous) day
        (_, i) => new Date(year, month - 1, i + 1) // get current month (0 based index)
    )

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
export const replaceSlashesToDashes = (d: any) => {
    if (typeof d === 'string') {
        d = d.replace(/\//g, '-')
        return d
    }
    return d
}

export const dateTimeWithoutSecond = (d: Date | string, formatDate = 'dd/MM/yyyy') => {
    d = replaceDashesToSlashes(d)
    return format(new Date(d), formatDate + ' HH:mm')
}

export const convertDatetimeUTC = (d: Date | string) => {
    // d = replaceDashesToSlashes(d)
    let date = new Date(d)
    d = formatDateTime(d)
    if (typeof d === 'string') {
        d = replaceSlashesToDashes(d) as string
        date = new Date(d.split(' ').join('T') + 'Z')
    }

    const utcDate = changeTimeZone(d, 'UTC')
    //@ts-ignore
    const tzDate = changeTimeZone(date, system_setting?.time_zone)
    const offset = utcDate.getTime() - tzDate.getTime()

    date.setTime(date.getTime() + offset)
    return date
}

export const convertDatetimeTZWithoutSecond = (
    d: Date | string | any,
    timezone = 'UTC',
    formatDate = 'dd/MM/yyyy'
) => {
    if (!d) {
        return null
    }
    d = replaceDashesToSlashes(d)
    const date = new Date(d)
    const utcDate = changeTimeZone(d, 'UTC')
    //@ts-ignorez
    const tzDate = changeTimeZone(d, timezone)
    const offset = utcDate.getTime() - tzDate.getTime()
    date.setTime(date.getTime() - offset)
    return dateTimeWithoutSecond(date, formatDate)
}

export const formatNormalDateV2 = (d: Date | string) => {
    return format(new Date(d), 'yyyy/MM/dd')
}


export const getAllDaysInWeeks = (startDate: Date | string, endDate: Date | string) => {
    const days = []
    const currentDate = new Date(startDate)
    const currentEnd = new Date(endDate)
    while (currentDate <= currentEnd) {
        days.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
    }
    return days
}

export const formatDayV2 = (date: Date | string) => {
    const formattedDate = format(new Date(date), 'EEE', {
        locale: locale[language]
    })

    const dayOfWeek = formattedDate.slice(4) // Lấy phần chỉ chứa ngày trong chuỗi

    if (dayOfWeek === '2') {
        return 'T2'
    } else if (dayOfWeek === '3') {
        return 'T3'
    } else if (dayOfWeek === '4') {
        return 'T4'
    } else if (dayOfWeek === '5') {
        return 'T5'
    } else if (dayOfWeek === '6') {
        return 'T6'
    } else if (dayOfWeek === '7') {
        return 'T7'
    } else if (dayOfWeek === 'CN') {
        return 'CN'
    }

    return formattedDate // Trả về giá trị gốc nếu không phải ngày trong tuần
}

export const convertTime = (d: Date | string) => {
    if (!d) {
        return null
    }
    d = replaceDashesToSlashes(d)
    return format(new Date(d), 'HH:mm')
}


export {
    minutesToDays,
}