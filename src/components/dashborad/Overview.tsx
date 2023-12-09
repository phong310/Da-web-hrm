/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Card, Grid, styled, Typography } from '@mui/material'
import ImageOverView from 'assets/images/overview-image-1.png'
import { ArcElement, Chart as ChartJS, Tooltip } from 'chart.js'
import TitleCard from 'components/ReactTable/Components/TitleCard'
import { useApiResource } from 'lib/hook/useApiResource'
import { useAuth } from 'lib/hook/useAuth'
import { useCurrentTime } from 'lib/hook/useCurrentTime'
// import { useApiResource, useAuth, useCurrentTime } from 'lib/hooks'
import { request } from 'lib/request'
import { TimeSheetLogData, TimeSheetLogTodayData } from 'lib/types/timeSheet'
import { convertDatetimeTZ, formatDateTime, formatTime } from 'lib/utils/format'
// import { TimeSheetLogData, TimeSheetLogTodayData } from 'lib/types'
// import { convertDatetimeTZ, formatDateTime, formatTime } from 'lib/utils'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'
import { Base, Greyscale, Orange, PrimaryColors } from 'styles/colors'
// import { Base, Greyscale, Orange, PrimaryColors } from 'styles/v2'
// import TitleCard from '../common/TitleCard'
ChartJS.register(ArcElement, Tooltip)
function Overview({
  systemSetting,
  remainingDayOff
}: {
  systemSetting: any
  remainingDayOff: any
}) {
  const { user } = useAuth()
  const { t, i18n } = useTranslation()
  const timezone = user?.company.setting.time_zone as string

  const [timekeepingFirst, setTimekeepingFirst] = useState<string>('')
  const [timekeepingLast, setTimekeepingLast] = useState<string>('')
  const [currentTime] = useCurrentTime()
  const [loading, setLoading] = useState(true)

  const { createOrUpdateApi } = useApiResource<TimeSheetLogData>('1.0/user/timekeeping')

  useQuery<TimeSheetLogTodayData>([`1.0/user/timekeeping/today`], {
    onSuccess: (data) => {
      updateButton(data)
      setLoading(false)
    },
    onError: (err: unknown) => {
      setLoading(false)
    }
  })

  const updateButton = (data: TimeSheetLogTodayData) => {
    if (data.first) {
      setTimekeepingFirst(formatTime(convertDatetimeTZ(data.first, systemSetting?.time_zone)))
    }

    if (data.last) {
      setTimekeepingLast(formatTime(convertDatetimeTZ(data.last, systemSetting?.time_zone)))
    }
  }

  const language = i18n.language

  const { handleSubmit } = useForm<TimeSheetLogData>({
    defaultValues: {
      date_time: formatDateTime(new Date()),
      type: NaN
    }
  })

  const onSubmit: SubmitHandler<TimeSheetLogData> = async (value) => {
    setLoading(true)
    try {
      const res = await createOrUpdateApi(value)
      if (res.status == 200) {
        const lastTimekeeping = await request.get<TimeSheetLogTodayData>(
          '1.0/user/timekeeping/today'
        )
        updateButton(lastTimekeeping.data)
        toast.success(res.data.message)
        setLoading(false)
      }
    } catch (error:any) {
      toast.success(error.error || error.message)
      setLoading(false)
    }
  }

  return (
    <Grid
      container
      spacing={2}
      sx={{
        flexDirection: { xs: 'column', sm: 'row', md: 'row' },
        '& > .MuiGrid-item': {
          maxWidth: { xs: '100%', sm: '100%', md: '100%' }
        },
        mb: 0
      }}
      height={'100%'}
      marginBottom={timekeepingLast ? 6 : 0}
    >
      <Grid item xs={12} sm={8} md={8} lg={6} maxHeight={'100%'}>
        <CardFirstStyle>
          <BoxCardHeaderStyle>
            <TitleCard color={PrimaryColors['500']}>
              <TextTitleIntroStyle>
                {t('dashboard.hello')},<TextUserStyle> {user?.user_name}</TextUserStyle>
              </TextTitleIntroStyle>
            </TitleCard>
            <Box pl={2}>
              <TextCurrentDateStyle>
                {currentTime.toLocaleString(language, {
                  weekday: 'long'
                })}{' '}
                {currentTime.toLocaleString(language, {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  timeZone: timezone as string
                })}
              </TextCurrentDateStyle>

              {timekeepingFirst ? (
                <Box display="flex" marginTop={1} alignItems={'center'} sx={{ ...styleWidthBox }}>
                  <TextCheckInOutStyle> {t('dashboard.checkin')}</TextCheckInOutStyle>
                  <TimeCheckInOutStyle sx={{ ...styleTimeCheckout }}>
                    {timekeepingFirst}
                  </TimeCheckInOutStyle>
                </Box>
              ) : null}

              {timekeepingLast ? (
                <Box display="flex" marginTop={1} alignItems={'center'}>
                  <TextCheckInOutStyle> {t('dashboard.checkout')}</TextCheckInOutStyle>
                  <TimeCheckInOutStyle sx={{ ...styleTimeCheckout }}>
                    {timekeepingLast}
                  </TimeCheckInOutStyle>
                </Box>
              ) : null}

              <Box
                component="form"
                sx={{ ...styleBoxOverView }}
                alignItems={'center'}
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                autoComplete="off"
              >
                <TextCheckInOutStyle>
                  {!timekeepingFirst
                    ? `${t('timekeeping_reminder.forget_check_in')}`
                    : timekeepingFirst && timekeepingLast
                    ? ''
                    : `${t('timekeeping_reminder.forget_check_in_out')}`}
                </TextCheckInOutStyle>
                <ButtonSubmitStyle
                  type="submit"
                  sx={{
                    ml: timekeepingFirst && timekeepingLast ? '20px' : '20px'
                  }}
                >
                  {!timekeepingFirst ? 'Check in' : 'Check out'}
                </ButtonSubmitStyle>
              </Box>
            </Box>
          </BoxCardHeaderStyle>

          <ImageLeft>
            <Box component="img" src={ImageOverView} alt="" sx={{ ...styleImgOverView }} />
          </ImageLeft>
        </CardFirstStyle>
      </Grid>

      <Grid item xs={12} sm={4} md={4} lg={6} maxHeight={'100%'}>
        <CardTowStyle>
          <BoxCardHeaderStyle display="flex" justifyContent="space-between">
            <Box>
              <TitleCard color={PrimaryColors['500']}>
                <TextTitleIntroStyle>{t('application_form.remaining_day_off')}</TextTitleIntroStyle>
              </TitleCard>
              <Box pl={2}>
                <TextRemainingStyle textAlign={'center'}>{remainingDayOff || 0}</TextRemainingStyle>
              </Box>
            </Box>
          </BoxCardHeaderStyle>
        </CardTowStyle>
      </Grid>
    </Grid>
  )
}

