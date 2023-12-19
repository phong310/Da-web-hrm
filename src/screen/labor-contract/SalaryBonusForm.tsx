import { Grid, useMediaQuery } from '@mui/material'
import { SwitchLabel } from 'components/Form/Input/SwitchLabel'
import { LaborContractType } from 'lib/types/labor-contract'
import { HOULR_SALARY_STATUS, STATUS_LABOR_CONTRACT } from 'lib/utils/contants'
// import { MoneyInput } from 'components/Form/Input/v2/MoneyInput'
// import { LaborContractType } from 'lib/types'
// import { HOULR_SALARY_STATUS, STATUS_LABOR_CONTRACT } from 'lib/utils'
import React, { useEffect, useState } from 'react'
import { Control, UseFormSetValue, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Heading } from './components'
import { MoneyInput } from 'components/Form/Input/MoneyInput'
// import { Heading, grid_input } from 'screen/labor-contract'

type SalaryFormProps = {
  control: Control<LaborContractType, object>
  setValue: UseFormSetValue<LaborContractType>
  setIsValid?: (isValid: boolean) => void
  setIsSystemInsuranceSalary?: (item: boolean) => void
  isSuranceSalaryAdmin?: number | any
  isCheckInsurance?: boolean
  setIsCheckInsurance?: (isCheckInsurance: boolean) => void
  isCheckDisabled?: boolean
  checkInsuranceForm?: boolean
}

export const SalaryBonusForm: React.FC<SalaryFormProps> = ({
  control,
  setValue,
  setIsValid,
  isSuranceSalaryAdmin,
  setIsSystemInsuranceSalary,
  isCheckInsurance,
  setIsCheckInsurance,
  isCheckDisabled,
  checkInsuranceForm
}) => {
  const { t } = useTranslation()
  const [isHourlySalaryChecked, setIsHourlySalaryChecked] = useState<boolean>(false)
  const [isInsuranceSalary, setIsInsuranceSalary] = useState<boolean>(false)
  const isXsScreen = useMediaQuery('(max-width:900px)')

  const isHourSalary = useWatch({
    control,
    name: 'hourly_salary'
  })

  const isSystemInsuranceSalary = useWatch({
    control,
    name: 'is_system_insurance_salary'
  })

  const insuranceSocial = useWatch({
    control,
    name: 'is_social_insurance'
  })

  const insuranceSalary = useWatch({
    control,
    name: 'insurance_salary'
  })

  const statusContract = useWatch({
    control,
    name: 'status'
  })

  const handleSystemInsuranceSalaryChange = (e: any) => {
    const SystemInsuranceSalary = e.target.checked
    setIsInsuranceSalary(SystemInsuranceSalary)

    if (SystemInsuranceSalary) {
      setValue('insurance_salary', isSuranceSalaryAdmin)
    }
    // } else {
    //   setValue('insurance_salary', HOULR_SALARY_STATUS.TYPE_ZERO)
    // }

    setIsSystemInsuranceSalary?.(SystemInsuranceSalary)
  }

  const handleChecked = (e: any) => {
    setIsHourlySalaryChecked(e.target.checked)
  }

  useEffect(() => {
    if (isHourSalary !== HOULR_SALARY_STATUS.TYPE_ZERO) {
      setIsHourlySalaryChecked(true)
    } else {
      setIsHourlySalaryChecked(false)
    }
  }, [isHourSalary])

  useEffect(() => {
    if (isSystemInsuranceSalary !== HOULR_SALARY_STATUS.TYPE_ZERO) {
      setIsInsuranceSalary(true)
      setValue('insurance_salary', isSystemInsuranceSalary)
      setIsSystemInsuranceSalary?.(true)
    }

    if (isHourlySalaryChecked && setIsValid) {
      setIsValid(true)
    } else if (!isHourlySalaryChecked && setIsValid) {
      setIsValid(false)
    }

    if (insuranceSocial && setIsCheckInsurance) {
      setIsCheckInsurance(true)
    } else if (!insuranceSocial && setIsCheckInsurance) {
      setIsCheckInsurance(false)
    }

    if (checkInsuranceForm && setIsCheckInsurance) {
      setIsCheckInsurance(true)
    }
  }, [
    isSystemInsuranceSalary,
    isHourlySalaryChecked,
    setIsValid,
    setIsCheckInsurance,
    checkInsuranceForm,
    insuranceSocial
  ])

  useEffect(() => {
    if (checkInsuranceForm) {
      if (
        insuranceSalary === HOULR_SALARY_STATUS.TYPE_ZERO &&
        statusContract !== STATUS_LABOR_CONTRACT.EXPIRTION
      ) {
        setValue('insurance_salary', '')
      }
    }
  }, [insuranceSalary, checkInsuranceForm, statusContract])

  const grid = { xs: 6, sm: 6, md: 4, lg: 4 }

  return (
    <>
      <Heading>{t('labor_contract.salary_bonus')}</Heading>
      <Grid container rowSpacing={{ xs: 2, sm: 3 }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid container item md={12} spacing={2}>
          <Grid container item spacing={2} sx={{ mb: 4 }}>
            <Grid item {...grid}>
              <SwitchLabel
                label={t('labor_contract.hour_salary')}
                name="hourly_salary"
                control={control}
                //@ts-ignore
                checked={isHourlySalaryChecked}
                onChange={handleChecked}
                disabled={isCheckDisabled}
              />
            </Grid>
            {isHourlySalaryChecked && (
              <Grid item {...grid}>
                <MoneyInput
                  label={t('labor_contract.enter_hour_salary')}
                  name="hourly_salary"
                  placeholder={
                    isXsScreen
                      ? t('labor_contract.short_enter_hour_salary')
                      : t('labor_contract.enter_hour_salary')
                  }
                  control={control}
                  setValue={setValue}
                  type="number"
                  startAdornment={<span style={{ marginRight: '8px' }}>VNĐ</span>}
                  fullWidth
                  required={isHourlySalaryChecked}
                  disabled={isCheckDisabled}
                />
              </Grid>
            )}
          </Grid>

          <Grid container item spacing={2}>
            <Grid item {...grid}>
              <MoneyInput
                id="test"
                label={t('labor_contract.basic_salary')}
                name="basic_salary"
                placeholder={
                  isXsScreen
                    ? t('labor_contract.short_enter_salary')
                    : t('labor_contract.basic_salary')
                }
                control={control}
                setValue={setValue}
                type="number"
                startAdornment={<span style={{ marginRight: '8px' }}>VNĐ</span>}
                fullWidth
                required={!isHourlySalaryChecked}
                disabled={isHourlySalaryChecked || isCheckDisabled}
              />
            </Grid>

            <Grid item {...grid}>
              <MoneyInput
                label={t('labor_contract.insurance_salary')}
                name="insurance_salary"
                placeholder={
                  isXsScreen
                    ? t('labor_contract.short_enter_salary')
                    : t('labor_contract.insurance_salary')
                }
                control={control}
                setValue={setValue}
                type="number"
                startAdornment={<span style={{ marginRight: '8px' }}>VNĐ</span>}
                fullWidth
                required
                disabled={
                  isInsuranceSalary || !isCheckInsurance || isCheckDisabled || !checkInsuranceForm
                }
              />
              <Grid sx={{ mt: 2 }}>
                <SwitchLabel
                  label={t('labor_contract.system_insurance_salary')}
                  name="is_system_insurance_salary"
                  control={control}
                  //@ts-ignore
                  checked={isInsuranceSalary}
                  disabled={!isCheckInsurance || isCheckDisabled || !checkInsuranceForm}
                  onChange={handleSystemInsuranceSalaryChange}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
