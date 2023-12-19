import { Grid } from '@mui/material'
import { Select, SelectOption } from 'components/Form/Autocomplete/Select'
import { USER_URL } from 'constants/apiVersion'
import { AllowanceType, LaborContractType, LaborContractTypeType } from 'lib/types/labor-contract'
// import { DatePicker, Input, MultiSelect, Select, SelectOption } from 'components/Form'
// import { USER_URL } from 'constants'
// import { AllowanceType, LaborContractType, LaborContractTypeType } from 'lib/types'
// import { numberWithCommas, formatDate } from 'lib/utils/'
import {
  STATUS_LABOR_CONTRACT_OPTIONS,
  STATUS_LABOR_CONTRACT,
  STATUS_LABOR_CONTRACT_HISTORY
} from 'lib/utils/contants'
import { formatDate } from 'lib/utils/format'
import React, { useEffect, useState } from 'react'
import { Control, UseFormSetValue, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { Heading, grid_full } from './components'
import { Input } from 'components/Form/Input/Input'
import { DatePicker } from 'components/Form/Input/DatePicker'
import { MultiSelect } from 'components/Form/Input/MultiSelect'
import { numberWithCommas } from 'lib/utils/format-number'
// import { grid_full, grid_half, grid_input, Heading } from 'screen/labor-contract'
type LaborContractFormProps = {
  control: Control<LaborContractType, object>
  setValue: UseFormSetValue<LaborContractType>
  isCheckDisabled?: boolean
  watch?: any
}

export type ResponseType<T> = {
  data: T[]
}

export const LaborContractForm: React.FC<LaborContractFormProps> = ({
  control,
  setValue,
  watch,
  isCheckDisabled
}) => {
  const { t } = useTranslation()
  const params = useParams()
  const [laborContractTypeList, setLaborContractTypeList] = useState<LaborContractTypeType[]>([])
  const [laborContractTypeOption, setLaborContractTypeOption] = useState<SelectOption[]>([])

  const laborContractType = useWatch({
    control,
    name: 'labor_contract_type_id'
  })

  const effectiveDate = useWatch({
    control,
    name: 'effective_date'
  })

  useQuery<ResponseType<LaborContractTypeType>>([`${USER_URL}/labor-contract-type?per_page=100`], {
    onSuccess: (data) => {
      setLaborContractTypeList(data.data)
      setLaborContractTypeOption(data.data.map((item) => ({ label: item.name, value: item.id })))
    },
    enabled: true
  })

  const [allowanceOption, setAllowanceOption] = useState<SelectOption[]>([])
  useQuery<ResponseType<AllowanceType>>([`${USER_URL}/allowance?per_page=100`], {
    onSuccess: (data) => {
      setAllowanceOption(
        data.data.map((item) => ({
          label: `${item.name} (${numberWithCommas(item.amount_of_money)} vnđ/tháng)`,
          value: item.id
        }))
      )
    },
    enabled: !!laborContractType
  })

  useEffect(() => {
    const laborContract = laborContractTypeList.find(
      (item: LaborContractTypeType) => item.id === laborContractType
    )

    if (
      effectiveDate &&
      laborContractType &&
      laborContract &&
      laborContract?.duration_of_contract !== null &&
      !watch('expire_date')
    ) {
      const effectiveFormatDate = new Date(effectiveDate)
      const expireDate = new Date(
        effectiveFormatDate.setMonth(
          effectiveFormatDate.getMonth() + laborContract.duration_of_contract
        )
      )
      setValue('expire_date', formatDate(expireDate, 'yyyy/MM/dd'))
    }
  }, [laborContractType, effectiveDate, params.id, setValue, watch])

  useEffect(() => {
    if (!params.id) {
      const allowances = laborContractTypeList.find(
        (item: LaborContractTypeType) => item.id === laborContractType
      )?.allowances

      setValue(
        'allowances',
        allowances?.map((item: AllowanceType) => item.id),
        {
          shouldValidate: true
        }
      )
    }
  }, [laborContractType, laborContractTypeList, params.id, setValue])

  useEffect(() => {
    if (!params.id) {
      setValue('status', STATUS_LABOR_CONTRACT.ACTIVE)
    }
  }, [params.id])

  const styleHeightInput = {
    height: {
      xs: '38px',
      sm: '42px',
      '.MuiOutlinedInput-input': {
        fontSize: { xs: '14px', sm: '16px' }
      }
    }
  }

  const grid_input_labor = {
    xs: 12,
    sm: 6,
    lg: 3
  }

  const grid = { xs: 6, sm: 6, md: 4, lg: 4 }

  return (
    <>
      <Grid container item {...grid_full}>
        <Heading>{t('labor_contract.name')}</Heading>
      </Grid>
      <Grid container rowSpacing={{ xs: 2, sm: 3 }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid container item md={12} spacing={2}>
          <Grid item {...grid}>
            <Input
              label={t('labor_contract.code')}
              name="code"
              placeholder={t('labor_contract.code')}
              control={control}
              fullWidth
              required
              sx={{ ...styleHeightInput }}
              disabled={isCheckDisabled}
            />
          </Grid>
          <Grid item {...grid}>
            <Select
              label={t('labor_contract.type_labor_contract')}
              name="labor_contract_type_id"
              options={laborContractTypeOption}
              placeholder={t('labor_contract.type_labor_contract')}
              control={control}
              fullWidth
              required
              disabled={isCheckDisabled}
            />
          </Grid>
          {params.id ? (
            <Grid item {...grid}>
              <Select
                label={t('labor_contract.status.name')}
                name="status"
                control={control}
                fullWidth
                options={
                  isCheckDisabled ? STATUS_LABOR_CONTRACT_HISTORY : STATUS_LABOR_CONTRACT_OPTIONS
                }
                placeholder={t('labor_contract.status.name')}
                disabled={isCheckDisabled}
                required
              />
            </Grid>
          ) : (
            ''
          )}
        </Grid>

        <Grid container item md={12} spacing={2}>
          <Grid item {...grid}>
            <DatePicker
              label={t('labor_contract.effective_date')}
              name="effective_date"
              control={control}
              fullWidth
              required
              disabled={isCheckDisabled}
            />
          </Grid>

          <Grid item {...grid}>
            <DatePicker
              label={t('labor_contract.expire_date')}
              name="expire_date"
              control={control}
              fullWidth
              hasOnClear
              disabled={isCheckDisabled}
            />
          </Grid>
          <Grid item {...grid}>
            <DatePicker
              label={t('labor_contract.sign_date')}
              name="sign_date"
              control={control}
              fullWidth
              required
              disabled={isCheckDisabled}
            />
          </Grid>
        </Grid>

        <Grid container item md={12} spacing={2}>
          <Grid item xs={12} md={8}>
            <MultiSelect
              label={t('labor_contract.allowance')}
              name="allowances"
              control={control}
              placeholder={t('labor_contract.allowance')}
              options={laborContractType ? allowanceOption : []}
              fullWidth
              required
              disabled={isCheckDisabled}
              style={{ minHeight: 100 }}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