export default Overview

const CardFirstStyle = styled(Card)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'row',
  borderRadius: '12px',
  width: '100%',
  height: '100%',
  boxShadow: 'none',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column'
  }
}))

const BoxCardHeaderStyle = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5, 0, 2.5, 2.5),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2.5, 0, 2.5, 2)
  }
}))

const CardTowStyle = styled(Card)({
  borderRadius: '12px',
  width: '100%',
  height: '100%',
  boxShadow: 'none'
})

const TextTitleIntroStyle = styled(Typography)({
  fontWeight: 400,
  fontSize: 16,
  lineHeight: '22px',
  color: Greyscale['900']
})

const TextUserStyle = styled('span')({
  fontWeight: 700,
  fontSize: 18,
  color: Base.black
})

const TextCurrentDateStyle = styled(Typography)(({ theme }) => ({
  marginTop: '8px',
  color: Base.black,
  fontSize: 20,
  lineHeight: '28px',
  fontWeight: 600,
  [theme.breakpoints.down('sm')]: {
    fontSize: 16,
    lineHeight: '22px'
  }
}))

const TextCheckInOutStyle = styled(Typography)({
  color: Base.black,
  fontSize: 16,
  lineHeight: '22px',
  fontWeight: 400,
  width: 180
})

const TimeCheckInOutStyle = styled(Typography)({
  borderRadius: '8px',
  padding: '6px 8px',
  border: `1px solid ${Orange['400']}`,
  marginLeft: 25,
  color: Orange['400'],
  width: '88px',
  textAlign: 'center'
})

const ButtonSubmitStyle = styled(Button)({
  fontSize: 16,
  lineHeight: '22px',
  backgroundColor: Orange['000'],
  borderRadius: '8px',
  color: Orange['400'],
  padding: '6px 8px',
  width: '90px'
})

const TextRemainingStyle = styled(Typography)(({ theme }) => ({
  marginTop: '8px',
  color: Base.black,
  fontSize: 36,
  lineHeight: '40px',
  fontWeight: 700,
  [theme.breakpoints.down('md')]: {
    fontSize: 18,
    lineHeight: '28px'
  }
}))

const ImageLeft = styled('div')(({ theme }) => ({
  alignSelf: 'center',
  textAlign: 'center'
}))

const styleImgOverView = {
  width: '100%',
  maxWidth: { xs: '50%', sm: 200, xl: 300 }
  // marginX: 0.625
}

const styleBoxOverView = {
  display: { xs: 'flex', sm: 'flex' },
  mt: 2
}

const styleWidthBox = {
  width: 300
}

const styleTimeCheckout = {
  ml: '23px'
}
