import { Button, styled, Typography } from '@mui/material'
import { TIMESHEET_TYPE_TIME } from 'constants/timeSheetType'
import { useAtomValue } from 'jotai'
import { systemSettingAtom } from 'lib/atom/authAtom'
import { TimeSheetData } from 'lib/types/timeSheet'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { bgColorTimelineTypeTime, colorTimeLineTypeTime } from './timesheetLib'
import { convertDatetimeTZ, convertTime } from 'lib/utils/format'

interface TimeSheetTimelineType {
  event: TimeSheetData
  handleSelect?: (event: TimeSheetData) => void
  sx?: any
}

export const TimeSheetTimeline = ({ event, handleSelect, sx }: TimeSheetTimelineType) => {
  const systemSetting: any = useAtomValue(systemSettingAtom)

  let kolSymbol = ''
  let coefficientSalary = ''

  if (
    event.type_time === TIMESHEET_TYPE_TIME['WORKING_TIME'] &&
    (event?.leave_form?.kolSymbol || event?.compensatory_leave?.kolSymbol)
  ) {
    kolSymbol = event?.leave_form?.kolSymbol || event?.compensatory_leave?.kolSymbol
  }

  if (event.type_time === TIMESHEET_TYPE_TIME['OVERTIME']) {
    coefficientSalary = event?.salary_coefficient
  }

  return (
    <Button
      // onClick={() => {
      //   handleSelect && handleSelect(event)
      // }}
      sx={{ ...styleButtonTime, ...sx }}
    >
      <Typography
        sx={{
          ...styleText,
          color: colorTimeLineTypeTime(event),
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
          backgroundColor: bgColorTimelineTypeTime(event),
          borderRadius: '6px',
          paddingX: { sm: 0.5, lg: 0.5 },
          paddingY: 0.5,
          position: 'relative',
          fontSize: {
            xs: '10px',
            sm: '12px',
            md: 'unset'
          }
        }}
        variant="body1"
      >
        {kolSymbol && <KOLStyled>{kolSymbol}</KOLStyled>}
        {coefficientSalary && <CSStyled>+{coefficientSalary}</CSStyled>}
        {`${
          event.start_time
            ? convertTime(convertDatetimeTZ(event.start_time, systemSetting.time_zone))
            : ''
        } - ${
          event.end_time
            ? convertTime(convertDatetimeTZ(event.end_time, systemSetting.time_zone))
            : ''
        }`}
      </Typography>
    </Button>
  )
}

const styleButtonTime = {
  height: '28px',
  width: '100%',
  textAlign: 'center'
}

const styleText = {
  fontWeight: 500,
  fontSize: '14px',
  width: '100%',
  lineHeight: '20px'
}

const KOLStyled = styled('span')(({ theme }) => ({
  position: 'absolute',
  top: '-2px',
  fontSize: '8px',
  right: '2px',
  fontWeight: 'bold',
  opacity: '0.6',
  [theme.breakpoints.down('sm')]: {
    left: 'calc(50% + 32px)',
    fontSize: '8px'
  }
}))

const CSStyled = styled('span')(({ theme }) => ({
  position: 'absolute',
  top: '-2px',
  right: '2px',
  fontSize: '8px',
  fontWeight: 'bold',
  opacity: '0.6',
  [theme.breakpoints.down('sm')]: {
    left: 'calc(50% + 32px)',
    fontSize: '8px'
  }
}))
