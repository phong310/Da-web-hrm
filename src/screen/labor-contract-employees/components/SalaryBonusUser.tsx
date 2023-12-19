import { Box, Typography, Grid } from '@mui/material'
import { LaborContractType } from 'lib/types/labor-contract'
import { formatMoney } from 'lib/utils/formatMoney'
// import { LaborContractType } from 'lib/types'
import React from 'react'
// import { formatMoney } from '../../../lib/utils/v2/formatMoney'
import { useTranslation } from 'react-i18next'

type PropType = {
  dataDetail?: LaborContractType
}

export const SalaryBonusUser: React.FC<PropType> = ({ dataDetail }) => {
  const { t } = useTranslation()
  return (
    <>
      <Grid>
        <Typography sx={{ flex: 1, ...styleTitle }} variant="subtitle1" component="div">
          {t('labor_contract.salary_bonus')}
        </Typography>
      </Grid>
      <Box sx={{ ...styleChild }}>
        {dataDetail?.hourly_salary ? (
          <Grid display={'flex'} justifyContent={'space-between'} alignItems={'self-start'}>
            <Typography sx={{ flex: 1, ...styleBelow }} variant="body2" component="div">
              {t('labor_contract.salary_hours')}
            </Typography>
            <Typography sx={{ ...styleKindOfLeave }} variant="body1" component="div">
              {formatMoney(dataDetail?.hourly_salary)} VNĐ
            </Typography>
          </Grid>
        ) : (
          ''
        )}

        {dataDetail?.basic_salary ? (
          <Grid display={'flex'} justifyContent={'space-between'} alignItems={'self-start'}>
            <Typography sx={{ flex: 1, ...styleBelow }} variant="body2" component="div">
              {t('labor_contract.basic_salary')}
            </Typography>
            <Typography sx={{ ...styleKindOfLeave }} variant="body1" component="div">
              {formatMoney(dataDetail?.basic_salary)} VNĐ
            </Typography>
          </Grid>
        ) : (
          ''
        )}

        {dataDetail?.insurance_salary || dataDetail?.is_system_insurance_salary ? (
          <Grid display={'flex'} justifyContent={'space-between'} alignItems={'self-start'}>
            <Typography sx={{ flex: 1, ...styleBelow }} variant="body2" component="div">
              {t('labor_contract.insurance_salary')}
            </Typography>
            <Typography sx={{ ...styleKindOfLeave }} variant="body1" component="div">
              {formatMoney(
                dataDetail?.insurance_salary
                  ? dataDetail?.insurance_salary
                  : dataDetail?.is_system_insurance_salary
              )}{' '}
              VNĐ
            </Typography>
          </Grid>
        ) : (
          ''
        )}
      </Box>
    </>
  )
}

const styleTitle = {
  color: '#146BD2',
  fontSize: { xs: '13px', sm: '18px' },
  fontStyle: 'normal',
  fontWeight: '600',
  lineHeight: '26px',
  mb: 2,
  pt: 1
}

const styleBelow = {
  fontSize: { xs: '14px', sm: '16px' },
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '22px',
  mb: 3,
  color: '#111'
}

const styleKindOfLeave = {
  fontSize: { xs: '13px', sm: '16px' },
  fontStyle: 'normal',
  fontWeight: '600',
  lineHeight: '22px',
  textAlign: 'right',
  width: { xs: '100px', sm: '242px' },
  mb: 3
}
const styleChild = {
  ml: 2
}
