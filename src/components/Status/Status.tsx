// @ts-nocheck
import { styled, Theme } from '@mui/material'
import i18n from 'lib/lang/translations/i18n'
import React from 'react'
import { useParams } from 'react-router-dom'
import { blue, Green, Orange, Red, Yellow } from 'styles/colors'
type StatusProps = {
  children?: React.ReactDOM
  value: number | any
  isStatusApprovedSalary?: boolean
  isStatusPaidLeave?: boolean
}
export const Status: React.VFC<StatusProps> = ({
  value,
  isStatusPaidLeave,
  isStatusApprovedSalary
}) => {
  const isEdit = useParams()
  return (
    <CellStatusStyled status={value} isPaidLeave={isStatusPaidLeave}>
      <StatusText status={value} isPaidLeave={isStatusPaidLeave}>
        {getStatus(value, isStatusPaidLeave, isStatusApprovedSalary)}
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
  width: isPaidLeave ? '54px' : '150px',
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
  textAlign: 'center',
  lineHeight: theme.spacing(2.5),
  fontSize: '16px',
  [theme.breakpoints.down('md')]: {
    fontSize: '14px'
  }
}))
export const getStatus = (
  value: number,
  isStatusPaidLeave: boolean | undefined,
  isStatusApprovedSalary: boolean | undefined
) => {
  if (isStatusPaidLeave) {
    if (value === 0) return i18n.t('no')
    if (value === 1) return i18n.t('yes')
    if (value === 2) return i18n.t('no')
  }
  if (isStatusApprovedSalary) {
    if (value === 1) return i18n.t('salary.approved_salary')
    if (value === 2) return i18n.t('salary.reject')
  }
  if (value === 0) return i18n.t('await_confirm')
  if (value === 1) return i18n.t('approved')
  if (value === 2) return i18n.t('rejected')
  return i18n.t('cancel')
}
const getStatusColor = (status: number, theme: Theme, isPaidLeave: boolean | undefined) => {
  if (isPaidLeave) {
    if (status === 0) return Orange[400]
  }
  if (status === 0) return blue[600]
  if (status === 1) return Green[600]
  if (status === 2) return Red[400]
  return Yellow[600]
}
const getStatusBgColor = (status: number, theme: Theme, isPaidLeave: boolean | undefined) => {
  if (isPaidLeave) {
    if (status === 0) return Orange[400]
  }
  if (status === 0) return blue[600]
  if (status === 1) return Green[600]
  if (status === 2) return Red[400]
  return Yellow[600]
}
