// @ts-nocheck
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, CircularProgress, Grid, Typography } from '@mui/material'
import { Input } from 'components/Form/Input/Input'
import { V1 } from 'constants/apiVersion'
import i18n from 'lib/lang/translations/i18n'
import { request } from 'lib/request'
import { UserForgetPasswordArgs } from 'lib/types/auth'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { FormPassword } from './components/FormPassword'
// import { FormPassword } from './components'
const validateSchema = yup
  .object({
    email: yup.string().email(i18n.t('validate.email_invalid')).required(i18n.t('validate.email'))
  })
  .required()

export const ForgetPassword = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { control, handleSubmit } = useForm<UserForgetPasswordArgs>({
    defaultValues: {
      email: ''
    },
    resolver: yupResolver(validateSchema)
  })

  const [isSubmit, setIsSubmit] = useState<boolean>(false)
  const onSubmit: SubmitHandler<UserForgetPasswordArgs> = async (value) => {
    setIsSubmit(true)
    if (isSubmit) return
    try {
      const data = value
      const res = await request.post(`${V1}/user/forget-password`, data)
      if (res.status === 200) {
        toast.success(res.data.message)
        navigate('/')
      }
    } catch (error:any) {
      toast.error(error.message)
      setIsSubmit(false)
    }
    setIsSubmit(false)
  }

  return (
    <FormPassword title={t('forget_password')}>
      <Typography color="grey.900" mb={1}>
        {t('enter_your_email')}
      </Typography>
      <Input control={control} placeholder={t('email_address')} name="email" fullWidth />
      <Grid container spacing={1} mt="24px" justifyContent="flex-end">
        <Grid item xs={4}>
          <Button variant="outlined" fullWidth onClick={() => navigate(-1)}>
            {t('cancel')}
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit(onSubmit)}
            startIcon={isSubmit ? <CircularProgress color="inherit" size="16px" /> : ''}
          >
            {t('continue')}
          </Button>
        </Grid>
      </Grid>
    </FormPassword>
  )
}
