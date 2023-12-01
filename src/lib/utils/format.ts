import { format, parseISO } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

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
  d = replaceDashesToSlashes(d)
  return format(new Date(d), 'HH:mm')
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