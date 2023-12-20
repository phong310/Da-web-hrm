// @ts-nocheck
import { Box, Button, Dialog, Stack, Typography, styled } from '@mui/material'
import TimeKeepingReminder from 'assets/images/timkeepingreminder.png'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { useQuery } from 'react-query'
import { Greyscale, PrimaryColors } from 'styles/colors'
import { useAuth } from 'lib/hook/useAuth'
import { systemSettingAtom } from 'lib/atom/authAtom'
import { SystemSetting } from 'lib/types/system_setting'
import { timekeepingReminderFirstInDateAtom } from 'lib/atom/timekeepingAtom'
import { convertDatetimeTZ, formatTime, minutesToDays } from 'lib/utils/format'
import TitleCard from 'components/ReactTable/Components/TitleCard'
import { V1 } from 'constants/apiVersion'
import { ModalRequestChangeTimeSheet } from 'screen/RequestChangeTimesheet/ModalRequestChangeTimeSheet'

const DialogCustom = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(1),
    padding: theme.spacing(3),
    backgroundColor: Greyscale['000'],
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
      width: '100%'
    }
  },
  wordWrap: 'break-word',
  overflowWrap: 'break-word',
  overflowY: 'auto',
  maxHeight: 'calc(100vh - 64px)'
}))

export const ModalTimekeepingReminder = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user, timekeeping } = useAuth()
  const language = localStorage.getItem('language') || 'en'
  const timezone = user?.company.setting.time_zone as string
  const systemSetting: SystemSetting | null = useAtomValue(systemSettingAtom)
  const [timekeepingReminderFirstInDate, setTimekeepingReminderFirstInDate] = useAtom(
    timekeepingReminderFirstInDateAtom
  )
  const [openEdit, setOpenEdit] = useState(false)
  const [idEdit, setIdEdit] = useState<number | null>()
  const [minutesRemains, setMinutesRemains] = useState<number>(0)
  const [minutesUsed, setMinutesUsed] = useState<number>(0)
  const [minutesTotal, setMinutesTotal] = useState<number>(0)
  const [dateRemind, setDateRemind] = useState<string | null>()
  const [openDialog, setOpenDialog] = useState<boolean>(
    (timekeeping?.forget_timekeeping && timekeepingReminderFirstInDate.is_first) || false
  )

  useQuery<{ annual_leave: number; leave_form: number }>(
    [`${V1}/user/day-off/remaining-days-off?employee_id=${user?.employee_id}`],
    {
      onSuccess: (data) => {
        setMinutesTotal(data.annual_leave)
        setMinutesUsed(data.leave_form)
        setMinutesRemains(data.annual_leave - data.leave_form)
      }
    }
  )

  const createContentModal = () => {
    if (timekeeping && timekeeping?.forget_timekeeping) {
      switch (true) {
        case !timekeeping.first && !timekeeping.last:
          return (
            <Typography variant="body1">{t('timekeeping_reminder.forget_check_in_out')}</Typography>
          )
        case !timekeeping.last:
          return (
            <>
              <Typography variant="body1" sx={{ width: 300 }}>
                {t('timesheet.today_checked_in')}{' '}
                <Box component={'span'} color={PrimaryColors[600]}>
                  {formatTime(
                    convertDatetimeTZ(timekeeping.first.toString(), systemSetting?.time_zone)
                  )}
                </Box>
              </Typography>
              <Typography variant="body1" mt={1}>
                {t('timekeeping_reminder.forget_check_out')}
              </Typography>
            </>
          )
      }
    }
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setTimekeepingReminderFirstInDate({ ...timekeepingReminderFirstInDate, is_first: false })
  }

  const hanleOnSubmitDialog = () => {
    setDateRemind(timekeeping?.date as string)
    setOpenDialog(false)
    setOpenEdit(true)
    setIdEdit(null)
    setTimekeepingReminderFirstInDate({ ...timekeepingReminderFirstInDate, is_first: false })
  }

  const onSuccess = () => {
    setOpenEdit(false)
    navigate('/applications/request-change-timesheets')
  }
  const handleClose = () => {
    setOpenEdit(false)
  }

  useEffect(() => {
    if (timekeeping) {
      setOpenDialog(timekeeping.forget_timekeeping && timekeepingReminderFirstInDate.is_first)
    }
  }, [timekeeping, timekeepingReminderFirstInDate])

  return (
    <>
      <DialogCustom open={openDialog} onClose={handleCloseDialog}>
        <Box sx={{ ...styleBoxContainer }}>
          <Box sx={{ ...styleBoxTitle }}>
            <TitleCard color={PrimaryColors[500]}>
              <Typography variant="body1">
                {t('timekeeping_reminder.welcome')}
                {', '}
                {user?.employee?.personal_information.full_name}
              </Typography>
            </TitleCard>
            <Box sx={{ ...styleBoxInner }}>
              <Typography sx={{ ...styleTitleDate }} variant="h6">
                {new Date(timekeeping?.date as string).toLocaleString(language, {
                  weekday: 'long',
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  timeZone: timezone as string
                })}
              </Typography>
              <Box mt={2}>{createContentModal()}</Box>
              {timekeeping?.forget_timekeeping ? (
                <Box mt={2}>
                  <Button
                    sx={{ ...styleButtonReminer }}
                    onClick={() => hanleOnSubmitDialog()}
                    variant="contained"
                  >
                    {t('request_change_timesheet')}
                  </Button>
                </Box>
              ) : (
                ''
              )}
            </Box>
          </Box>
          <Box component={'img'} src={TimeKeepingReminder} sx={{ ...styleBoxImg }} />
        </Box>
        <Box sx={{ ...styleBoxContainer2 }}>
          <Box>
            <TitleCard color={PrimaryColors[500]}>
              <Typography variant="body1">{t('application_form.remaining_day_off')}</Typography>
            </TitleCard>
            <Box px={{ ...styleBoxInner2 }}>
              <Typography fontWeight={700} variant="h5" sx={{ ...styleTextCenter }}>
                {minutesToDays(minutesRemains, true) || 0}
              </Typography>
            </Box>
          </Box>
          <Box bgcolor={Greyscale[500]} sx={{ ...styleLastBox }} />

          <Box>
            <TitleCard color={PrimaryColors[500]}>
              <Typography variant="body1">{t('application_form.used_day_off')}</Typography>
            </TitleCard>
            <Box px={{ ...styleBoxInner2 }}>
              <Typography variant="h5" fontWeight={600} sx={{ ...styleTextCenter }}>
                {minutesToDays(minutesUsed, true) || 0}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogCustom>
      <ModalRequestChangeTimeSheet
        open={openEdit}
        idEdit={idEdit}
        handleCloseModal={handleClose}
        onSuccessEdit={onSuccess}
        dateParams={dateRemind}
      />
    </>
  )
}

