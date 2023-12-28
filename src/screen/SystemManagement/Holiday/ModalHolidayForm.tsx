import CloseIcon from '@mui/icons-material/Close'
import {
    AppBar,
    CircularProgress,
    Dialog,
    DialogContent,
    Grid,
    IconButton,
    Toolbar,
    Typography
} from '@mui/material'
import { CalendarPickerView } from '@mui/x-date-pickers'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
import { DatePicker } from 'components/Form/Input/DatePicker'
import { Input } from 'components/Form/Input/Input'
import { ModalSkeleton } from 'components/Skeleton/ModalSkeleton'
import { useApiResource } from 'lib/hook/useApiResource'
import { HolidayType } from 'lib/types/applicationForm'
import { HOLIDAY_TYPE } from 'lib/utils/contants'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'
type HolidayDetailType = {
  idHoliday?: number
  openModal: boolean
  idEdit?: number | null
  views?: CalendarPickerView[]
  onSuccess?: () => void
  closeModalDetail: () => void
}
const ModalHolidayForm: React.FC<HolidayDetailType> = ({
  openModal,
  closeModalDetail,
  onSuccess,
  views,
  idEdit
}) => {
  const { createOrUpdateApi } = useApiResource<HolidayType>('/1.0/admin/holiday')
  const { t } = useTranslation()
  const [isSubmitting, setIsSubbmitting] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(idEdit ? true : false)
  const isEdit = idEdit !== null && idEdit !== undefined
  // @ts-ignore
  const { control, setValue, watch, clearErrors, reset, setError, handleSubmit } =
    useForm<HolidayType>({
      defaultValues: {
        id: idEdit ? idEdit : undefined,
        name: '',
        start_date: '',
        end_date: '',
        type: HOLIDAY_TYPE['SINGLE_USE']
      }
    })
  useQuery<HolidayType>([`1.0/admin/holiday/${idEdit}`], {
    onSuccess: (data) => {
      setValue('start_date', data.start_date)
      setValue('end_date', data.end_date)
      setValue('type', data.type)
      setValue('name', data.name)
      setIsLoading(false)
    },
    enabled: idEdit ? true : false
  })

  useEffect(() => {
    clearErrors()
    reset()
  }, [openModal])

  const onSubmit: SubmitHandler<HolidayType> = async (value) => {
    let message
    setIsSubbmitting(true)
    try {
      const res = await createOrUpdateApi(value)
      if (res.status == 200) {
        message = res.data.message
        toast.success(message)
        setIsSubbmitting(false)
        onSuccess && onSuccess()
      }
    } catch (error:any) {
      toast.error(error.error)
      setIsSubbmitting(false)
      if (error.errors) {
        for (const [key, value] of Object.entries(error.errors)) {
          setError(key as keyof HolidayType, { message: value as string })
        }
      }
    }
  }
  return (
    <Dialog open={openModal} sx={{ ...stylePopUp }}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>{isEdit ? t('holiday.edit_page') : t('holiday.create_page')}</Typography>
          <IconButton edge="end" color="inherit" onClick={closeModalDetail} aria-label="close">
            <CloseIcon sx={{ ...styleIconClose }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        {isLoading && idEdit ? (
          <ModalSkeleton />
        ) : (
          <Grid
            container
            rowSpacing={3}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            autoComplete="off"
          >
            <Grid item container xs={12} columnSpacing={2}>
              <Grid item xs={12} sm={6}>
                <Input
                  label={t('holiday.name')}
                  name="name"
                  placeholder={t('holiday.name')}
                  control={control}
                  fullWidth
                  required
                  sx={{ ...styleHeightInput }}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} container columnSpacing={2} rowSpacing={3}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label={t('holiday.start_date')}
                  name="start_date"
                  views={views}
                  control={control}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label={t('holiday.end_date')}
                  name="end_date"
                  control={control}
                  fullWidth
                  views={views}
                  required
                />
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              container
              columnSpacing={2}
              sx={{ alignContent: 'center', justifyContent: 'center' }}
            >
              <Grid item xs={4}>
                <ButtonCommon onClick={closeModalDetail} variant="outlined" error={true}>
                  {t('cancel')}
                </ButtonCommon>
              </Grid>
              <Grid item xs={4}>
                <ButtonCommon
                  disabled={isSubmitting}
                  startIcon={isSubmitting && <CircularProgress color="inherit" size={12} />}
                  type="submit"
                  variant="contained"
                >
                  {idEdit ? t('update') : t('add')}
                </ButtonCommon>
              </Grid>
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  )
}
const styleIconClose = {
  width: { xs: '20px', sm: '30px' }
}

export const styleHeightInput = {
  height: { xs: 38, sm: 40 }
}

const stylePopUp = {
  '& .MuiDialog-container': {
    '& .MuiDialog-paper': {
      margin: '16px',
      position: 'absolute',
      top: { md: '16%', xl: 'unset' }
    }
  }
}
export default ModalHolidayForm
