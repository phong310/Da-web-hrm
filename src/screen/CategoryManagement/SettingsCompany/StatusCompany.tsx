// @ts-nocheck
import { styled, Theme } from '@mui/material'
import i18n from 'lib/lang/translations/i18n'
import React from 'react'
import { blue, Green, Red, Yellow } from 'styles/colors'
type StatusProps = {
  children?: React.ReactDOM
  value: number | any
}
export const StatusCompany: React.VFC<StatusProps> = ({ value }) => {
  return (
    <CellStatusStyled status={value}>
      <StatusText status={value}>{getStatus(value)}</StatusText>
    </CellStatusStyled>
  )
}
export interface StatusStyledInterface {
  children?: React.ReactElement | string
  status: number
  isPaidLeave?: boolean
}
const CellStatusStyled = styled('div', {
  shouldForwardProp: (prop) => prop !== 'status'
})<{
  status: number
}>(({ theme, status }) => ({
  backgroundColor: '#fff',
  borderRadius: '6px',
  width: '150px',
  border: `1px solid ${getStatusBgColor(status, theme)}`,
  padding: '3px 8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))
const StatusText = styled(({ status, ...other }: StatusStyledInterface) => <span {...other} />)(
  ({ theme, status }) => ({
    color: getStatusColor(status, theme),
    textAlign: 'center',
    lineHeight: theme.spacing(2.5),
    fontSize: '16px',
    [theme.breakpoints.down('md')]: {
      fontSize: '14px'
    }
  })
)
export const getStatus = (value: number) => {
  if (value === 0) return i18n.t('companies.status_option.new')
  if (value === 1) return i18n.t('companies.status_option.active')
  if (value === 2) return i18n.t('companies.status_option.rejected')
  return i18n.t('companies.status_option.rejected.inactive')
}
const getStatusColor = (status: number, theme: Theme) => {
  if (status === 0) return blue[600]
  if (status === 1) return Green[600]
  if (status === 2) return Red[400]
  return Yellow[600]
}
const getStatusBgColor = (status: number, theme: Theme) => {
  if (status === 0) return blue[600]
  if (status === 1) return Green[600]
  if (status === 2) return Red[400]
  return Yellow[600]
}
