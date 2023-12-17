import { Box, styled, Typography } from '@mui/material'
import { TIMESHEET_TYPE_TIME } from 'constants/timeSheetType'
import { TimeSheetData } from 'lib/types/timeSheet'
import { minutesToOnlyHours } from 'lib/utils/datetime'
import { bgColorTimelineTypeTime, colorTimeLineTypeTime } from '../timesheetLib'
import { yellow } from '@mui/material/colors'
// import { TIMESHEET_TYPE, TIMESHEET_TYPE_TIME } from 'constants'
// import { TimeSheetData } from 'lib/types'
// import { minutesToOnlyHours } from 'lib/utils'
// import { grey, yellow } from 'styles'
// import { bgColorTimelineTypeTime } from '../v2/timesheetLib'
// import { colorTimeLineTypeTime } from '../v2/timesheetLib'
type PropsType = {
  event: TimeSheetData
  total_time: number
  total_time_work_without_time_off?: number
  coefficientSalaryOT?: number | string
  checktotalOTTable?: boolean
}

export const ManagementTimesheetTimeLine = (props: PropsType) => {
  const {
    event,
    total_time,
    checktotalOTTable,
    total_time_work_without_time_off,
    coefficientSalaryOT
  } = props
  let hasKOL = false
  let hasOT = false
  const handleConvertTotalTime = (total_time: number, event: TimeSheetData) => {
    if (total_time === 0) return

    if (event.type_time === TIMESHEET_TYPE_TIME['WORKING_TIME']) {
      if (!event.type) {
        hasKOL = true
      }
    } else if (event.type_time === TIMESHEET_TYPE_TIME['OVERTIME']) {
      hasOT = true
    }
    return `${minutesToOnlyHours(total_time || 0)}h`
  }

  let kolSymbol = ''

  if (event?.leave_form?.kolSymbol || event?.compensatory_leave?.kolSymbol) {
    kolSymbol = event?.leave_form?.kolSymbol || event?.compensatory_leave?.kolSymbol
  }
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {total_time !== 0 ? (
        <Box
          sx={{
            color: checktotalOTTable ? 'inherit' : colorTimeLineTypeTime(event),
            backgroundColor: checktotalOTTable ? 'transparent' : bgColorTimelineTypeTime(event),
            padding: '2px 4px 2px 4px',
            borderRadius: '8px',
            position: 'relative'
          }}
        >
          <Box sx={{ display: 'flex' }}>
            {
              <Typography sx={{ ...styleTime }}>
                {total_time_work_without_time_off &&
                  `${minutesToOnlyHours(total_time_work_without_time_off)}h`}
              </Typography>
            }
            {event?.time_off && (
              <Typography sx={{ ...styleTime }}>
                {handleConvertTotalTime(event.time_off, event)}
              </Typography>
            )}
            {event?.type_time === TIMESHEET_TYPE_TIME['OVERTIME'] && (
              <Typography sx={{ ...styleTime }}>
                {handleConvertTotalTime(total_time, event)}
              </Typography>
            )}
            <Typography>
              {hasKOL && (
                <Box
                  sx={{
                    marginLeft: '2px',
                    fontSize: '10px',
                    height: '10px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {kolSymbol}
                </Box>
              )}
            </Typography>
            <Typography>
              {hasOT && (
                <Box
                  sx={{
                    marginLeft: '2px',
                    fontSize: '10px',
                    height: '10px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  +{coefficientSalaryOT ? coefficientSalaryOT : ''}
                </Box>
              )}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box>
          <Typography sx={{ ...styleTime }}>0</Typography>
        </Box>
      )}
    </Box>
  )
}
const styleTime = {
  fontSize: { xs: '12px', md: '14px' }
}
export const DotBeforeTitle = styled(Box)({
  // receive base background color
  width: '20px',
  height: '20px',
  backgroundColor: yellow[100],
  borderRadius: '50%'
})
export const DotBeforeTitleV2 = styled(Box)(({ theme }) => ({
  // receive base background color
  width: '24px',
  height: '24px',
  backgroundColor: yellow[100],
  borderRadius: '50%',
  [theme.breakpoints.down('md')]: {
    width: '20px',
    height: '20px'
  }
}))
