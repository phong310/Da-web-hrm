import CloseIcon from '@mui/icons-material/Close'
import {
    AppBar,
    Box,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogProps,
    Grid,
    IconButton,
    Toolbar,
    Typography
} from '@mui/material'
import { Select } from 'components/Form/Autocomplete/Select'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
import { Input } from 'components/Form/Input/Input'
import { TimePicker } from 'components/Form/Input/TimePicker'
// import { Input, Select, TimePicker } from 'components/Form'
// import { ButtonCommon } from 'components/Form/components/ButtonCommon'
import { ModalSkeleton } from 'components/Skeleton/ModalSkeleton'
import { useApiResource } from 'lib/hook/useApiResource'
import { getOnlyTimeFromDate } from 'lib/utils/format'
import { getTotalWorkingDays } from 'lib/utils/number_leave_day'
// import { useApiResource } from 'lib/hooks'
// import {
//     getOnlyTimeFromDate,
//     getTotalWorkingDays
// } from 'lib/utils'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'
type PropType = DialogProps & {
  open?: boolean
  closeModalDetail: () => void
  checkAddSuccess: () => void
  idEdit?: number | null
}

type DaysInWeekResponse = {
  data: DaysInWeekData[]
}

type DayInWeekLabel = {
  value: number | string
  label: string
}

export type WorkingDayData = {
  id: number
  name: string
  type: number
  start_time: string | Date
  end_time: string | Date
  end_lunch_break: string | Date
  start_lunch_break: string | Date
  day_in_week_id: number | string
  day_in_week_name?: string
  total_working_time: number
}

export type DaysInWeekData = {
  id: number
  name: string
  symbol: string
}

