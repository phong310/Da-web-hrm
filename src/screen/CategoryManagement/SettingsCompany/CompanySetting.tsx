// @ts-nocheck
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, CircularProgress, Grid, Stack } from '@mui/material'
import { Select } from 'components/Form/Autocomplete/Select'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
import { Pagev2 } from 'components/Layouts/Page/Pagev2'
import { RoundPaper } from 'components/Layouts/Page/RoundPaper'
import { V1 } from 'constants/apiVersion'
import { useAuth } from 'lib/hook/useAuth'
import { request } from 'lib/request'
import { parseFormatDate, parseLocale, parseTimeZone } from 'lib/utils/contants'
import { replaceSlashesToDashes } from 'lib/utils/format'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'
import * as yup from 'yup'
type UpdateSystemSettingType = {
  format_date: string
  time_zone: string
  locale: string
}

export const CompanySetting: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const validateLeaveForm = yup.object({
    format_date: yup.string().required(t('validate.required.format_date')),
    time_zone: yup.string().required(t('validate.required.time_zone')),
    locale: yup.string().required(t('validate.required.locale'))
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { control, handleSubmit, setValue } = useForm<UpdateSystemSettingType>({
    defaultValues: {
      format_date: '',
      time_zone: '',
      locale: ''
    },

    resolver: yupResolver(validateLeaveForm)
  })

  useQuery<UpdateSystemSettingType>(
    [`${V1}/admin/settings/get-by-company/${user ? user.company.id : null}`],
    {
      onSuccess: (data) => {
        setValue('format_date', replaceSlashesToDashes(data.format_date))
        setValue('time_zone', data.time_zone)
        setValue('locale', data.locale)
      }
    }
  )
  const onSubmit: SubmitHandler<UpdateSystemSettingType> = async (value) => {
    setIsLoading(true)
    try {
      const res = await request.patch(`1.0/admin/settings/update`, value)
      if (res.status == 200) {
        localStorage.setItem('system-setting', JSON.stringify(value))
      }
      toast.success(res.data.message)
    } catch (error:any) {
      toast.error(error.error)
    }
    setIsLoading(false)
  }
  const grid = { xs: 12, sm: 4 }
  return (
    <RoundPaper>
      <Pagev2 sx={{ padding: '16px !important' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            minHeight: '265px'
          }}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid container columnSpacing={2} rowSpacing={3}>
            <Grid item {...grid}>
              <Select
                label={t('system_setting.format_date')}
                name="format_date"
                placeholder={t('system_setting.format_date')}
                type="text"
                control={control}
                fullWidth
                options={parseFormatDate}
              />
            </Grid>
            <Grid item {...grid}>
              <Select
                label={t('system_setting.time_zone')}
                placeholder={t('system_setting.time_zone')}
                name="time_zone"
                type="text"
                control={control}
                fullWidth
                options={parseTimeZone}
              />
            </Grid>
            <Grid item {...grid}>
              <Select
                label={t('system_setting.locale')}
                placeholder={t('system_setting.locale')}
                name="locale"
                type="text"
                control={control}
                fullWidth
                options={parseLocale.map((item, index) => ({
                  ...item,
                  label: t(`language.${item.label}`)
                }))}
              />
            </Grid>
          </Grid>
          <Box mt={3}>
            <Stack direction={'row'} justifyContent={'end'} spacing={1}>
              <ButtonCommon
                disabled={isLoading}
                variant="contained"
                startIcon={isLoading ? <CircularProgress size={12} /> : ''}
                type="submit"
                sx={{ height: 40, maxWidth: '150px' }}
              >
                {t('update')}
              </ButtonCommon>
            </Stack>
          </Box>
        </Box>
      </Pagev2>
    </RoundPaper>
  )
}
