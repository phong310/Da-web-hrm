// import { yupResolver } from '@hookform/resolvers/yup'
import { yupResolver } from '@hookform/resolvers/yup'
import {
    CircularProgress,
    FormControlLabel,
    FormGroup,
    Grid,
    Switch,
    Typography
} from '@mui/material'
import { Box } from '@mui/system'
import i18n from 'lib/lang/translations/i18n'
import { request } from 'lib/request'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { styleHeightInput } from './EmployeeForm'
import { EmployeeTabs } from './EmployeeTabs'
import { FormModal } from 'components/Form/Components/FormModal'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
import { Input } from 'components/Form/Input/Input'
import { RoundPaper } from 'components/Layouts/Page/RoundPaper'
import { Page } from 'components/Layouts/Page/Page'
import { PageTable } from 'components/Layouts/Page/PageTable'
import { Select } from 'components/Form/Autocomplete/Select'
import { useApiResource } from 'lib/hook/useApiResource'
import { V1 } from 'constants/apiVersion'
import { UserType } from 'lib/types/user'
import { Role } from 'lib/types/role'
import { DEFAULT_EMPLOYEE_PASSWORD } from 'lib/utils/contants'

type SelectOption = {
  label: string
  value: unknown
}

const validateModalInputPassword = yup.object({
  password: yup
    .string()
    .trim()
    .required(i18n.t('validate.password'))
    .min(6, i18n.t('validate.password_min'))
})
const EmployeeAccountInformation: React.VFC = () => {
  const [contentModal, setContentModal] = useState<any>(null)
  const params = useParams()
  const { t } = useTranslation()
  const [roleOptions, setRoleOptions] = useState<SelectOption[]>([])
  const isEdit = !!params.id
  const { createOrUpdateApi } = useApiResource<UserType>(`${V1}/user/account-information/employee`)
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false)
  const [checked, setChecked] = React.useState(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { control, handleSubmit, setValue, getValues, setError, clearErrors, reset } =
    useForm<UserType>({
      defaultValues: {
        id: 0,
        email: '',
        user_name: '',
        employee_id: Number(params?.id),
        password: DEFAULT_EMPLOYEE_PASSWORD,
        role: ''
      },
    //@ts-ignore
      resolver: yupResolver(validateModalInputPassword)
    })

  useQuery<any>([`${V1}/user/role`], {
    onSuccess: (data) => {
      const roles = data.data.map((row: Role) => ({
        label: row.is_disabled ? t(`role.${row.name}`) : row.name,
        value: row.name
      }))
      setRoleOptions(roles)
    }
  })

  useQuery<UserType>([`${V1}/user/account-information/employee/${params.id}`], {
    onSuccess: (data) => {
      setValue('email', data.email)
      setValue('user_name', data.user_name)
      setValue('role', data.role)
      setValue('employee_id', Number(params?.id))
      setValue('id', data.id)
    },
    enabled: !!isEdit
  })

  const onSubmit: SubmitHandler<UserType> = async () => {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    try {
      const data = getValues()
      delete data['password' as keyof UserType]

      const res = await createOrUpdateApi(data)
      if (res.status == 200) {
        const message = res.data.message
        toast.success(message)
        setIsLoading(false)
      }
    } catch (error:any) {
      setIsLoading(false)
      if (error.errors) {
        Object.entries(error.errors).forEach(([key, value]: any) => {
          setError(key, { message: value[0] })
        })
      }
    }
  }

  const handleResetPassword = async () => {
    try {
      const isValidPassword = await validateModalInputPassword.isValid(getValues())
      if (!isValidPassword) {
        setError('password', {
          type: 'manual',
          message: getValues('password') ? t('validate.password_min') : t('validate.password')
        })
        return
      }
      const res = await request.patch('1.0/user/reset-password', {
        userId: getValues('id'),
        userNewPassword: getValues('password')
      })

      if (res.status == 200) {
        clearErrors('password')
        toast.success(res.data.message)
        setOpenResetPasswordModal(false)
      }
    } catch (error:any) {
      toast.error(error.message)
    }
  }

  const handleClickResetPasswordBtn = () => {
    setOpenResetPasswordModal(true)
    setChecked(true)
    clearErrors('password')
    setValue('password', DEFAULT_EMPLOYEE_PASSWORD)
  }

  const handleCloseResetPasswordModal = () => {
    setOpenResetPasswordModal(false)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (checked) {
      clearErrors('password')
      setValue('password', '')
    } else {
      clearErrors('password')
      setValue('password', DEFAULT_EMPLOYEE_PASSWORD)
    }

    setChecked(event.target.checked)
  }
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (/\s/.test(value)) {
      const newValue = value.replace(/\s/g, '')
      setValue('password', newValue)
    } else {
      setValue('password', value)
    }
  }
  const grid = { md: 4, xs: 12 }

  useEffect(() => {
    setContentModal(
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={12}>
            <Input
              disabled={checked ? true : false}
              fullWidth
              label={t('user_information.password')}
              name="password"
              control={control}
              onChange={handlePasswordChange}
              helperText={
                <FormGroup>
                  <FormControlLabel
                    control={<Switch checked={checked} onChange={handleChange} />}
                    label={
                      <Typography
                        sx={{
                          fontSize: 13,
                          opacity: checked ? 1 : 0.7,
                          fontWeight: checked ? 900 : 500
                        }}
                      >
                        {t('account_information.use_default_password')}
                      </Typography>
                    }
                  />
                </FormGroup>
              }
            />
          </Grid>
        </Grid>
      </Box>
    )
  }, [checked])

  return (
    <>
      <PageTable>
        <RoundPaper>
          <Box sx={{ paddingTop: '16px' }}>
            <EmployeeTabs />
            <Page isDisableBreadcrumb={true} elevation={0} title={t('account_information.name')}>
              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
                <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid container item rowSpacing={{ xs: 2, md: 3 }} spacing={2}>
                    <Grid item {...grid}>
                      <Select
                        fullWidth
                        label={t('_role')}
                        name="role"
                        control={control}
                        options={roleOptions}
                        required
                      />
                    </Grid>
                    <Grid item {...grid}>
                      <Input
                        fullWidth
                        label={t('user_information.user_name')}
                        name="user_name"
                        control={control}
                        sx={{ ...styleHeightInput }}
                        required
                      />
                    </Grid>
                    <Grid item {...grid}>
                      <Input
                        fullWidth
                        label={t('user_information.email')}
                        name="email"
                        control={control}
                        sx={{ ...styleHeightInput }}
                        required
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  container
                  rowSpacing={2}
                  justifyContent="flex-end"
                  gap={2}
                  style={{ marginTop: 150 }}
                  xs={12}
                >
                  <Grid xs={6} sm={4} md={3} lg={1.5} xl={1.2}>
                    <Box>
                      <ButtonCommon onClick={handleClickResetPasswordBtn} variant="contained">
                        {t('reset_password')}
                      </ButtonCommon>
                    </Box>
                  </Grid>
                  <Grid xs={4} sm={3} md={2.5} lg={1.5} xl={1.2}>
                    <Box>
                      <ButtonCommon
                        startIcon={
                          isLoading ? <CircularProgress color="inherit" size="16px" /> : ''
                        }
                        type="submit"
                        variant="contained"
                      >
                        {t('submit')}
                      </ButtonCommon>
                    </Box>
                  </Grid>
                </Grid>
                <FormModal
                  open={openResetPasswordModal}
                  handleClose={handleCloseResetPasswordModal}
                  title={t('account_information.title_of_reset_password_modal')}
                  content={contentModal}
                  onSubmit={handleResetPassword}
                  submitBtnText={t('reset')}
                />
              </Box>
            </Page>
          </Box>
        </RoundPaper>
      </PageTable>
    </>
  )
}

export { EmployeeAccountInformation }

