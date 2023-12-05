import { yupResolver } from '@hookform/resolvers/yup'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { Box, Button, Grid, IconButton, InputAdornment, Stack } from '@mui/material'
import { Input } from 'components/Form/Input/Input'
import { request } from 'lib/request'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import * as yup from 'yup'

type UpdatePasswordType = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const Setting: React.VFC = () => {
  const { t } = useTranslation()
  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const handleClickShowPasswordCurrent = () => {
    setShowCurrentPass(!showCurrentPass)
  }
  const [showNewPassword, setShowNewPassword] = useState(false)
  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword)
  }
  const [ShowConfirmPassword, setShowConfirmPassword] = useState(false)
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!ShowConfirmPassword)
  }
  const validatePassword = yup.object({
    currentPassword: yup.string().required(t('validate.password')),
    newPassword: yup
      .string()
      .min(6, t('validate.password_min'))
      .required('Required at least 6 characters '),
    confirmPassword: yup
      .string()
      .min(6, t('validate.password_min'))
      .required('Required at least 6 characters')
  })
  const { control, handleSubmit, watch } = useForm<UpdatePasswordType>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },

    resolver: yupResolver(validatePassword)
  })

  const onSubmit: SubmitHandler<UpdatePasswordType> = async (value) => {
    try {
      if (watch('newPassword') !== watch('confirmPassword')) {
        toast.error(t('validate.password_not_match'))
        return
      }

      const res = await request.patch('1.0/user/update-password', value)
      if (res.status == 200) {
        toast.success(res.data.message)
        location.reload()
      }
    } catch (error) {
      return
    }
  }

  return (
    // <PageTransparent title="Setting">
    //   <RoundPaper title="Change password">

    <Box
      p={{ xs: 1, md: 5 }}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      autoComplete="off"
    >
      <Stack spacing={3}>
        <Input
          label={t('setting.cur_pass')}
          name="currentPassword"
          type={showCurrentPass ? 'type' : 'password'}
          required
          control={control}
          fullWidth
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPasswordCurrent}
                edge="end"
              >
                {showCurrentPass ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />

        <Input
          label={t('setting.new_pass')}
          name="newPassword"
          type={showNewPassword ? 'type' : 'password'}
          required
          control={control}
          fullWidth
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowNewPassword}
                edge="end"
              >
                {showNewPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />

        <Input
          label={t('setting.conf_pass')}
          name="confirmPassword"
          type={ShowConfirmPassword ? 'type' : 'password'}
          required
          control={control}
          fullWidth
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowConfirmPassword}
                edge="end"
              >
                {ShowConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </Stack>
      <Grid container justifyContent={'flex-end'} style={{ marginTop: 30 }}>
        <Button type="submit" variant="contained">
          {t('submit')}
        </Button>
      </Grid>
    </Box>
    //   </RoundPaper>
    // </PageTransparent>
  )
}

export { Setting }
