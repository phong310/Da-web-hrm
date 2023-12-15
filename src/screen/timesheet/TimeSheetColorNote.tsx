import { Box, Grid, Stack, styled, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { bgColorTimeline } from './timesheetLib'
import Unpaidleave from 'assets/svgs/unpaid_leave.svg'
import paidLeave from 'assets/svgs/paid_leave.svg'
import OTIcon from 'assets/svgs/OT_icon.svg'
import { DOT_TIMESHEET_TYPE } from 'constants/timeSheetType'
import { red, yellow } from '@mui/material/colors'
import { grey } from 'styles/colors'
export const TimesheetColorNote = () => {
  const { t } = useTranslation()

  return (
    <>
      <Stack direction="row" gap={2} alignItems="center" sx={{ height: '100%', flexWrap: 'wrap' }}>
        <Grid container columnGap={{ lg: 5 }} rowGap={2}>
          <Grid xs={6} md={4} lg="auto">
            <Stack direction="row" alignItems="center" gap={1}>
              <DotBeforeTitleV2
                sx={{
                  backgroundColor: bgColorTimeline(DOT_TIMESHEET_TYPE['NORMAL']),
                  boxShadow: '1px 2px 4px #707070'
                }}
              />
              <TypeTimesheetTypography>{t('timesheet.type.fulltime')}</TypeTimesheetTypography>
            </Stack>
          </Grid>
          <Grid xs={6} md={4} lg="auto">
            <Stack direction="row" alignItems="center" gap={1}>
              <ImageIcon src={OTIcon}></ImageIcon>
              <TypeTimesheetTypography>{t('timesheet.type.overtime')}</TypeTimesheetTypography>
            </Stack>
          </Grid>
          <Grid xs={6} md={4} lg="auto">
            <Stack direction="row" alignItems="center" gap={1}>
              <Circle>
                <TypeTimesheetTypography sx={{ fontSize: '10px' }}>x</TypeTimesheetTypography>
              </Circle>
              <TypeTimesheetTypography>
                {t('timesheet.type.no_timekeeping')}
              </TypeTimesheetTypography>
            </Stack>
          </Grid>
          <Grid xs={6} md={4} lg="auto">
            <Stack direction="row" alignItems="center" gap={1}>
              <ImageIcon width={24} height={24} src={Unpaidleave}></ImageIcon>
              <TypeTimesheetTypography>{t('timesheet.type.unpaid_leave')}</TypeTimesheetTypography>
            </Stack>
          </Grid>
          <Grid xs={6} md={4} lg="auto">
            <Stack direction="row" alignItems="center" gap={1}>
              <ImageIcon src={paidLeave} width={24} height={24}></ImageIcon>
              <TypeTimesheetTypography>{t('timesheet.type.paid_leave')}</TypeTimesheetTypography>
            </Stack>
          </Grid>
          <Grid xs={6} md={4} lg="auto">
            <Stack direction="row" alignItems="center" gap={1}>
              <Circle>
                <TypeTimesheetTypography sx={{ fontSize: '10px', fontWeight: 'bold' }}>
                  N
                </TypeTimesheetTypography>
              </Circle>
              <TypeTimesheetTypography>{t('timesheet.type.weekend')}</TypeTimesheetTypography>
            </Stack>
          </Grid>
          <Grid xs={6} md={4} lg="auto">
            <Stack direction="row" alignItems="center" gap={1}>
              <Circle>
                <TypeTimesheetTypography
                  sx={{ fontSize: '10px', color: red['200'], fontWeight: 'bold' }}
                >
                  H
                </TypeTimesheetTypography>
              </Circle>
              <TypeTimesheetTypography>{t('timesheet.type.holiday')}</TypeTimesheetTypography>
            </Stack>
          </Grid>
          <Grid xs={6} md={4} lg="auto">
            <Stack direction="row" alignItems="center" gap={1}>
              <Circle>
                <TypeTimesheetTypography
                  sx={{ fontSize: '10px', color: red['200'], fontWeight: 'bold' }}
                >
                  B
                </TypeTimesheetTypography>
              </Circle>
              <TypeTimesheetTypography>
                {t('timesheet.type.compensatory_working_day')}
              </TypeTimesheetTypography>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </>
  )
}

const TypeTimesheetTypography = styled(Typography)({
  fontWeight: 400,
  fontSize: '12px',
  lineHeight: '18px',
  color: grey[500]
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

const Circle = styled(Box)(({ theme }) => ({
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  boxShadow: '1px 2px 4px #707070',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'white',
  [theme.breakpoints.down('md')]: {
    width: '20px',
    height: '20px'
  }
}))

const ImageIcon = styled('img')(({ theme }) => ({
  width: '24px',
  height: '24px',
  [theme.breakpoints.down('md')]: {
    width: '20px',
    height: '20px'
  }
}))
