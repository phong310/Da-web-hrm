import { Box, Grid, Typography } from '@mui/material'
import { useAtomValue } from 'jotai'
import { systemSettingAtom } from 'lib/atom/authAtom'
import { TimesheetCalendarType } from 'lib/types/timeSheet'
import { minutesToHours } from 'lib/utils/datetime'
import { convertDatetimeTZ, formatTime } from 'lib/utils/format'
import React from 'react'
import { useTranslation } from 'react-i18next'

type DataProps = {
  data: TimesheetCalendarType
}

export const CompensatoryLeaveTimeSheet: React.VFC<DataProps> = ({ data }) => {
  const systemSetting: any = useAtomValue(systemSettingAtom)
  const { t } = useTranslation()

  return (
    <>
      {!!data.compensatory_leave_has_timesheet && (
        <>
          <Box sx={{ ...styleTitleDetail }}>
            <Typography sx={{ ...styleLabel }}>
              {t('application_form.compensatory_leave_application')}
            </Typography>
            <Typography sx={{ ...styleLabel }}>
              {minutesToHours(
                data.compensatory_leave_has_timesheet
                  ? (data.compensatory_leave_has_timesheet.time_off as number)
                  : 0
              )}
            </Typography>
          </Box>

          <Grid item container xs={12} sx={{ ...styleTime, mb: '16px', ...styleColorPM }}>
            <Grid item xs={6} sx={{ ...styleTime }}>
              <Typography sx={{ ...styleText, ...textCenter }} variant="h1" component="div">
                {formatTime(
                  convertDatetimeTZ(
                    data.compensatory_leave_has_timesheet.start_time,
                    systemSetting.time_zone
                  )
                )}{' '}
                -{' '}
                {formatTime(
                  convertDatetimeTZ(
                    data.compensatory_leave_has_timesheet.end_time,
                    systemSetting.time_zone
                  )
                )}
                <Typography sx={{ ...customBadgeSalary }}>
                  {data.compensatory_leave_has_timesheet.compensatory_leave.kolSymbol}
                </Typography>
              </Typography>
            </Grid>
          </Grid>
        </>
      )}
    </>
  )
}

const customBadgeSalary = {
  position: 'relative',
  top: '-8px',
  right: { xs: '-3px', sm: '-5px' },
  color: ' var(--green-600, #20B369)',
  fontSize: { xs: '10px', sm: '13px' },
  fontWeight: 'bold'
}
const styleColorPM = {
  borderRadius: '8px',
  background: 'var(--green-000, #EDFFF6);',
  color: ' var(--green-600, #20B369)'
}
const styleLabel = {
  fontSize: { xs: '12px', sm: '14px' },
  fontWeight: 'bold',
  color: ' var(--green-600, #20B369)'
}

const styleText = {
  fontWeight: 'bold',
  fontSize: { xs: '13px', sm: '16px' },
  lineHeight: '20px',
  position: 'relative'
}

const textCenter = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

export const styleTitleDetail = {
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center'
}

export const styleTime = {
  display: 'flex',
  width: '100%',
  padding: '8px 0',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '4px'
}