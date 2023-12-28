import { yupResolver } from '@hookform/resolvers/yup'
import { Box, CircularProgress, Grid, Modal, Typography } from '@mui/material'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
import { DatePicker } from 'components/Form/Input/DatePicker'
import { Input } from 'components/Form/Input/Input'
import { V1 } from 'constants/apiVersion'
import { useApiResource } from 'lib/hook/useApiResource'
// import { DatePicker, Input } from 'components/Form'
// import { ButtonCommon } from 'components/Form/components/ButtonCommon'
// import { V1 } from 'constants'
// import { useApiResource } from 'lib/hooks'
import i18n from 'lib/lang/translations/i18n'
import { Education } from 'lib/types/education'
import { Employee } from 'lib/types/employee'
// import { Education } from 'lib/types'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'
import { blueV2 } from 'styles/colors'
// import { blueV2 } from 'styles/v2'
import * as yup from 'yup'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: '90%',
    sm: '40%'
  },
  minWidth: { sm: '400px' },
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '16px',
  overflow: 'hidden'
}

const titleCancleStyle = {
  paddingLeft: 4,
  paddingRight: 4,
  paddingTop: 2,
  paddingBottom: 2,
  fontSize: 18,
  color: '#fff',
  lineHeight: '26px'
}

export function ModalAddEducation({
  open,
  handleClose,
  forceReRender,
  title,
  id,
  reload
}: any) {
  const { t } = useTranslation()

  // validate
  const validateEducation = yup.object({
    school_name: yup
      .string()
      .trim()
      .required(i18n.t('validate.school_name'))
      .max(50, i18n.t('validate.school_name_characters')),
    description: yup.string().trim().required(i18n.t('validate.description')),
    from_date: yup.string().trim().required(i18n.t('validate.from_date')),
    to_date: yup
      .string()
      .trim()
      .required(i18n.t('validate.to_date'))
      .test(
        'is-greater-than-from-date',
        i18n.t('validate.to_date_validate'),
        function (value: any) {
          const from_date = this.parent && this.parent.from_date
          return new Date(value) > new Date(from_date)
        }
      )
  })

  const { createOrUpdateApi } = useApiResource<Education>(`${V1}/user/education/employee`)
  useQuery<Employee>([`${V1}/user/employee/${id}`], {
    onSuccess: (data) => {
      setValue('personal_information_id', data.personal_information_id)
    },
    enabled: true
  })
  // @ts-ignore
  const { control, handleSubmit, setValue, setError, watch, clearErrors, reset } =
    useForm<Education>({
      mode: 'all',
      defaultValues: {
        school_name: '',
        from_date: '',
        to_date: '',
        description: '',
        personal_information_id: 0
      },
      //@ts-ignore
      resolver: yupResolver(validateEducation)
    })

  const [isSubmit, setIsSubmit] = useState<boolean>(false)

  const handleAddNewEducation: SubmitHandler<Education> = async (value) => {
    try {
      setIsSubmit(true)
      const res = await createOrUpdateApi(value)
      if (res.status == 200) {
        const message = res.data.message
        toast.success(message)
        forceReRender(2)
        handleClose()
        reload()
        setIsSubmit(false)
      }
    } catch (error: any) {
      toast.error(error.error)
      if (error.errors) {
        Object.entries(error.errors).forEach(([key, value]: any) => {
          setError(key, { message: t(value) })
        })
      }
    }
  }

  const handleBackdropClick = (e: any) => {
    e.stopPropagation()
  }

  useEffect(() => {
    clearErrors()
    setValue('school_name', '')
    setValue('from_date', '')
    setValue('to_date', '')
    setValue('description', '')
  }, [open])

  const grid = { md: 6, xs: 12 }
  const gridOnLine = { md: 12, xs: 12 }
  const styleButton = {
    mt: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    px: { xs: 0, md: 10, lg: 12, xl: 25 }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      BackdropProps={{
        //@ts-ignore
        onClick: (event: React.MouseEvent<HTMLDivElement>, reason: string) => {
          if (reason === 'backdropClick') {
            handleBackdropClick(event)
          }
        }
      }}
    >
      <Box sx={style}>
        <Box sx={{ backgroundColor: blueV2[200] }}>
          <Typography
            id="modal-modal-title"
            variant="h5"
            component="h2"
            sx={{
              ...titleCancleStyle
            }}
          >
            {title}
          </Typography>
        </Box>
        <Box sx={{ p: 4 }}>
          <Typography
            sx={{ fontSize: '16px' }}
            variant="h6"
            component="h2"
            id="modal-modal-description"
          >
            <Grid container item {...gridOnLine} spacing={2}>
              <Grid item {...gridOnLine}>
                <Input
                  id="name"
                  placeholder={t('education.school_name')}
                  label={t('education.school_name')}
                  name="school_name"
                  fullWidth
                  type="text"
                  control={control}
                  required
                />
              </Grid>

              <Grid item {...grid}>
                <DatePicker
                  fullWidth
                  label={t('from')}
                  control={control}
                  required
                  name="from_date"
                />
              </Grid>
              <Grid item {...grid}>
                <DatePicker fullWidth label={t('to')} control={control} required name="to_date" />
              </Grid>
              <Grid item {...gridOnLine}>
                <Input
                  id="description"
                  label={t('description')}
                  placeholder={t('description')}
                  fullWidth
                  name="description"
                  control={control}
                  required
                  // sx={{ height: 80 }}
                />
              </Grid>
            </Grid>
          </Typography>
          <Grid container spacing={3} sx={{ ...styleButton }}>
            <Grid item xs={6} alignItems="center">
              <ButtonCommon variant="outlined" error={true} onClick={handleClose}>
                {t('cancel')}
              </ButtonCommon>
            </Grid>
            <Grid item xs={6} alignItems="center">
              <ButtonCommon
                variant="contained"
                type="submit"
                onClick={handleSubmit(handleAddNewEducation)}
                startIcon={isSubmit ? <CircularProgress color="inherit" size="16px" /> : ''}
              >
                {t('submit')}
              </ButtonCommon>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  )
}
