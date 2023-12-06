import i18n from 'lib/lang/translations/i18n'
import { Address } from 'lib/types/address'
import { SystemSetting } from 'lib/types/system_setting'
import { EmployeeType } from 'lib/types/user'
import { ADDRESS_TYPE, MARITAL_STATUS, SEX } from 'lib/utils/contants'
import { formatDate } from 'lib/utils/format'

export const parseUserInfoData = (
    t: any,
    data: EmployeeType | null,
    systemSetting: SystemSetting | null
) => [
        {
            key: t('information.first_name'),
            value: data?.personal_information.first_name,
            id: 1,
            name: 'firstName'
        },
        {
            key: t('information.last_name'),
            value: data?.personal_information.last_name,
            id: 2,
            name: 'lastName'
        },
        {
            key: t('information.sex'),
            value: parseSex(data?.personal_information.sex),
            id: 3,
            name: 'sex'
        },
        {
            key: t('information.birthday'),
            value: formatDate(data?.personal_information.birthday as string, systemSetting?.format_date),
            id: 4,
            name: 'birthday'
        },
        {
            key: t('information.nickname'),
            value: data?.personal_information.nickname,
            id: 5,
            name: 'nickName'
        },
        {
            key: t('account.email'),
            value: data?.personal_information.email,
            id: 6,
            name: 'email'
        },
        {
            key: t('companies.phone_number'),
            value: phoneNumber(data?.personal_information.phone),
            id: 7,
            name: 'phone'
        }
    ]

export const parseSex = (sex?: number | null) => {
    if (sex == SEX['FEMALE']) return i18n.t('sex.female')
    if (sex == SEX['MALE']) return i18n.t('sex.male')

    return 'Different'
}
export const phoneNumber = (phone?: string) => {
    if (phone && phone.slice(0, 1) !== '0') return '0' + phone
    return phone
}

const parseMaritalStatus = (marital_status?: string | null) => {
    switch (Number(marital_status)) {
        case MARITAL_STATUS['SINGLE']:
            return i18n.t('marital_status.single')
        case MARITAL_STATUS['MARRIED']:
            return i18n.t('marital_status.married')
        default:
            return 'Different'
    }
}

const parseAddress = (addresses: Address[] | undefined, type: number) => {
    switch (type) {
        case ADDRESS_TYPE['DOMICILE']:
            return addresses?.find((address) => address.type === ADDRESS_TYPE['DOMICILE'])?.address
        case ADDRESS_TYPE['RESIDENT']:
            return addresses?.find((address) => address.type === ADDRESS_TYPE['RESIDENT'])?.address
        default:
            return 'Different'
    }
}

export const dataBankUser = (
    t: any,
    data: EmployeeType | null,
    systemSetting: SystemSetting | null
) => [
        {
            key: t('bank_account.account_number'),
            value: data?.account_number,
            id: 1,
            name: 'accountNumber'
        },
        {
            key: t('bank_account.account_name'),
            value: data?.account_name,
            id: 2,
            name: 'accountName'
        },

        {
            key: t('bank_account.bank_branch'),
            value: data?.bank_branch,
            id: 4,
            name: 'bankBranch'
        },
        {
            key: t('bank_account.bank_name'),
            value: data?.bank_name,
            id: 5,
            name: 'bankName'
        }
    ]

export const dataIdentificationUser = (
    t: any,
    data: EmployeeType | null,
    systemSetting: SystemSetting | null
) => [
        {
            key: t('identity_paper.id_no'),
            value: data?.ID_no,
            id: 1,
            name: 'id'
        },
        {
            key: t('identity_paper.issued_by'),
            value: data?.issued_by,
            id: 2,
            name: 'issuedBy'
        },
        {
            key: t('identity_paper.issued_date'),
            value: data?.issued_date,
            id: 3,
            name: 'issuedDate'
        },
        {
            key: t('identity_paper.id_expire'),
            value: data?.ID_expire,
            id: 4,
            name: 'idExpire'
        }
    ]

export const dataAddressUser = (
    t: any,
    data: EmployeeType | null,
    systemSetting: SystemSetting | null
) => [
        {
            key: t('address.province'),
            value: data?.province,
            id: 1,
            name: 'province'
        },
        {
            key: t('address.district'),
            value: data?.district,
            id: 2,
            name: 'district'
        },
        {
            key: t('address.ward'),
            value: data?.ward,
            id: 3,
            name: 'ward'
        },
        {
            key: t('address.name'),
            value: data?.address,
            id: 4,
            name: 'address'
        }
    ]

export const infoEmployee = (
    t: any,
    data: EmployeeType | null,
    systemSetting: SystemSetting | null
) => [
        {
            key: t('information.employee_code'),
            value: data?.employee_code,
            id: 8,
            name: 'employeeCode'
        },
        {
            key: t('information.official_employee_date'),
            value: formatDate(data?.official_employee_date as string, systemSetting?.format_date),
            id: 9,
            name: 'offEmployeeDate'
        },
        {
            key: t('information.date_start_work'),
            value: formatDate(data?.date_start_work as string, systemSetting?.format_date),
            id: 10,
            name: 'dateStartWork'
        },
        {
            key: t('information.jobs'),
            value: data?.personal_information.job?.name,
            id: 11,
            name: 'jobs'
        },
        {
            key: t('information.position'),
            value: data?.position?.name,
            id: 12,
            name: 'positionName'
        },
        {
            key: t('information.country'),
            value: data?.personal_information.country?.name,
            id: 13,
            name: 'country'
        }
    ]
