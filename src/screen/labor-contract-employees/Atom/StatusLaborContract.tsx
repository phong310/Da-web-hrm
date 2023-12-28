import { styled, Theme } from '@mui/material'
import i18n from 'lib/lang/translations/i18n'
import { STATUS_INSURANCE } from 'lib/utils/contants'
import React from 'react'
import { Green, grey, Orange, Red, Yellow } from 'styles/colors'

type StatusProps = {
  children?: React.ReactDOM
  value: number | any
  isStatusPaidLeave?: boolean
}
export const StatusLaborContract: React.VFC<StatusProps> = ({ value, isStatusPaidLeave }) => {

  return (
    <CellStatusStyled status={value} isPaidLeave={isStatusPaidLeave}>
      <StatusText status={value} isPaidLeave={isStatusPaidLeave}>
        {getStatus(value, isStatusPaidLeave)}
      </StatusText>
    </CellStatusStyled>
  )
}
export interface StatusStyledInterface {
  children?: React.ReactElement | string
  status: number
  isPaidLeave?: boolean
}
const CellStatusStyled = styled('div', {
  shouldForwardProp: (prop) => prop !== 'status' && prop !== 'isPaidLeave'
})<{
  status: number
  isPaidLeave?: boolean
}>(({ theme, status, isPaidLeave }) => ({
  backgroundColor: '#fff',
  borderRadius: '6px',
  width: isPaidLeave ? '54px' : '165px',
  border: `1px solid ${getStatusBgColor(status, theme, isPaidLeave)}`,
  padding: isPaidLeave ? '3px 8px' : '3px 8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))
const StatusText = styled(({ status, isPaidLeave, ...other }: StatusStyledInterface) => (
  <span {...other} />
))(({ theme, status, isPaidLeave }) => ({
  color: getStatusColor(status, theme, isPaidLeave),
  fontSize: 16,
  textAlign: 'center',
  lineHeight: theme.spacing(2.5),
  [theme.breakpoints.down('md')]: {
    fontSize: 14
  }
}))
export const getStatus = (value: number, isStatusPaidLeave: boolean | undefined) => {
  if (isStatusPaidLeave) {
    if (value === STATUS_INSURANCE.unemployment_insurance) return i18n.t('no')
    if (value === STATUS_INSURANCE.insurance) return i18n.t('yes')
  }
  if (value === STATUS_INSURANCE.unemployment_insurance)
    return i18n.t('labor_contract.status.postpone')
  if (value === STATUS_INSURANCE.insurance) return i18n.t('labor_contract.status.active')
  if (value === STATUS_INSURANCE.terminate) return i18n.t('labor_contract.status.terminate')
  if (value === STATUS_INSURANCE.extend) return i18n.t('labor_contract.status.extend')
  return i18n.t('labor_contract.status.expiretion')
}
  // @ts-ignore
const getStatusColor = (status: number, theme: Theme, isPaidLeave: boolean | undefined) => {
  if (isPaidLeave) {
    if (status === STATUS_INSURANCE.unemployment_insurance) return Orange[400]
  }
  if (status === STATUS_INSURANCE.unemployment_insurance) return grey[600]
  if (status === STATUS_INSURANCE.insurance) return Green[600]
  if (status === STATUS_INSURANCE.terminate) return Red[400]
  return Yellow[600]
}
  // @ts-ignore
const getStatusBgColor = (status: number, theme: Theme, isPaidLeave: boolean | undefined) => {
  if (isPaidLeave) {
    if (status === 0) return Orange[400]
  }
  if (status === 0) return grey[600]
  if (status === 1) return Green[600]
  if (status === 2) return Red[400]
  return Yellow[600]
}
