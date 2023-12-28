import NightsStayIcon from '@mui/icons-material/NightsStay'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import Timeline from '@mui/lab/Timeline'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineOppositeContent, {
  timelineOppositeContentClasses
} from '@mui/lab/TimelineOppositeContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import Typography from '@mui/material/Typography'
import { t } from 'i18next'
import * as React from 'react'
import { responsiveTextStyle } from 'screen/application/LeaveAppBlockInformation'

type CustomTimelineProps = {
  start_date: Date | string | any
  end_date?: Date | string | any
  start_time?: Date | string | any
  end_time?: Date | string | any
  in_day?: boolean
}
const CustomTimeline: any = ({
  start_time,
  end_time,
  start_date,
  end_date,
  // @ts-ignore
  in_day
}: CustomTimelineProps) => {
  return (
    <React.Fragment>
      <Timeline
        sx={{
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0.05,
            margin: '0px',
            padding: '0px'
          },
          padding: { xs: 0 }
        }}
        onResize={undefined}
        onResizeCapture={undefined}
      >
        <TimelineItem>
          <TimelineOppositeContent
            sx={{ m: 'auto 0', width: 'fit-content', ...responsiveTextStyle }}
            align="center"
            variant="body2"
            color="text.secondary"
          >
            {start_time}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot>
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-ignore */}
              <WbSunnyIcon fontSize="10px" />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ ...responsiveTimelineCotent }}>
            <Typography sx={{ ...responsiveTimelineContent }} component="span">
              {t('start_time')}
            </Typography>
            {<Typography>{start_date}</Typography>}
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent
            sx={{ m: 'auto 0', ...responsiveTextStyle }}
            variant="body2"
            color="text.secondary"
          >
            {end_time}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot color="primary">
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-ignore */}
              <NightsStayIcon fontSize="10px" />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ ...responsiveTimelineCotent }}>
            <Typography sx={{ ...responsiveTimelineContent }} component="span">
              {t('end_time')}
            </Typography>
            {<Typography>{end_date}</Typography>}
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </React.Fragment>
  )
}

export { CustomTimeline }

const responsiveTimelineCotent = {
  color: '#000',
  px: { xs: 0.5, sm: 2 }
}

const responsiveTimelineContent = {
  color: '#000',
  fontSize: 16,
  fontWeight: 600
}
