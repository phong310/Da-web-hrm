// @ts-nocheck
import { styled, Theme } from '@mui/material'
import i18n from 'lib/lang/translations/i18n'
import { STATUS_EMPLOYEE } from 'lib/utils/contants'
import React from 'react'
import { useParams } from 'react-router-dom'
import { Green, Red } from 'styles/colors'

type StatusProps = {
  children?: React.ReactDOM
  value: number | any
  isStatusPaidLeave?: boolean
}
export const StatusEmployee: React.VFC<StatusProps> = ({ value, isStatusPaidLeave }) => {
  const isEdit = useParams()
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
  if (value === STATUS_EMPLOYEE.WORKING) return i18n.t('working')
  return i18n.t('quit_work')
}
const getStatusColor = (status: number, theme: Theme, isPaidLeave: boolean | undefined) => {
  if (status === STATUS_EMPLOYEE.WORKING) return Green[600]
  return Red[400]
}
const getStatusBgColor = (status: number, theme: Theme, isPaidLeave: boolean | undefined) => {
  if (status === 1) return Green[600]
  return Red[400]
}
