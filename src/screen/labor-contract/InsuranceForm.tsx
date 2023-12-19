import { Grid } from '@mui/material'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Control, useWatch } from 'react-hook-form'
import FormGroup from '@mui/material/FormGroup'
import { SwitchLabel } from 'components/Form/Input/SwitchLabel'
import { LaborContractType } from 'lib/types/labor-contract'
import { Heading, grid_input } from './components'

type SalaryFormProps = {
  control: Control<LaborContractType, object>
  isCheckInsurance?: boolean
  setIsCheckInsurance?: (isCheckInsurance: boolean) => void
  isCheckDisabled?: boolean
}

export const InsuranceForm: React.FC<SalaryFormProps> = ({
  control,
  setIsCheckInsurance,
  isCheckInsurance,
  isCheckDisabled
}) => {
  const { t } = useTranslation()

  const isSocialInsurance = useWatch({
    control,
    name: 'is_social_insurance'
  })

  const isHealthInsurance = useWatch({
    control,
    name: 'is_health_insurance'
  })

  const isUnemploymentInsurance = useWatch({
    control,
    name: 'is_unemployment_insurance'
  })

  const isSyndicate = useWatch({
    control,
    name: 'is_syndicate'
  })

  const handleChange = (e: any) => {
    setIsCheckInsurance?.(e.target.checked)
  }

  useEffect(() => {
    if (isSocialInsurance && setIsCheckInsurance) {
      setIsCheckInsurance(true)
    } else if (!isSocialInsurance && setIsCheckInsurance) {
      setIsCheckInsurance(false)
    }
  }, [isSocialInsurance, setIsCheckInsurance])

  return (
    <>
      <Heading>{t('labor_contract.join')}</Heading>
      <Grid container item spacing={2}>
        <Grid item {...grid_input}>
          <FormGroup>
            <SwitchLabel
              name="is_social_insurance"
              control={control}
              // defaultChecked={isCheckInsurance}
              //@ts-ignore
              checked={!!isCheckInsurance}
              label={t('labor_contract.is_social_insurance')}
              onChange={handleChange}
              disabled={isCheckDisabled}
            />
            <SwitchLabel
              name="is_health_insurance"
              control={control}
              defaultChecked={!!isHealthInsurance}
              //@ts-ignore
              checked={!!isHealthInsurance}
              label={t('labor_contract.is_health_insurance')}
              disabled={isCheckDisabled}
            />

            <SwitchLabel
              name="is_unemployment_insurance"
              control={control}
              defaultChecked={!!isUnemploymentInsurance}
              //@ts-ignore
              checked={!!isUnemploymentInsurance}
              label={t('labor_contract.is_unemployment_insurance')}
              disabled={isCheckDisabled}
            />

            <SwitchLabel
              name="is_syndicate"
              control={control}
              defaultChecked={!!isSyndicate}
              //@ts-ignore
              checked={!!isSyndicate}
              label={t('labor_contract.is_syndicate')}
              disabled={isCheckDisabled}
            />
          </FormGroup>
        </Grid>
      </Grid>
    </>
  )
}
