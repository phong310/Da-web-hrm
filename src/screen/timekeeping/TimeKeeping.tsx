
import { Box, Button, Typography, styled } from '@mui/material'
import { useAtomValue } from 'jotai'
import { request } from 'lib/request'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'
import TimeCheckingDark from 'assets/images/timechecking-dark.png'
import TimeCheckingLight from 'assets/images/timechecking-light.png'
import { Pagev2 } from 'components/Layouts/Page/Pagev2'
import TitleCard from 'components/ReactTable/Components/TitleCard'
import { systemSettingAtom } from 'lib/atom/authAtom'
import { useApiResource } from 'lib/hook/useApiResource'
import { useAuth } from 'lib/hook/useAuth'
import { useCurrentTime } from 'lib/hook/useCurrentTime'
import { SystemSetting } from 'lib/types/system_setting'
import { TimeSheetLogData, TimeSheetLogTodayData } from 'lib/types/timeSheet'
import { convertDatetimeTZ, formatDateTime, formatNormalTime, formatTime } from 'lib/utils/format'
import { primary } from 'styles/colors'
  // @ts-ignore
const TextTime = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: 18,
  lineHeight: '26px',
  '& >span': {
    fontWeight: 600
  }
}))

const TimeKeeping = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [currentTime] = useCurrentTime()
  const language = localStorage.getItem('language') || 'en'
  const timezone = user?.company.setting.time_zone as string
  const { createOrUpdateApi } = useApiResource<TimeSheetLogData>('1.0/user/timekeeping')
  const systemSetting: SystemSetting | null = useAtomValue(systemSettingAtom)
  const [timeCheckingImg, setTimeChekingImg] = useState<string>('')
  const [timekeepingFirst, setTimekeepingFirst] = useState<string>('')
  const [timekeepingLast, setTimekeepingLast] = useState<string>('')
  // @ts-ignore
  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState<boolean>(false)

  const { handleSubmit } = useForm<TimeSheetLogData>({
    defaultValues: {
      date_time: formatDateTime(new Date()),
      note: '',
      type: NaN
    }
  })

  const [loading, setLoading] = useState(true)

  const welcomeBrand = (name: string | any) => {
    let brand = ''
    const datetime = new Date()
    const hours = datetime.getHours()

    if (hours < 12) brand = t('timesheet.good_morning')
    else if (hours < 18) brand = t('timesheet.good_afternoon')
    else brand = t('timesheet.good_evening')
    return (
      <Typography fontSize={18} fontWeight={400} lineHeight={'26px'}>
        {brand}
        {', '}
        {name && <strong>{name}</strong>}
      </Typography>
    )
  }

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

  useQuery<TimeSheetLogTodayData>([`1.0/user/timekeeping/today`], {
    onSuccess: (data) => {
      updateButton(data)
      setLoading(false)
    },
    onError: () => {
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

  useEffect(() => {
    if (user?.is_first_time_login == 0) {
      setIsFirstTimeLogin(true)
      toast.warn(t('setting.change_password_first_time_warning'))
    }
  }, [user?.is_first_time_login, t])

  useEffect(() => {
    if (timekeepingFirst) {
      setTimeChekingImg(TimeCheckingDark)
    } else {
      setTimeChekingImg(TimeCheckingLight)
    }
  }, [timekeepingFirst])

  return (
    <Pagev2 title={t('timesheet.time_keeping')}>
      <Box
        bgcolor={'#FFFFFF'}
        display={'flex'}
        justifyContent={'space-between'}
        borderRadius={3}
        flexDirection={{ xs: 'column', md: 'row' }}
        height={{ xs: 'auto', md: '518px' }}
      >
        <Box p={{ xs: 1, md: 2.5 }}>
          <TitleCard color={primary[500]}>{user && <>{welcomeBrand(user?.user_name)}</>}</TitleCard>
          <Box pl={{ xs: 0, md: 2.625 }}>
            <Typography fontWeight={600} variant="h1" color={primary[600]} mt={3}>
              {formatNormalTime(convertDatetimeTZ(currentTime, systemSetting?.time_zone))}
            </Typography>
            <Typography variant="h4" fontWeight={500} mt={3}>
              {currentTime.toLocaleString(language, {
                weekday: 'long'
              })}{' '}
              {currentTime.toLocaleString(language, {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                timeZone: timezone as string
              })}
            </Typography>
            {!timekeepingFirst && <TextTime mt={5}>{t('timesheet.today_check_in_yet')}</TextTime>}
            {timekeepingFirst && (
              <TextTime mt={5}>
                {t('timesheet.today_checked_in')} <span>{timekeepingFirst}</span>
                {!timekeepingLast && ', ' + t('timesheet.plz_check_out')}
              </TextTime>
            )}
            {timekeepingLast && (
              <TextTime>
                {t('timesheet.today_checked_out')} <span>{timekeepingLast}</span>
              </TextTime>
            )}
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              autoComplete="off"
              mt={2}
              width={{ xs: '100%', md: 'fit-content' }}
            >
              <Button
                fullWidth
                type="submit"
                size={'large'}
                variant="contained"
                disabled={loading}
                sx={{ py: 1.25, px: 4.1875, height: '40px' }}
              >
                <Typography fontWeight={600} variant="body1">
                  {!timekeepingFirst
                    ? `${t('timesheet-log.check_in')}`
                    : `${t('timesheet-log.check_out')}`}
                </Typography>
              </Button>
            </Box>
          </Box>
        </Box>
        <Box
          mt={{ xs: 2, md: 0 }}
          src={timeCheckingImg}
          width={{ xs: '100%', md: '45%' }}
          height={'auto'}
          component={'img'}
          alt="timechecking-img"
          borderRadius={{ xs: 0, md: 3 }}
          sx={{
            objectFit: 'cover',
            borderTopLeftRadius: '0 !important',
            borderBottomLeftRadius: '0 !important'
          }}
        />
      </Box>

      {/* <ResetPassword isFirstTimeLogin={isFirstTimeLogin} /> */}
    </Pagev2>
  )
}

export { TimeKeeping }

