// @ts-nocheck
import CloseIcon from '@mui/icons-material/Close'
import {
    AppBar,
    Box,
    CircularProgress,
    Dialog,
    DialogContent,
    Grid,
    IconButton,
    Toolbar,
    Typography
} from '@mui/material'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
import { DatePicker } from 'components/Form/Input/DatePicker'
import { Input } from 'components/Form/Input/Input'
import { TimePicker } from 'components/Form/Input/TimePicker'
import { useApiResource } from 'lib/hook/useApiResource'
import { formatNormalDateV2, getOnlyTimeFromDate } from 'lib/utils/format'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
type CompenSatoryWorkingDayDetailType = {
  idHoliday?: number
  openModal: boolean
  idEdit?: number | null
  onSuccess?: () => void
  closeModalDetail: () => void
}
type CompensatoryWorkingDayData = {
  id: number
  start_date: string | Date
  end_date: string | Date
  name: string
  type: number
  start_time: string | Date
  end_time: string | Date
  end_lunch_break: string | Date
  start_lunch_break: string | Date
}
const ModalCompenSatoryWorkingDay: React.FC<CompenSatoryWorkingDayDetailType> = ({
  openModal,
  closeModalDetail,
  onSuccess,
  idEdit
}) => {
  const { createOrUpdateApi } = useApiResource<CompensatoryWorkingDayData>(
    '/1.0/admin/compensatory-working-day'
  )
  const { t } = useTranslation()
  const [isSubmitting, setIsSubbmitting] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(idEdit ? true : false)
  const navigate = useNavigate()
  const isEdit = idEdit !== null && idEdit !== undefined
  const { control, setValue, watch, clearErrors, reset, setError, handleSubmit } =
    useForm<CompensatoryWorkingDayData>({
      defaultValues: {
        id: idEdit ? Number(idEdit) : undefined,
        type: 2,
        name: '',
        start_date: '',
        end_date: '',
        start_time: '',
        end_time: '',
        end_lunch_break: undefined,
        start_lunch_break: undefined
      }
    })
  useQuery<CompensatoryWorkingDayData>([`1.0/admin/compensatory-working-day/${idEdit}`], {
    onSuccess: (data) => {
      setValue('start_date', data.start_date)
      setValue('end_date', data.end_date)
      setValue('type', data.type)
      setValue('name', data.name)
      setValue('start_time', setTimeInit(data.start_time))
      setValue('end_time', setTimeInit(data.end_time))
      if (data.start_lunch_break) {
        setValue('start_lunch_break', setTimeInit(data.start_lunch_break))
      }
      if (data.end_lunch_break) {
        setValue('end_lunch_break', setTimeInit(data.end_lunch_break))
      }

      setIsLoading(false)
    },
    enabled: idEdit ? true : false
  })

  const setTimeInit = (value: any) => {
    return new Date('2020-01-01 ' + value)
  }

  useEffect(() => {
    clearErrors()
    reset()
  }, [openModal])

  const onSubmit: SubmitHandler<CompensatoryWorkingDayData> = async (value) => {
    let message
    if (isSubmitting) {
      return
    }
    setIsSubbmitting(true)
    const data = {
      id: idEdit ? Number(idEdit) : undefined,
      start_date: value.start_date ? formatNormalDateV2(value.start_date) : '',
      end_date: value.end_date ? formatNormalDateV2(value.end_date) : '',
      name: value.name,
      start_time: (value.start_time = getOnlyTimeFromDate(value.start_time)),
      end_time: (value.end_time = getOnlyTimeFromDate(value.end_time)),
      start_lunch_break: value.start_lunch_break && getOnlyTimeFromDate(value.start_lunch_break),
      end_lunch_break: value.end_lunch_break && getOnlyTimeFromDate(value.end_lunch_break),
      type: 2
    }
    try {
      const res = await createOrUpdateApi(data)
      if (res.status == 200) {
        message = res.data.message
        toast.success(message)
        setIsSubbmitting(false)
        onSuccess && onSuccess()
        closeModalDetail()
      }
    } catch (error:any) {
      toast.error(error.error)
      setIsSubbmitting(false)
      if (error.errors) {
        for (const [key, value] of Object.entries(error.errors)) {
          //@ts-ignore
          setError(key, { message: value })
        }
      }
    }
  }

  return (
    <Dialog
      open={openModal}
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
            {isEdit
              ? t('compensatory_working_day.edit_page')
              : t('compensatory_working_day.create_page')}
          </Typography>
          <IconButton edge="end" color="inherit" onClick={closeModalDetail} aria-label="close">
            <CloseIcon sx={{ ...styleIconClose }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ ...styleDialogSalary }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Input
                fullWidth
                label={t('compensatory_working_day.name')}
                name="name"
                placeholder={t('compensatory_working_day.name')}
                control={control}
                required
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <DatePicker
                label={t('compensatory_working_day.start_date')}
                name="start_date"
                control={control}
                fullWidth
                required
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <DatePicker
                fullWidth
                label={t('compensatory_working_day.end_date')}
                name="end_date"
                control={control}
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
            columnSpacing={2}
            style={{ marginTop: 20 }}
            xs={12}
          >
            <Grid item xs={4}>
              <ButtonCommon onClick={closeModalDetail} variant="outlined" error={true}>
                {t('cancel')}
              </ButtonCommon>
            </Grid>
            <Grid item xs={4}>
              <ButtonCommon
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress color="inherit" size="16px" /> : ''}
              >
                {isEdit ? t('update', { ns: 'translation' }) : t('add', { ns: 'translation' })}
              </ButtonCommon>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
const styleIconClose = {
  width: { xs: '20px', sm: '30px' }
}

export const stylePopUp = {
  '& .MuiDialog-container': {
    '& .MuiDialog-paper': {
      margin: '16px'
    }
  }
}

const styleDialogSalary = {
  '&.MuiDialogContent-root': {
    padding: '24px 16px',
    overflowX: 'hidden',
    overflowY: 'overlay'
  }
}

const styleTitleDialog = {
  fontSize: { xs: '14px', sm: '18px' }
}

export default ModalCompenSatoryWorkingDay
