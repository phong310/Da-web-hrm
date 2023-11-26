//@ts-nocheck
import { Box, Grid, Typography } from '@mui/material'
import { Select } from 'components/Form/Autocomplete/Select'
import { PARSE_FORMAT_DATE, PARSE_LOCALE, PARSE_TIME_ZONE } from 'lib/types/system_setting'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

type SettingDisplayFormatProps = {
  control: any
}
export const grid_company_settings = {
  xs: 12,
  sm: 4
}
const SettingDisplayFormat: React.VFC<SettingDisplayFormatProps> = ({ control }) => {
  // const { company } = useAuth()
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  return (
    <Box component="form" noValidate autoComplete="off">
      <Grid container mt={3} spacing={2}>
        <Grid item xs={12}>
          <Typography variant={'h6'}>{t('companies.setting_display_format')}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item {...grid_company_settings}>
              <Select
                label={t('system_setting.format_date')}
                name="format_date"
                type="text"
                control={control}
                required
                fullWidth
                options={PARSE_FORMAT_DATE}
              />
            </Grid>
            <Grid item {...grid_company_settings}>
              <Select
                label={t('system_setting.time_zone')}
                name="time_zone"
                type="text"
                required
                control={control}
                fullWidth
                options={PARSE_TIME_ZONE}
              />
            </Grid>
            <Grid item {...grid_company_settings}>
              <Select
                label={t('system_setting.locale')}
                name="locale"
                type="text"
                required
                control={control}
                fullWidth
                options={PARSE_LOCALE.map((item, index) => ({
                  ...item,
                  label: t(`language.${item.label}`)
                }))}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export { SettingDisplayFormat }

