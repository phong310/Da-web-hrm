// @ts-nocheck
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid, Container as MContainer, Paper, Stack, Typography, styled } from '@mui/material'
import { Input } from '../../components/Form/Input/Input'
import { LoadingButton } from '@mui/lab'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { grey } from '../../styles/colors'
import Logo from '../../assets/svgs/logo.svg'
import * as yup from 'yup'
import { useEffect, useState } from 'react'
import { useAuth } from 'lib/hook/useAuth'
import { UserLoginError } from 'lib/types/auth'
import { handleValidateErrors } from 'lib/utils/form'
import { useTranslation } from 'react-i18next'

export type UserLoginArgs = {
  email: string
  password: string
}

export const Login = () => {
  const { login, auth } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const validateSchema = yup
    .object({
      email: yup.string().email(t('validate.invalid_email')).required(t('validate.email_valid')),
      password: yup.string().required(t('validate.password_valid'))
    })
    .required()

  useEffect(() => {
    if (auth) {
      navigate('/time-keeping/timekeeping', {
        replace: true
      })
    }
  }, [auth, navigate])

  const [error, setError] = useState('')

  const {
    control,
    handleSubmit,
    setError: setFormError,
    formState
  } = useForm<UserLoginArgs>({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: yupResolver(validateSchema)
  })

  const { isSubmitting } = formState

  const onSubmit: SubmitHandler<UserLoginArgs> = async (values) => {
    try {
      await login(values)
      navigate('/time-keeping/timekeeping')
    } catch (error: any) {
      if (error.message) {
        setError((error as UserLoginError).message)
      } else if (error.errors) {
        handleValidateErrors(error, setFormError)
      }
    }
  }

  return (
    <Container maxWidth="xs">
      <StyledPaper>
        <Stack alignItems="center">
          <img src={Logo} alt="logo" width={160} />
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
            <Input
              required
              fullWidth
              label={t('email_address')}
              name="email"
              autoComplete="email"
              controlProps={{
                sx: {
                  mb: 2
                }
              }}
              control={control}
            />

            <Input
              required
              fullWidth
              name="password"
              label={t('password')}
              type="password"
              autoComplete="current-password"
              control={control}
            />

            <Grid container justifyContent="center">
              <LoadingButton
                type="submit"
                variant="contained"
                sx={{ ...styleButtonLogin, width: (theme: any) => theme.spacing(25) }}
                loading={isSubmitting}
              >
                {t('login')}
              </LoadingButton>
            </Grid>
            <Grid container justifyContent="space-around">
              <Link style={{ textDecoration: 'none' }} to="/companies/create">
                <Typography color={grey[500]} variant="body2">
                  {t('create_account')}
                </Typography>
              </Link>
              <Link style={{ textDecoration: 'none' }} to="/forget-password">
                <Typography color={grey[500]} variant="body2">
                  {t('forget_password')}
                </Typography>
              </Link>
            </Grid>
          </Box>
        </Stack>
      </StyledPaper>
    </Container>
  )
}

const Container = styled(MContainer)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh'
})

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6, 4),
  borderRadius: theme.spacing(2)
}))

const styleButtonLogin = {
  mt: 3,
  mb: 2,
  height: 50
}
