// @ts-nocheck
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, CircularProgress, Grid, Stack } from '@mui/material'
import i18n from 'lib/lang/translations/i18n'
import { request } from 'lib/request'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { FormPassword } from './components/FormPassword'
import { Input } from 'components/Form/Input/Input'

type UpdatePasswordType = {
newPassword: string
confirmPassword: string
}

const validatePassword = yup.object({
newPassword: yup
.string()
.min(6, i18n.t('validate.password_min'))
.required('Required at least 6 characters '),
confirmPassword: yup
.string()
.min(6, i18n.t('validate.password_min'))
.required('Required at least 6 characters')
})

export const ResetPassword = () => {
const { t } = useTranslation()
const navigate = useNavigate()

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)

const { control, handleSubmit, watch } = useForm<UpdatePasswordType>({
    defaultValues: {
    newPassword: '',
    confirmPassword: ''
    },

    resolver: yupResolver(validatePassword)
    })

    const [isSubmit, setIsSubmit] = useState<boolean>(false)
        const onSubmit: SubmitHandler<UpdatePasswordType> = async (value) => {
            setIsSubmit(true)
            if (isSubmit) return
            try {
            if (watch('newPassword') !== watch('confirmPassword')) {
            toast.error(t('validate.password_not_match'))
            setIsSubmit(false)
            return
            }
            const token = urlParams.get('token')

            const res = await request.patch(`1.0/user/reset-password/${token}`, value)
            if (res.status == 200) {
            toast.success(res.data.message)
            navigate('/login')
            }
            } catch (error:any) {
            toast.error(error.message)
            setIsSubmit(false)
            }
            setIsSubmit(false)
            }

            return (
            <FormPassword title={t('reset_password')}>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
                    <Stack spacing={3}>
                        <Input label={t('setting.new_pass')} name="newPassword" type="password" required control={control} placeholder={t('setting.new_pass')} fullWidth />

                        <Input label={t('setting.conf_pass')} name="confirmPassword" type="password" required control={control} placeholder={t('setting.conf_pass')} fullWidth />
                    </Stack>
                    <Grid container justifyContent={'flex-end'} style={{ marginTop: '24px' }}>
                        <Button type="submit" variant="contained" startIcon={isSubmit ? <CircularProgress color="inherit" size="16px" /> : ''}
                        >
                        {t('submit')}
                        </Button>
                    </Grid>
                </Box>
            </FormPassword>
            )
            }