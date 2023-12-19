import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { Button, CircularProgress, Grid, Stack } from '@mui/material'
import { Select } from 'components/Form/Autocomplete/Select'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
import { TimePicker } from 'components/Form/Input/TimePicker'
import { Pagev2 } from 'components/Layouts/Page/Pagev2'
import { RoundPaper } from 'components/Layouts/Page/RoundPaper'
import { TableSkeleton } from 'components/Skeleton/TableSkeleton'
import { V1 } from 'constants/apiVersion'
import { useApiResource } from 'lib/hook/useApiResource'
import { SettingOvertimeSalaryCoefficient, SettingTypesOvertimeType } from 'lib/types/settingTypesOvertime'
import { PARSE_COEFFICIENT_OT } from 'lib/types/system_setting'
// import { Select, TimePicker } from 'components/Form'
// import { ButtonCommon } from 'components/Form/components/ButtonCommon'
// import { Pagev2 } from 'components/Layouts/v2'
// import { TableSkeleton } from 'components/Skeleton'
// import { RoundPaperv2 } from 'components/v2/RoundPaperv2'
// import { V1 } from 'constants'
// import { useApiResource } from 'lib/hooks'
// import { SettingOvertimeSalaryCoefficient, SettingTypesOvertimeType } from 'lib/types'
// import { PARSE_COEFFICIENT_OT } from 'lib/utils/contants'
import { diffTimeInMinutes, minutesToHours } from 'lib/utils/datetime'
import { getOnlyTimeFromDate } from 'lib/utils/format'
import { useState } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'

interface ISettingTypesOvertimeFormProps {
  type: number
}

export const SettingTypesOvertimeForm: React.FC<ISettingTypesOvertimeFormProps> = ({ type }) => {
  const { t } = useTranslation()
  const { createOrUpdateApi } = useApiResource<SettingTypesOvertimeType>(
    `${V1}/admin/setting-types-overtime`
  )
  const { control, setValue, watch, handleSubmit, setError } = useForm<SettingTypesOvertimeType>({
    defaultValues: {
      id: 0,
      setting_ot_salary_coefficients: [
        {
          salary_coefficient: 1.5,
          start_time: undefined,
          end_time: undefined
        }
      ]
    }
  })

  const [loading, setLoading] = useState<boolean>(false)

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'setting_ot_salary_coefficients'
  })

  const settingOTSalaryCoefficients = useWatch({
    control,
    name: 'setting_ot_salary_coefficients'
  })

  const [isLoading, setIsLoading] = useState<boolean>(true)

  useQuery<SettingTypesOvertimeType>([`${V1}/admin/setting-types-overtime/show-by-type/${type}`], {
    onSuccess: (data) => {
      setValue('id', data.id)

      data.setting_ot_salary_coefficients.forEach((item: SettingOvertimeSalaryCoefficient) => {
        item['start_time'] = setTimeInit(item['start_time'] as string)
        item['end_time'] = setTimeInit(item['end_time'] as string)
      })
      setValue('setting_ot_salary_coefficients', data.setting_ot_salary_coefficients)

      setIsLoading(false)
    },
    onError: () => {
      setIsLoading(false)
    },
    enabled: true
  })

  const setTimeInit = (value: string) => {
    return new Date('2020-01-01 ' + value)
  }

  const onSubmit = async (value: SettingTypesOvertimeType) => {
    const data = value
    data.setting_ot_salary_coefficients.forEach((item: SettingOvertimeSalaryCoefficient) => {
      item['start_time'] = item['start_time']
        ? getOnlyTimeFromDate(item['start_time'] as string)
        : null
      item['end_time'] = item['end_time'] ? getOnlyTimeFromDate(item['end_time'] as string) : null
    })
    data['type'] = type
    setLoading(true)
    try {
      const res = await createOrUpdateApi(data)

      if (res.status === 200) {
        toast.success(t('toast.success'))
        setLoading(false)
      }
    } catch (errors:any) {
      toast.error(errors.error)
      setLoading(false)
      if (errors.errors) {
        for (const [key, value] of Object.entries(errors.errors)) {
          setError(key as keyof SettingTypesOvertimeType, { message: t(value as string) })
        }
      }
    }
  }

  const grid_input = {
    xs: 12,
    lg: 3.6,
    md: 3.4
  }

  const grid_icon = {
    xs: 12
  }

  return (
    <RoundPaper>
      <Pagev2 sxCustom={{ padding: '16px !important' }}>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <Stack gap={3} component="form" onSubmit={handleSubmit(onSubmit)}>
            {fields.map((field, index) => (
              <Grid key={field.id} container spacing={2}>
                <Grid item {...grid_input}>
                  <TimePicker
                    fullWidth
                    required
                    label={t('start_time')}
                    name={`setting_ot_salary_coefficients.${index}.start_time`}
                    control={control}
                    helperText={
                      <span style={{ fontSize: '14px' }}>
                        {t('setting_types_overtime.total_time') + ': '}
                        <span style={{ fontWeight: 700 }}>
                          {minutesToHours(
                            Number(
                              diffTimeInMinutes(
                                settingOTSalaryCoefficients?.[index]?.start_time as string,
                                settingOTSalaryCoefficients?.[index]?.end_time as string
                              )
                            )
                          )}
                        </span>
                      </span>
                    }
                  />
                </Grid>
                <Grid item {...grid_input}>
                  <TimePicker
                    required
                    fullWidth
                    label={t('end_time')}
                    name={`setting_ot_salary_coefficients.${index}.end_time`}
                    control={control}
                  />
                </Grid>
                <Grid item {...grid_input}>
                  <Select
                    required
                    label={t('setting_types_overtime.salary_coefficient')}
                    name={`setting_ot_salary_coefficients.${index}.salary_coefficient`}
                    type="text"
                    control={control}
                    fullWidth
                    options={PARSE_COEFFICIENT_OT}
                  />
                </Grid>
                {/* {fields.length > 1 && ( */}
                <Grid item textAlign={'end'} sx={{ flex: 1, alignSelf: 'center' }}>
                  <Button variant={'contained'} color={'error'} onClick={() => remove(index)}>
                    <CloseIcon />
                  </Button>
                </Grid>
                {/* )} */}
              </Grid>
            ))}
            <Grid item {...grid_icon} textAlign={'end'}>
              <Button
                variant={'contained'}
                onClick={() => {
                  append({
                    salary_coefficient: 1.5,
                    //@ts-ignore
                    start_time: undefined,
                    //@ts-ignore
                    end_time: undefined
                  })
                }}
              >
                <AddIcon />
              </Button>
            </Grid>
            <Grid container justifyContent="flex-end" gap={2} style={{ marginTop: 20 }}>
              <ButtonCommon
                disabled={loading}
                startIcon={loading && <CircularProgress color="inherit" size={12} />}
                sx={{ maxWidth: '150px' }}
                type="submit"
                variant="contained"
              >
                {watch('id') ? t('update') : t('submit')}
              </ButtonCommon>
            </Grid>
          </Stack>
        )}
      </Pagev2>
    </RoundPaper>
  )
}
