import i18n from "lib/lang/translations/i18n"
import TimezoneCountries from 'countries-and-timezones'

export const TYPE_OF_BUSSINESS_OPTIONS = [
    { value: 1, label: "Doanh nghiệp tư nhân" },
    { value: 2, label: "Doanh nghiệp nhà nước" },
    { value: 3, label: "Công ty hợp danh" },
    { value: 4, label: "Công ty cổ phần" },
    { value: 5, label: "Công ty trách nhiệm hữu hạn." },
    { value: 6, label: "Công ty trách nhiệm hữu hạn một thành viên." }
]

export const DAY_IN_WEEK = {
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    SUNDAY: 7
}


export const AVATAR_SIZE = {
    MAX: {
        xs: 150,
        md: 150
    },
    MIDDLE: {
        xs: 60,
        md: 100
    },
    NORMAL: {
        xs: 45,
        md: 60
    },
    ORDINARY: {
        xs: 40,
        md: 40
    },
    MIN: {
        xs: 32,
        md: 32
    }
}

export const SIZE_BUTTON = {
    MIN: {
        xs: 12,
        sm: 14,
        md: 16
    },
    NORMAL: {
        xs: 14,
        sm: 16
    },
    MAX: {
        xs: 16
    }
}

export const STATUS_EMPLOYEE = {
    QUIT_WORK: 0,
    WORKING: 1
}

export const SETTING_TYPES_OVERTIME = {
    AFTER_OFFICE_HOUR: 1,
    WEEKEND: 2,
    HOLIDAY: 3
}

export const HOULR_SALARY_STATUS = {
    TYPE_ZERO: 0,
    TYPE_ONE: 1
}
export const STATUS_ALLOWANCE = {
    INACTIVE: 0,
    ACTIVE: 1
}

export const STATUS_ALLOWANCE_OPTIONS = [
    { label: i18n.t('allowances.inactive'), value: STATUS_ALLOWANCE['INACTIVE'] },
    { label: i18n.t('allowances.active'), value: STATUS_ALLOWANCE['ACTIVE'] }
]

export const STATUS_LABOR_CONTRACT = {
    POSTPONE: 0,
    ACTIVE: 1,
    TERMINATE: 2,
    EXTEND: 3,
    EXPIRTION: 4,
    CANCEL: 5
}

export const STATUS_INSURANCE = {
    unemployment_insurance: 0,
    insurance: 1,
    terminate: 2,
    extend: 3
}


export const STATUS_LABOR_CONTRACT_OPTIONS = [
    { label: i18n.t('labor_contract.status.postpone'), value: STATUS_LABOR_CONTRACT['POSTPONE'] },
    { label: i18n.t('labor_contract.status.active'), value: STATUS_LABOR_CONTRACT['ACTIVE'] },
    { label: i18n.t('labor_contract.status.terminate'), value: STATUS_LABOR_CONTRACT['TERMINATE'] },
    // { label: i18n.t('labor_contract.status.extend'), value: STATUS_LABOR_CONTRACT['EXTEND'] },
    // { label: i18n.t('labor_contract.status.expiretion'), value: STATUS_LABOR_CONTRACT['EXPIRTION'] }
    // { label: i18n.t('labor_contract.status.cancel'), value: STATUS_LABOR_CONTRACT['CANCEL'] }
]

export const STATUS_LABOR_CONTRACT_HISTORY = [
    { label: i18n.t('labor_contract.status.terminate'), value: STATUS_LABOR_CONTRACT['TERMINATE'] },
    { label: i18n.t('labor_contract.status.expiretion'), value: STATUS_LABOR_CONTRACT['EXPIRTION'] }
]

export const STATUS_EMPLOYEE_OPTIONS = [
    { value: STATUS_EMPLOYEE['WORKING'], label: i18n.t('working') },
    { value: STATUS_EMPLOYEE['QUIT_WORK'], label: i18n.t('quit_work') }
]

export const ADDRESS_TYPE = {
    RESIDENT: 0,
    DOMICILE: 1
}

export const MARITAL_STATUS = {
    MARRIED: 0,
    SINGLE: 1
}
export const SEX = {
    FEMALE: 0,
    MALE: 1
}

export const SEX_OPTIONS = [
    {
        label: i18n.t('sex.male'),
        value: SEX['MALE']
    },
    {
        label: i18n.t('sex.female'),
        value: SEX['FEMALE']
    }
]


export const ADDRESS_TYPE_OPTIONS = [
    { label: i18n.t('address.resident'), value: ADDRESS_TYPE['RESIDENT'] },
    { label: i18n.t('address.domicile'), value: ADDRESS_TYPE['DOMICILE'] }
]

export const IDENTITY_TYPE = {
    CMT: 0,
    TCC: 1
}

export const IDENTITY_TYPE_OPTIONS = [
    { label: 'CCCD', value: IDENTITY_TYPE['CMT'] }
    // { label: 'TCC', value: IDENTITY_TYPE['TCC'] }
]

