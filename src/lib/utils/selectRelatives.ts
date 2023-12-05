import i18n from 'lib/lang/translations/i18n'

export const SELECT_RELATIVES = [
  { value: 0, label: i18n.t('relatives.dad') },
  { value: 1, label: i18n.t('relatives.mom') },
  { value: 2, label: i18n.t('relatives.younger_brother') },
  { value: 3, label: i18n.t('relatives.older_brother') },
  { value: 4, label: i18n.t('relatives.younger_sister') },
  { value: 5, label: i18n.t('relatives.older_sister') },
  { value: 6, label: i18n.t('relatives.child') }
]

export const SELECT_SEX_RELATIVES = [
  { value: 0, label: i18n.t('employee.sex.male') },
  { value: 1, label: i18n.t('employee.sex.female') }
]