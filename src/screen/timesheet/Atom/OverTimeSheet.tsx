import { Box, Grid, Typography } from '@mui/material'
import { useAtomValue } from 'jotai'
import { systemSettingAtom } from 'lib/atom/authAtom'
import { TimesheetCalendarType } from 'lib/types/timeSheet'
import { minutesToHours } from 'lib/utils/datetime'
import { convertDatetimeTZ, formatTime } from 'lib/utils/format'
// import { systemSettingAtom } from 'lib/atom'
// import { TimesheetCalendarType } from 'lib/types'
// import { convertDatetimeTZ, formatTime, minutesToHours } from 'lib/utils'
import React from 'react'
import { useTranslation } from 'react-i18next'
// import { styleTitleDetail } from '../v2/TimeKeepingModalV2'

type DataProps = {
  data: TimesheetCalendarType
}

export const OverTimeSheet: React.VFC<DataProps> = ({ data }) => {
  const systemSetting: any = useAtomValue(systemSettingAtom)
  const { t } = useTranslation()

  return (
    <>
      {!!data.overtime && data.overtime.overtime_salary_coefficients?.length > 0 && (
        <>
          {data.overtime.overtime_salary_coefficients.map((item: string | any) => (
            <Box sx={{ width: '100%' }} key={item}>
              <Box
                sx={{
                  ...styleTitleDetail
                }}
              >
                <Typography sx={{ ...styleLabel }}>{t('dashboard.overtime_management')}</Typography>
                <Typography sx={{ ...styleLabel }}>
                  {minutesToHours(item?.total_time_work ? item?.total_time_work : 0)}
                </Typography>
              </Box>
              <Grid item container xs={12} sx={{ ...styleTime, mb: '16px', ...styleColorPM }}>
                <Grid item xs={6} sx={{ ...styleTime }}>
                  <Typography sx={{ ...styleText, ...textCenter }} variant="h1" component="div">
                    {formatTime(convertDatetimeTZ(item.start_time, systemSetting.time_zone))} -{' '}
                    {formatTime(convertDatetimeTZ(item.end_time, systemSetting.time_zone))}
                    <Typography sx={{ ...customBadge, minWidth: '40px' }}>
                      +{item.salary_coefficient}
                    </Typography>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          ))}
        </>
      )}
    </>
  )
}
const styleLabel = {
  fontSize: { xs: '13px', sm: '14px' },
  fontWeight: 'bold',
  color: '#FB3BAA'
}

const styleColorPM = {
  borderRadius: '8px',
  background: '#FFE9F5',
  color: '#FB3BAA'
}

export const styleTitleDetail = {
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center'
}

const styleTime = {
  display: 'flex',
  width: '100%',
  padding: '8px 0',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '4px'
}

const styleText = {
  fontWeight: 'bold',
  fontSize: { xs: '13px', sm: '16px' },
  lineHeight: '20px',
  position: 'relative'
}

const customBadge = {
  position: 'absolute',
  top: '-8px',
  right: '-5px',
  transform: 'translateX(100%)',
  color: '#FB3BAA',
  fontSize: { xs: '12px', sm: '13px' },
  fontWeight: 'bold'
}

const textCenter = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}