export const MARITAL_STATUS_OPTIONS = [
    { label: i18n.t('marital_status.single'), value: MARITAL_STATUS['SINGLE'] },
    {
        label: i18n.t('marital_status.married'),
        value: MARITAL_STATUS['MARRIED']
    }
]

export const TYPE_OPTIONS_ADMIN = {
    BRANCH: 'Branch',
    DEPARTMENT: 'Department',
    POSITION: 'Position',
    TITLES: 'Titles'
}

export const DEFAULT_EMPLOYEE_PASSWORD = 'admin@123'


export const NUMBER_OF_DAY_TYPES = {
    1: i18n.t('number_of_days.types.annual_leave'),
    2: i18n.t('number_of_days.types.leave_form')
}

export type OtherAllowanceData = {
    id: number
    name: string
    company_id: number
}

export const RELATIVES_TYPES = (type?: number | null) => {
    if (type == 0) return i18n.t('relatives.dad')
    if (type == 1) return i18n.t('relatives.mom')
    if (type == 2) return i18n.t('relatives.younger_brother')
    if (type == 3) return i18n.t('relatives.older_brother')
    if (type == 4) return i18n.t('relatives.younger_sister')
    if (type == 5) return i18n.t('relatives.older_sister')
    if (type == 6) return i18n.t('relatives.child')

    return 'Different'
}

export const CHECK_NUMBER_PHONE = (phone?: string) => {
    if (phone && phone.slice(0, 1) !== '0') return '0' + phone
    return phone
}

export const COMPENSATORY_WD_TYPE = {
    ANNUAL: 1,
    SINGLE_USE: 2
}

export const HOLIDAY_TYPE = {
    ANNUAL: 1,
    SINGLE_USE: 2
}

export const FORM_STATUS = {
    AWAIT_CONFIRM: 0,
    APPROVED: 1,
    REJECTED: 2,
    CANCEL: 3
}

export const PERMISSIONS_MANAGE_APPLICATION = [
    'overtime.manage',
    'leave-form.manage',
    'request-change-timesheets.manage',
    'compensatory_leave.manage'
]

export const MONTH_NAME: any = {
    1: i18n.t('month.january'),
    2: i18n.t('month.february'),
    3: i18n.t('month.march'),
    4: i18n.t('month.april'),
    5: i18n.t('month.may'),
    6: i18n.t('month.june'),
    7: i18n.t('month.july'),
    8: i18n.t('month.august'),
    9: i18n.t('month.september'),
    10: i18n.t('month.october'),
    11: i18n.t('month.november'),
    12: i18n.t('month.december')
}

export const KIND_OF_LEAVE_TYPES = {
    COMPENSATORY_LEAVE: 0,
    NORMAL_LEAVE: 1
}

export const KIND_OF_LEAVE_OPTIONS = [
    {
        value: KIND_OF_LEAVE_TYPES['COMPENSATORY_LEAVE'],
        label: i18n.t('kind-of-leave.types.compensatory_leave')
    },
    { value: KIND_OF_LEAVE_TYPES['NORMAL_LEAVE'], label: i18n.t('kind-of-leave.types.normal_leave') }
]

export const tabIndexTileLeaveForm = {
    LEAVE_FORM: 0,
    OT_FORM: 1,
    CHANGE_TIME_FORM: 2,
    COMPENSATORY_FORM: 3
}

export const STATUS_FORM_OPTIONS = [
    { label: i18n.t('approved'), value: 1 },
    { label: i18n.t('await_confirm'), value: 0 },
    { label: i18n.t('rejected'), value: 2 },
    { label: i18n.t('cancel'), value: 3 }
]

export const IS_PAID_LEAVE = {
    NO: 0,
    YES: 1
}

export const IS_PAID_LEAVE_OPTIONS = [
    { label: i18n.t('no'), value: IS_PAID_LEAVE['NO'] },
    { label: i18n.t('yes'), value: IS_PAID_LEAVE['YES'] }
]

export const STATUSCHECK = {
    LENGHT: 1,
    APPROVALREQUIREMENTS: 0,
    APPROVED: 1,
    REFUSE: 2,
    CANCEL: 3
}
export const TYPE_SETTING_TYPES_OT = {
    AFTER_OFFICE_HOURS: 1,
    WEEKEND: 2,
    HOLIDAY: 3
}
export const TYPE_TIME = {
    MONTH: 'month',
    WEEK: 'week'
}
export const parseFormatDate = [
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
export const parseLocale = [
    {
        label: 'english',
        value: 'en'
    },
    {
        label: 'vietnamese',
        value: 'vi'
    },

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

export const parseTimeZone = getAllTimezones()
export const ACTION_FORM = [
    'created',
    'updated',
    'accepted',
    'rejected',
    'request_approval',
    'review',
    'public',
    'extend'
]