import { Box, Grid, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StatusLaborContract } from '../Atom/StatusLaborContract'
import { LaborContractType } from 'lib/types/labor-contract'
import { STATUS_INSURANCE } from 'lib/utils/contants'

type typeProps = {
  active: LaborContractType | any
}

export const ActivityUser: React.FC<typeProps> = ({ active }) => {
  const { t } = useTranslation()

  return (
    <>
      <Box>
        <Typography sx={{ flex: 1, ...styleTitle }} variant="subtitle1" component="div">
          {t('labor_contract.join')}
        </Typography>
        <Grid sx={{ ...styleChild }}>
          <Grid display={'flex'} justifyContent={'center'} alignItems={'self-start'}>
            <Typography sx={{ flex: 1, ...styleBelow }} variant="body2" component="div">
              {t('labor_contract.is_social_insurance')}
            </Typography>
            <StatusLaborContract
              value={
                active?.is_social_insurance === STATUS_INSURANCE.insurance
                  ? STATUS_INSURANCE.insurance
                  : STATUS_INSURANCE.unemployment_insurance
              }
              isStatusPaidLeave={true}
            />
          </Grid>
          <Grid display={'flex'} justifyContent={'center'} alignItems={'self-start'}>
            <Typography sx={{ flex: 1, ...styleBelow }} variant="body2" component="div">
              {t('labor_contract.is_health_insurance')}
            </Typography>
            <StatusLaborContract
              value={
                active?.is_health_insurance === STATUS_INSURANCE.insurance
                  ? STATUS_INSURANCE.insurance
                  : STATUS_INSURANCE.unemployment_insurance
              }
              isStatusPaidLeave={true}
            />
          </Grid>
          <Grid display={'flex'} justifyContent={'center'} alignItems={'self-start'}>
            <Typography sx={{ flex: 1, ...styleBelow }} variant="body2" component="div">
              {t('labor_contract.is_unemployment_insurance')}
            </Typography>
            <StatusLaborContract
              value={
                active?.is_unemployment_insurance === STATUS_INSURANCE.insurance
                  ? STATUS_INSURANCE.insurance
                  : STATUS_INSURANCE.unemployment_insurance
              }
              isStatusPaidLeave={true}
            />
          </Grid>
          <Grid display={'flex'} justifyContent={'center'} alignItems={'self-start'}>
            <Typography sx={{ flex: 1, ...styleBelow }} variant="body2" component="div">
              {t('labor_contract.is_syndicate')}
            </Typography>
            <StatusLaborContract
              value={
                active?.is_syndicate === STATUS_INSURANCE.insurance
                  ? STATUS_INSURANCE.insurance
                  : STATUS_INSURANCE.unemployment_insurance
              }
              isStatusPaidLeave={true}
            />
          </Grid>
        </Grid>
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
const styleChild = {
  ml: 2
}
