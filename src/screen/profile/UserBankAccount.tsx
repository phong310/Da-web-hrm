import { yupResolver } from '@hookform/resolvers/yup'
import { CircularProgress, Grid, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
// import { Input } from 'components/Form'
// import { ButtonCommon } from 'components/Form/components/ButtonCommon'
// import { RoundPaper } from 'components/v2/RoundPaper'
// import { V1 } from 'constants'
// import { useApiResource, useAuth } from 'lib/hooks'
// import { EmployeeType, InfoBankingUserType } from 'lib/types'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { InferType, object, string } from 'yup'
import { dataBankUser } from '../profile/infoData'
import { InfoDataType, InfoPropsType, TextTitle, phoneRegExp } from './TableProfileInfo'
import { useAuth } from 'lib/hook/useAuth'
import { InfoBankingUserType } from 'lib/types/applicationForm'
import { V1 } from 'constants/apiVersion'
import { EmployeeType } from 'lib/types/user'
import { useApiResource } from 'lib/hook/useApiResource'
import { RoundPaper } from 'components/Layouts/Page/RoundPaper'
import { Input } from 'components/Form/Input/Input'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'

export type TypeIBackAccount = {
  account_number: string
  account_name: string
  bank_branch: string
  bank_name: string
  bank_type: string
}
export const UserBankAccount: React.VFC<InfoPropsType> = () => {
  const theme = useTheme()
  const table = useMediaQuery(theme.breakpoints.down('md'))
  // @ts-ignore
  const { user, systemSetting } = useAuth()
  const { t } = useTranslation()
  // @ts-ignore
  const [tableInfo, setTableInfo] = useState<InfoDataType[]>([])
  const [update, setUpdate] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  type IBackAccount = InferType<typeof backAccountSchema>
  const backAccountSchema = object({
    account_number: string()
      .required(t('validate.require'))
      .matches(phoneRegExp, t('validate.bank_account'))
      .trim()
      .max(30, t('validate.max')),

    account_name: string().required(t('validate.require')).max(20, t('validate.max')).trim(),
    bank_branch: string().required(t('validate.require')).max(20, t('validate.max')).trim(),
    bank_name: string().required(t('validate.require')).max(20, t('validate.max')).trim(),
    bank_type: string().required(t('validate.require')).max(20, t('validate.max')).trim()
  })
  const { data, refetch } = useQuery<{ data: InfoBankingUserType[] }>([`${V1}/user/me/banking`], {
    keepPreviousData: true
  })

  const {
    control,
    reset,
    handleSubmit,
    // @ts-ignore
    formState: { errors }
  } = useForm<IBackAccount>({
    resolver: yupResolver(backAccountSchema),
    mode: 'onChange'
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)


  const onSubmit = async (data: IBackAccount) => {
    setIsLoading(true)
    const formData = {
      account_name: data.account_name,
      account_number: data.account_number,
      bank_branch: data.bank_branch,
      bank_name: data.bank_name,
      bank_type: data.bank_type
    }
    const res = await createOrUpdateApi(formData)
    if (res.status == 200) {
      toast.success(res.data.message)
      refetch()
      setIsLoading(false)
      setUpdate(false)
      navigate('/general/profile/bank-account')
    }
  }

  useEffect(() => {
    const _d = data as unknown as EmployeeType | null
    data && setTableInfo(dataBankUser(t, _d, systemSetting) as InfoDataType[])
    const subData = data as unknown as IBackAccount
    subData &&
      reset({
        ...subData
      })
  }, [data, systemSetting, t, reset, update])

  const { createOrUpdateApi } = useApiResource<EmployeeType>('/1.0/user/me/update-banking')

  useEffect(() => {
    if (location.pathname === '/general/profile/bank-account') {
      setUpdate(false)
    }
    if (location.pathname === '/general/profile/bank-account/edit') {
      setUpdate(true)
    }
  }, [location])
  const grid = { xs: 12, lg: 4 }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RoundPaper>
          <Stack>
            <TextTitle>{t('bank_account.name')}</TextTitle>

            <Stack direction={table ? 'column' : 'row'} pl={4} mr={2}>
              <Grid item container sm={12} columnSpacing={2} rowSpacing={3}>
                <Grid item {...grid}>
                  <Input
                    fullWidth
                    label={t('bank_account.account_number')}
                    placeholder={t('bank_account.account_number')}
                    control={control}
                    name="account_number"
                    required
                  />
                </Grid>
                <Grid item {...grid}>
                  <Input
                    fullWidth
                    label={t('bank_account.account_name')}
                    placeholder={t('bank_account.account_name')}
                    control={control}
                    name="account_name"
                    required
                  />
                </Grid>
                <Grid item {...grid}>
                  <Input
                    fullWidth
                    label={t('bank_account.bank_type')}
                    placeholder={t('bank_account.bank_type')}
                    control={control}
                    name="bank_type"
                    required
                  />
                </Grid>
                <Grid item {...grid}>
                  <Input
                    fullWidth
                    label={t('bank_account.bank_name')}
                    placeholder={t('bank_account.bank_name')}
                    control={control}
                    name="bank_name"
                    required
                  />
                </Grid>
                <Grid item {...grid}>
                  <Input
                    fullWidth
                    label={t('bank_account.bank_branch')}
                    placeholder={t('bank_account.bank_branch')}
                    control={control}
                    name="bank_branch"
                    required
                  />
                </Grid>
              </Grid>
            </Stack>
            <Stack direction={'row'} m={2} justifyContent={'end'} spacing={1}>
              <Grid container justifyContent="flex-end" gap={2} style={{ marginTop: 20 }}>
                <ButtonCommon
                  sx={{ maxWidth: '150px' }}
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={12} /> : ''}
                >
                  {t('update')}
                </ButtonCommon>
              </Grid>
            </Stack>
          </Stack>
        </RoundPaper>
      </form>
    </>
  )
}
