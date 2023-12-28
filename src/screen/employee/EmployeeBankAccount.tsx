import { yupResolver } from '@hookform/resolvers/yup'
import { CircularProgress, Grid } from '@mui/material'
import { Box } from '@mui/system'
import i18n from 'lib/lang/translations/i18n'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { styleHeightInput } from './EmployeeForm'
import { EmployeeTabs } from './EmployeeTabs'
import { Input } from 'components/Form/Input/Input'
import { useApiResource } from 'lib/hook/useApiResource'
import { V1 } from 'constants/apiVersion'
import { RoundPaper } from 'components/Layouts/Page/RoundPaper'
import { PageTable } from 'components/Layouts/Page/PageTable'
import { Page } from 'components/Layouts/Page/Page'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
import { BankAccount } from 'lib/types/bankAccount'

const validateBankAccount = yup.object({
  account_number: yup
    .string()
    .trim()
    .matches(/^[0-9]+$/, i18n.t('validate.number_only'))
    .min(8, i18n.t('validate.account_number_min'))
    .max(15, i18n.t('validate.account_number_max'))
    .required(i18n.t('validate.account_number')),
  account_name: yup
    .string()
    .trim()
    .max(100, i18n.t('validate.account_name_max'))
    .required(i18n.t('validate.account_name')),
  bank_type: yup
    .string()
    .trim()
    .max(100, i18n.t('validate.bank_type_max'))
    .required(i18n.t('validate.bank_type')),
  bank_branch: yup
    .string()
    .trim()
    .max(100, i18n.t('validate.bank_branch_max'))
    .required(i18n.t('validate.bank_branch')),
  bank_name: yup
    .string()
    .trim()
    .max(100, i18n.t('validate.bank_name_max'))
    .required(i18n.t('validate.bank_name'))
})
// @ts-ignore
const EmployeeBankAccount: React.VFC = (props) => {
  const params = useParams()

  const { t } = useTranslation()

  const { createOrUpdateApi } = useApiResource<BankAccount>(`${V1}/user/bank-account/employee`)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { control, handleSubmit, setValue } = useForm<BankAccount>({
    defaultValues: {
      employee_id: Number(params?.id),
      account_number: 0,
      account_name: '',
      bank_type: '',
      bank_branch: '',
      bank_name: ''
    },
    // @ts-ignore
    resolver: yupResolver(validateBankAccount)
  })

  useQuery<BankAccount>([`${V1}/user/bank-account/employee/${params.id}`], {
    onSuccess: (data) => {
      setValue('id', data.id)
      setValue('account_number', data.account_number)
      setValue('account_name', data.account_name)
      setValue('bank_type', data.bank_type)
      setValue('bank_branch', data.bank_branch)
      setValue('bank_name', data.bank_name)
    },
    enabled: true
  })

  const onSubmit: SubmitHandler<BankAccount> = async (value) => {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    try {
      const res = await createOrUpdateApi(value)
      if (res.status == 200) {
        const message = res.data.message
        toast.success(message)
        setIsLoading(false)
      }
    } catch (error:any) {
      toast.error(error)
      setIsLoading(false)
    }
  }

  const grid = { md: 4, xs: 12 }

  return (
    <PageTable isDisableBreadcrumb={false}>
      <RoundPaper>
        <Box sx={{ paddingTop: '16px' }}>
          <EmployeeTabs />
          <Page elevation={0} title={t('bank_account.name')} isDisableBreadcrumb={true}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
              <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid container item spacing={2}>
                  <Grid item {...grid}>
                    <Input
                      fullWidth
                      label={t('bank_account.account_number')}
                      name="account_number"
                      placeholder={t('bank_account.account_number')}
                      control={control}
                      required
                      type="number"
                      sx={{ ...styleHeightInput }}
                      inputProps={{
                        inputMode: 'numeric',
                        pattern: '[0-9]*'
                      }}
                    />
                  </Grid>
                  <Grid item {...grid}>
                    <Input
                      fullWidth
                      label={t('bank_account.account_name')}
                      placeholder={t('bank_account.account_name')}
                      name="account_name"
                      control={control}
                      required
                      sx={{ ...styleHeightInput }}
                    />
                  </Grid>
                  <Grid item {...grid}>
                    <Input
                      fullWidth
                      label={t('bank_account.bank_type')}
                      placeholder={t('bank_account.bank_type')}
                      name="bank_type"
                      control={control}
                      required
                      sx={{ ...styleHeightInput }}
                    />
                  </Grid>
                  <Grid item {...grid}>
                    <Input
                      fullWidth
                      label={t('bank_account.bank_branch')}
                      placeholder={t('bank_account.bank_branch')}
                      name="bank_branch"
                      control={control}
                      required
                      sx={{ ...styleHeightInput }}
                    />
                  </Grid>
                  <Grid item {...grid}>
                    <Input
                      fullWidth
                      placeholder={t('bank_account.bank_name')}
                      label={t('bank_account.bank_name')}
                      name="bank_name"
                      control={control}
                      required
                      sx={{ ...styleHeightInput }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                container
                rowSpacing={2}
                justifyContent="flex-end"
                gap={2}
                style={{ marginTop: 20 }}
                xs={12}
              >
                <Grid xs={4} sm={3} md={2.5} lg={1.5} xl={1.2}>
                  <Box>
                    <ButtonCommon
                      startIcon={isLoading ? <CircularProgress color="inherit" size="16px" /> : ''}
                      type="submit"
                      variant="contained"
                    >
                      {t('submit')}
                    </ButtonCommon>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Page>
        </Box>
      </RoundPaper>
    </PageTable>
  )
}

export { EmployeeBankAccount }
