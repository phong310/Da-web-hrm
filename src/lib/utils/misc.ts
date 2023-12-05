import { formatDistance, Locale } from 'date-fns'
import { enUS, ja, vi } from 'date-fns/locale'
import { EmployeeType } from 'lib/types/user'
import { ModelHasApproversType } from 'lib/types/applicationForm'
import { FORM_STATUS } from './contants'
const language = localStorage.getItem('language') || 'vi'

type localeType = {
    [key: string]: Locale
}

const locale: localeType = {
    vi: vi,
    en: enUS,
    ja: ja
}

export const sleep = (delay: number) =>
    new Promise((resolve) => {
        setTimeout(() => resolve(undefined), delay)
    })

export const formatFileSize = (sizeInBytes: number) => {
    const thresh = 1000
    if (Math.abs(sizeInBytes) < thresh) {
        return sizeInBytes + ' B'
    }
    const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    let u = -1
    do {
        sizeInBytes /= thresh
        ++u
    } while (Math.abs(sizeInBytes) >= thresh && u < units.length - 1)
    return sizeInBytes.toFixed(1) + ' ' + units[u]
}

export const addZero = (num: number) => ('0' + num).slice(-2)

export const fullName = (info: EmployeeType | null) => {
    const fName = info?.personal_information?.first_name
    const lName = info?.personal_information?.last_name
    if (fName && lName) return fName + ' ' + lName
    return ''
}

export const formatTimeDiff = (dateTime: Date | string) => {
    return formatDistance(new Date(dateTime), new Date(), {
        addSuffix: true,
        locale: locale[language]
    })
}

export const snakeToCamel = (str: string) =>
    str
        .toLowerCase()
        .replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''))

export const checkIsManager = (path: string) => {
    const array = path.split('/')
    const isManager = array.includes('manager')
    return isManager
}
export const upperCamelToSnakeCase = (str: string) =>
    str.replace(/[A-Z]/g, (letter, index) => {
        return index == 0 ? letter.toLowerCase() : '_' + letter.toLowerCase()
    })

export const checkFormIsDisableEdit = (approvers: ModelHasApproversType[]) =>
    approvers.some(
        (approver: ModelHasApproversType) => approver.status !== FORM_STATUS['AWAIT_CONFIRM']
    )
