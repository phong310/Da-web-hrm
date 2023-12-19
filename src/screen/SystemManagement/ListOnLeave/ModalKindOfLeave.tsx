import {
  AppBar,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogProps,
  Grid,
  IconButton,
  Toolbar,
  Typography
} from '@mui/material'
import Box from '@mui/material/Box'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import CloseIcon from '@mui/icons-material/Close'
import { ModalSkeleton } from 'components/Skeleton/ModalSkeleton'
import { toast } from 'react-toastify'
import { useQuery } from 'react-query'
import { useApiResource } from 'lib/hook/useApiResource'
import { KolData } from 'lib/types/applicationForm'
import { KIND_OF_LEAVE_OPTIONS, KIND_OF_LEAVE_TYPES } from 'lib/utils/contants'
import { Input } from 'components/Form/Input/Input'
import { Select } from 'components/Form/Autocomplete/Select'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
type PropType = DialogProps & {
  open?: boolean
  closeModalDetail: () => void
  checkAddSuccess: () => void
  idEdit?: number | null
}
const ModalKindOfLeave: React.FC<PropType> = ({
  open,
  closeModalDetail,
  checkAddSuccess,
  idEdit
}) => {
  const { t } = useTranslation()
  const isEdit = idEdit !== undefined && idEdit !== null
  const { createOrUpdateApi } = useApiResource<KolData>('/1.0/admin/kind-of-leave')
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { control, handleSubmit, reset, setValue, setError } = useForm<KolData>({
    defaultValues: {
      id: idEdit ? Number(idEdit) : undefined,
      name: '',
      symbol: '',
      type: KIND_OF_LEAVE_TYPES['NORMAL_LEAVE']
    }
  })

  useQuery<KolData>([`1.0/admin/kind-of-leave/${idEdit}`], {
    onSuccess: (data) => {
      setValue('name', data.name)
      setValue('symbol', data.symbol)
      setValue('type', data.type)
      setLoading(false)
    },
    enabled: idEdit ? true : false
  })

  const onSubmit: SubmitHandler<KolData> = async (value) => {
    let message
    setIsSubmitting(true)
    try {
      const res = await createOrUpdateApi(value)
      if (res.status == 200) {
        message = res.data.message
        toast.success(message)
        setIsSubmitting(false)
        checkAddSuccess && checkAddSuccess()
        closeModalDetail()
      }
    } catch (error:any) {
      message = error.error
      toast.error(message)
      setIsSubmitting(false)
      if (error.errors) {
        for (const [key, value] of Object.entries(error.errors)) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          setError(key, { message: value })
        }
      }
    }
  }

  useEffect(() => {
    reset()
  }, [isEdit, open])
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
            {isEdit ? t('kind-of-leave.update') : t('kind-of-leave.store')}
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
              <Grid item md={4} xs={12}>
                <Input
                  fullWidth
                  label={t('kind-of-leave.name')}
                  placeholder={t('kind-of-leave.name')}
                  name="name"
                  control={control}
                  required
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <Input
                  fullWidth
                  label={t('kind-of-leave.symbol')}
                  placeholder={t('kind-of-leave.symbol')}
                  name="symbol"
                  control={control}
                  required
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <Select
                  label={t('kind-of-leave.type')}
                  name="type"
                  type="text"
                  control={control}
                  fullWidth
                  options={KIND_OF_LEAVE_OPTIONS}
                  required
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
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress color="inherit" size="16px" /> : ''}
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
const styleDialogSalary = {
  '&.MuiDialogContent-root': {
    padding: '24px 16px',
    overflowX: 'hidden',
    overflowY: 'overlay'
  }
}
const styleIconClose = {
  width: { xs: '20px', sm: '30px' }
}
const styleTitleDialog = {
  fontSize: { xs: '14px', sm: '18px' }
}
export default ModalKindOfLeave
