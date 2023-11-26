import TimezoneCountries from 'countries-and-timezones'
export type SystemSetting = {
    format_date: string
    time_zone: string
    locale: string
    company_id: number
}

export const PARSE_FORMAT_DATE = [
    {
        label: 'yyyy-MM-dd',
        value: 'yyyy-MM-dd'
    },
    {
        label: 'dd-MM-yyyy',
        value: 'dd-MM-yyyy'
    },
    {
        label: 'MM-dd-yyyy',
        value: 'MM-dd-yyyy'
    }
]

export const PARSE_LOCALE = [
    {
        label: 'english',
        value: 'en'
    },
    {
        label: 'vietnamese',
        value: 'vi'
    },
    {
        label: 'japanese',
        value: 'ja'
    }
]

function getAllTimezones() {
    const allTimezones = Object.values(TimezoneCountries.getAllTimezones({ deprecated: true })).map(
        (list) => ({
            value: list.name,
            label: `${list.name}`
        })
    )
    return allTimezones
}

export const PARSE_COEFFICIENT_OT = [
    {
        label: '100%',
        value: 1
    },
    {
        label: '150%',
        value: 1.5
    },
    {
        label: '200%',
        value: 2
    },
    {
        label: '250%',
        value: 2.5
    },
    {
        label: '300%',
        value: 3
    }
]

export const PARSE_TIME_ZONE = getAllTimezones()
