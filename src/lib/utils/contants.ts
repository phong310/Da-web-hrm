import i18n from "lib/lang/translations/i18n"

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
