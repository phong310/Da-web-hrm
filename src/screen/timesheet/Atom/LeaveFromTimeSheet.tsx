import { Grid, Typography } from '@mui/material'
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

export const LeaveFromTimeSheet: React.VFC<DataProps> = ({ data }) => {
  const systemSetting: any = useAtomValue(systemSettingAtom)
  const { t } = useTranslation()

  return (
    <>
      {!!data.leave_form_has_timesheets &&
        data.leave_form_has_timesheets.map((leaveFormHasTimesheets:any, index) => (
          <>
            {leaveFormHasTimesheets.leave_form.is_salary === 1 ? (
              <>
                <Grid
                  sx={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Typography key={index} sx={{ ...styleLabelSalary }}>
                    {t('dashboard.leave_management')}
                  </Typography>
                  <Typography key={index} sx={{ ...styleLabelSalary }}>
                    {/* {t('dashboard.leave_management')} */}
                    {minutesToHours(
                      leaveFormHasTimesheets?.time_off
                        ? (leaveFormHasTimesheets?.time_off as number)
                        : 0
                    )}
                  </Typography>
                </Grid>
                <Grid item container xs={12} sx={{ ...styleTime, mb: '16px', ...styleColorSalary }}>
                  <Grid item xs={6} sx={{ ...styleTime }}>
                    <Typography sx={{ ...styleText, ...textCenter }} variant="h1" component="div">
                      {formatTime(
                        convertDatetimeTZ(
                          leaveFormHasTimesheets.start_time,
                          systemSetting.time_zone
                        )
                      )}{' '}
                      -{' '}
                      {formatTime(
                        convertDatetimeTZ(leaveFormHasTimesheets.end_time, systemSetting.time_zone)
                      )}{' '}
                      <Typography sx={{ ...customBadgeSalary }}>
                        {leaveFormHasTimesheets.leave_form.kolSymbol}
                      </Typography>
                    </Typography>
                  </Grid>
                </Grid>
              </>
            ) : (
              <>
                <Grid
                  sx={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Typography key={index} sx={{ ...styleLabel }}>
                    {t('dashboard.leave_management')}
                  </Typography>
                  <Typography key={index} sx={{ ...styleLabel }}>
                    {/* {t('dashboard.leave_management')} */}
                    {minutesToHours(
                      leaveFormHasTimesheets?.time_off
                        ? (leaveFormHasTimesheets?.time_off as number)
                        : 0
                    )}
                  </Typography>
                </Grid>
                <Grid item container xs={12} sx={{ ...styleTime, mb: '16px', ...styleColorPM }}>
                  <Grid item xs={6} sx={{ ...styleTime }}>
                    <Typography sx={{ ...styleText, ...textCenter }} variant="h1" component="div">
                      {formatTime(
                        convertDatetimeTZ(
                          leaveFormHasTimesheets.start_time,
                          systemSetting.time_zone
                        )
                      )}{' '}
                      - {''}
                      {formatTime(
                        convertDatetimeTZ(leaveFormHasTimesheets.end_time, systemSetting.time_zone)
                      )}{' '}
                      <Typography sx={{ ...customBadge }}>
                        {leaveFormHasTimesheets.leave_form.kolSymbol}
                      </Typography>
                    </Typography>
                  </Grid>
                </Grid>
              </>
            )}
          </>
        ))}
    </>
  )
}
const styleLabel = {
  fontSize: { xs: '12px', sm: '14px' },
  fontWeight: 'bold',
  color: ' #F9841A'
}
const styleLabelSalary = {
  fontSize: { xs: '12px', sm: '14px' },
  fontWeight: 'bold',
  color: '  #20B369'
}


export const styleTime = {
  display: 'flex',
  width: '100%',
  padding: '8px 0',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '4px'
}

const styleColorPM = {
  borderRadius: '8px',
  background: 'var(--orange-000, #FFF3E8);',
  color: 'var(--orange-400, #F9841A)'
}
const styleColorSalary = {
  borderRadius: '8px',
  background: 'var(--green-000, #EDFFF6);',
  color: ' var(--green-600, #20B369)'
}

const customBadgeSalary = {
  position: 'relative',
  top: '-8px',
  right: { xs: '-2px', sm: '-5px' },
  color: ' #20B369',
  fontSize: { xs: '8px', sm: '13px' },
  fontWeight: 'bold'
}
const customBadge = {
  position: 'relative',
  top: '-8px',
  right: { xs: '-2px', sm: '-5px' },
  color: ' #F9841A',
  fontSize: { xs: '8px', sm: '13px' },
  fontWeight: 'bold'
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