const styleBoxContainer = {
  bgcolor: '#ffffff',
  boderRadius: 3,
  display: 'flex',
  justifyContent: 'space-between',
  gap: 6,
  flexDirection: { xs: 'column', sm: 'row' }
}

const styleButtonReminer = {
  height: '40px',
  fontWeight: '600',
  fontSize: '16px'
}

const styleBoxContainer2 = {
  marginTop: 2,
  bgcolor: '#ffffff',
  boderRadius: 3,
  display: 'flex',
  justifyContent: 'space-between',
  gap: 3,
  flexDirection: { xs: 'column', sm: 'row' },
  padding: { xs: 1.25, sm: 2.5 }
}

const styleBoxTitle = {
  padding: { xs: 1.25, sm: 1 }
}

const styleBoxInner = {
  paddingLeft: { xs: 1.5, sm: 3 },
  width: { xs: 250, sm: 300 }
}

const styleBoxInner2 = {
  xs: 1,
  sm: 3,
  width: 230
}

const styleTitleDate = {
  fontWeight: 600,
  marginTop: 1
}

const styleBoxImg = {
  objectFit: 'contain',
  margin: '0 auto',
  width: { xs: '0%', sm: '40%' },
  height: 'auto'
}

const styleTextCenter = {
  textAlign: { xs: 'center', sm: 'left' },
  fontSize: { xs: '15px', sm: '18px' }
}

const styleLastBox = {
  height: { xs: '0px', sm: '44px' },
  width: { xs: '1px', sm: '1px' },
  display: 'inline-block',
  visibility: {
    xs: 'hidden',
    sm: 'visible'
  }
}
