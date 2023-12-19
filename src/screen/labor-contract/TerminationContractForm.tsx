import { Grid } from '@mui/material'
import { LaborContractType } from 'lib/types/labor-contract'
// import { DatePicker, Input } from 'components/Form'
// import { LaborContractType } from 'lib/types'
import React from 'react'
import { Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Heading } from './components'
import { DatePicker } from 'components/Form/Input/DatePicker'
import { Input } from 'components/Form/Input/Input'
// import { grid_input, Heading } from 'screen/labor-contract'

type TerminationContractFormProps = {
  control: Control<LaborContractType, object>
  isCheckDisabled?: boolean
}

export const TerminationContractForm: React.FC<TerminationContractFormProps> = ({
  control,
  isCheckDisabled
}) => {
  const { t } = useTranslation()

  const gird_terminate = {
    xs: 12,
    sm: 6,
    lg: 4
  }

  const styleHeightInput = {
    height: {
      xs: '38px',
      sm: '42px',
      '.MuiOutlinedInput-input': {
        fontSize: { xs: '14px', sm: '16px' }
      }
    }
  }

  return (
    <>
      <Heading>{t('labor_contract.termination_contract')}</Heading>
      <Grid container item spacing={2}>
        <Grid item {...gird_terminate}>
          <DatePicker
            label={t('labor_contract.termination_date')}
            name="termination_date"
            control={control}
            required
            fullWidth
            sx={{ ...styleHeightInput }}
            disabled={isCheckDisabled}
          />
        </Grid>

        <Grid item {...gird_terminate}>
          <Input
            label={t('labor_contract.reason_contract_termination')}
            name="reason_contract_termination"
            placeholder={t('labor_contract.reason_contract_termination')}
            control={control}
            fullWidth
            sx={{ ...styleHeightInput }}
            required
            multiline
            disabled={isCheckDisabled}
          />
        </Grid>
      </Grid>
    </>
  )
}