const ModalFormWorkingDay: React.FC<PropType> = ({
  open,
  closeModalDetail,
  checkAddSuccess,
  idEdit
}) => {
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()
  const isEdit = idEdit !== undefined && idEdit !== null
  const [dayInWeekLabels, setDayInWeekLabels] = useState<DayInWeekLabel[]>([])

  const [isLoading, setIsLoading] = React.useState(false)

  const { createOrUpdateApi } = useApiResource<WorkingDayData>('/1.0/admin/working-day')
  const { control, handleSubmit, watch, setValue, reset, setError } = useForm<WorkingDayData>({
    defaultValues: {
      id: idEdit ? Number(idEdit) : undefined,
      type: 1,
      name: '',
      start_time: '',
      end_time: '',
      end_lunch_break: undefined,
      start_lunch_break: undefined,
      day_in_week_id: '',
      total_working_time: undefined
    }
  })

  useQuery<DaysInWeekResponse>([`1.0/admin/days-in-week`], {
    onSuccess: (data) => {
      setDayInWeekLabels(() => {
        return data.data.map((diw: DaysInWeekData) => {
          return {
            value: diw.id,
            label: diw.name
          }
        })
      })
    }
  })

  useQuery<WorkingDayData>([`1.0/admin/working-day/${idEdit}`], {
    onSuccess: (data) => {
      setValue('id', data.id)
      setValue('name', data.name)
      setValue('type', data.type)
      setValue('start_time', setTimeInit(data.start_time))
      setValue('end_time', setTimeInit(data.end_time))
      setLoading(false)

      if (data.start_lunch_break) {
        setValue('start_lunch_break', setTimeInit(data.start_lunch_break))
      }
      if (data.end_lunch_break) {
        setValue('end_lunch_break', setTimeInit(data.end_lunch_break))
      }

      setValue('day_in_week_id', data.day_in_week_id)
    },
    enabled: idEdit ? true : false
  })

  const setTimeInit = (value: any) => {
    return new Date('2020-01-01 ' + value)
  }
  useEffect(() => {
    reset()
  }, [isEdit, open])
  const onSubmit: SubmitHandler<WorkingDayData> = async (value) => {
    let message
    if (isLoading) {
      return
    }
    setIsLoading(true)
    try {
      value.start_time = getOnlyTimeFromDate(value.start_time)
      value.end_time = getOnlyTimeFromDate(value.end_time)
      if (value.start_lunch_break) {
        value.start_lunch_break = getOnlyTimeFromDate(value.start_lunch_break)
      }
      if (value.end_lunch_break) {
        value.end_lunch_break = getOnlyTimeFromDate(value.end_lunch_break)
      }
      const res = await createOrUpdateApi(value)
      if (res.status == 200) {
        message = res.data.message
        toast.success(message)
        setIsLoading(false)
        checkAddSuccess && checkAddSuccess()
        closeModalDetail()
      }
    } catch (error:any) {
      toast.error(error.error)
      setIsLoading(false)
      if (error.errors) {
        for (const [key, value] of Object.entries(error.errors)) {
          //@ts-ignore
          setError(key, { message: value })
        }
      }
    }
  }
  useEffect(() => {
    const start = new Date(watch('start_time'))
    const end = new Date(watch('end_time'))
    let start_lunch_break
    let end_lunch_break
    if (watch('start_lunch_break') && watch('end_lunch_break')) {
      start_lunch_break = new Date(watch('start_lunch_break'))
      end_lunch_break = new Date(watch('end_lunch_break'))
    }

    if (start && end) {
      const num = getTotalWorkingDays(start, end, start_lunch_break, end_lunch_break)
      setValue('total_working_time', num)
    }
  }, [watch('start_time'), watch('end_time'), watch('start_lunch_break'), watch('end_lunch_break')])
  return (
    <Dialog
      open={open}
      sx={{
        ...stylePopUp,
        '& .MuiDialog-container': {
          '& .MuiDialog-paper': {
            maxWidth: '680px'
          }
        }
      }}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ flex: 1, ...styleTitleDialog }} variant="h6" component="div">
            {isEdit ? t('working_day.edit_page') : t('working_day.create_page')}
          </Typography>
          <IconButton edge="end" color="inherit" onClick={closeModalDetail} aria-label="close">
            <CloseIcon sx={{ ...styleIconClose }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ ...styleDialogSalary }}>
        {loading && isEdit ? (
          <ModalSkeleton />
        ) : (
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
            <Grid container spacing={2}>
              <Grid item md={6} xs={12}>
                <Input
                  fullWidth
                  label={t('working_day.name')}
                  name="name"
                  placeholder={t('working_day.name')}
                  control={control}
                  required
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Select
                  label={t('working_day.day_in_week_id')}
                  name="day_in_week_id"
                  options={dayInWeekLabels}
                  control={control}
                  placeholder={t('working_day.day_in_week_id')}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TimePicker
                  fullWidth
                  label={t('working_day.start_time')}
                  name="start_time"
                  control={control}
                  required
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TimePicker
                  fullWidth
                  label={t('working_day.end_time')}
                  name="end_time"
                  control={control}
                  required
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TimePicker
                  fullWidth
                  label={t('working_day.start_lunch_break')}
                  name="start_lunch_break"
                  control={control}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TimePicker
                  fullWidth
                  label={t('working_day.end_lunch_break')}
                  name="end_lunch_break"
                  control={control}
                />
              </Grid>
            </Grid>

            <Grid
              container
              rowSpacing={2}
              justifyContent="center"
              style={{ marginTop: 20 }}
              xs={12}
              columnSpacing={2}
            >
              <Grid item xs={6} sm={4}>
                <ButtonCommon onClick={closeModalDetail} variant="outlined" error={true}>
                  {t('cancel')}
                </ButtonCommon>
              </Grid>
              <Grid item xs={6} sm={4}>
                <ButtonCommon
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress color="inherit" size="16px" /> : ''}
                >
                  {isEdit ? t('update', { ns: 'translation' }) : t('add', { ns: 'translation' })}
                </ButtonCommon>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

export const stylePopUp = {
  '& .MuiDialog-container': {
    '& .MuiDialog-paper': {
      margin: '16px'
    }
  }
}

export const styleDialogSalary = {
  '&.MuiDialogContent-root': {
    padding: '24px 16px',
    overflowX: 'hidden',
    overflowY: 'overlay'
  }
}

export const styleTitleDialog = {
  fontSize: { xs: '14px', sm: '18px' }
}

export const styleIconClose = {
  width: { xs: '20px', sm: '30px' }
}

export default ModalFormWorkingDay
