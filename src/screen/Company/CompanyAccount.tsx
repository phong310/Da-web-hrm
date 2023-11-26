import { Button, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useAtom } from 'jotai'
import { PositionAndTitleResponse, positionAndTitle } from 'lib/atom/positionAndTitles'
import { request } from 'lib/request'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { STATUS_STEP, STEP } from './CompanyForm'
import { CompanySettingData } from './CompanySetting'
import { parseFile } from './file'
import { Input } from 'components/Form/Input/Input'
import { BranchAndDepartmentResponse, branchAndDepartment } from 'lib/atom/branchAndDepartmentAtom'
import { CompanyData } from 'lib/types/companyGroup'
import { companyAtom } from 'lib/atom/CompanyInfoAtom'
import { FullScreenLoadingCompany } from 'components/Loader/FullScreenLoadingCompany'

type CompanyDepartmentAndBranchProps = {
  companyId?: number
  handleComplete: (s: number) => void
  statusStep: string
}

interface IAccount {
  user_name: string
  email: string
  password: string
  role: string
  id: number
}

interface HandleCompany {
  id: number
  name: string
  phone_number: string
  tax_code: string
  address: string
  status: number
  type_of_business: number
  representative: string
  logo: string
  start_time?: Date | string
  end_time?: Date | string
  register_date?: Date | string
  branch_Department: BranchAndDepartmentResponse
  position_title: PositionAndTitleResponse
  system_setting: CompanySettingData
  user_name: string
  email: string
  password: string
  role: string
}
interface IAccountResponse {
  data: IAccount[]
}

const PASSWORD_DEFAULT = 'admin@123'

const CompanyAccount: React.VFC<CompanyDepartmentAndBranchProps> = ({
  companyId,
  handleComplete,
  statusStep
}) => {
  const { t } = useTranslation()
  const [company_Atom] = useAtom<CompanyData>(companyAtom)
  const [branch_Department] = useAtom<BranchAndDepartmentResponse>(branchAndDepartment)
  const system_setting = localStorage.getItem('system-setting')
  const [position_title] = useAtom(positionAndTitle)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const { control, handleSubmit, setValue, setError } = useForm<HandleCompany>({
    defaultValues: {
      id: 0,
      user_name: '',
      email: '',
      role: 'admin',
      password: PASSWORD_DEFAULT
    }
  })

  useQuery<IAccountResponse>([`1.0/user/companies/${companyId}/get-accounts`], {
    onSuccess: (data) => {
      if (data.data.length > 0) {
        setValue('id', data.data[0].id)
        setValue('user_name', data.data[0].user_name)
        setValue('email', data.data[0].email)
      }
    },
    enabled: !!companyId
  })

  const onSubmit: SubmitHandler<HandleCompany> = async (value) => {
    setIsLoading(true)
    try {
      if (company_Atom?.is_create == 0) {
        toast.error(t('companies.please_complete_step_1'))
        setIsLoading(false)
        return
      }
      if (branch_Department?.branchs.length == 0 || branch_Department?.departments.length == 0) {
        toast.error(t('companies.please_complete_step_2'))
        setIsLoading(false)
        return
      }
      if (position_title?.positions.length == 0 || position_title?.titles.length == 0) {
        toast.error(t('companies.please_complete_step_3'))
        setIsLoading(false)
        return
      }
      if (system_setting == null) {
        toast.error(t('companies.please_complete_step_4'))
        setIsLoading(false)
        return
      }
      const formData = new FormData()
      const formDataBranch = new FormData()
      formData.append('name', company_Atom.name)
      formData.append('phone_number', company_Atom.phone_number)
      formData.append('tax_code', company_Atom.tax_code)
      formData.append('type_of_business', String(company_Atom.type_of_business))
      formData.append('representative', company_Atom.representative)
      formData.append('status', String(company_Atom.status))
      formData.append('address', company_Atom.address)
      // Kiểm tra và thêm trường logo vào company_info nếu có
      if (company_Atom?.logo) {
        formData.append('logo', parseFile(company_Atom.logo))
      }
      // Append branch and department data to formData
      branch_Department?.departments.forEach((d) => {
        formData.append('departments[]', d.value)
        formDataBranch.append('departments[]', d.value)
      })

      branch_Department?.branchs.forEach((b) => {
        formData.append('branchs[]', b.value)
        formDataBranch.append('branchs[]', b.value)
      })

      // Append position and titles data to formData
      position_title?.positions.forEach((d) => {
        formData.append('positions[]', d.value)
        formDataBranch.append('positions[]', d.value)
      })

      position_title?.titles.forEach((b) => {
        formData.append('titles[]', b.value)
        formDataBranch.append('titles[]', b.value)
      })

      if (system_setting) {
        formData.append('system_setting', system_setting)
      }
      formData.append('id', String(value.id))
      formData.append('email', String(value.email))
      formData.append('role', String(value.role))
      formData.append('password', String(value.password))
      formData.append('user_name', String(value.user_name))
    
      
      const res = await request.post('/1.0/user/companies/create-new-company', formData)
      if (res.status == 200) {
        localStorage.removeItem('company_info')
        localStorage.removeItem('branch_departments')
        localStorage.removeItem('system_setting')
        localStorage.removeItem('positions_titles')
        handleComplete(STEP[4])
        toast.success(res.data.message)
        navigate(-1)
        setIsLoading(false)
      }
    } catch (error:any) {
      toast.error(error.error)
      setIsLoading(false)
      if (error.errors) {
        for (const [key, value] of Object.entries(error.errors)) {
          setError(key as keyof IAccount, { message: t(value as string) })
        }
      }
    }
  }

  const gridFull = { xs: 12 }

  return (
    <>
      {isLoading ? <FullScreenLoadingCompany /> : ''}
      <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} mt={2}>
          <Grid item container md={6} spacing={2}>
            <Grid item {...gridFull}>
              <Typography variant={'h5'}>{t('account.create_page')}</Typography>
            </Grid>
            <Grid item container {...gridFull} spacing={2}>
              <Grid item {...gridFull}>
                <Input
                  required
                  control={control}
                  label={t('account.user_name')}
                  name="user_name"
                  fullWidth
                  placeholder={t('account.user_name')}
                />
              </Grid>
              <Grid item {...gridFull}>
                <Input
                  required
                  control={control}
                  placeholder={t('account.email')}
                  label={t('account.email')}
                  name="email"
                  fullWidth
                />
              </Grid>
              <Grid item {...gridFull}>
                <Input
                  control={control}
                  label={t('account.password')}
                  name="password"
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item {...gridFull}>
                <Input control={control} label={t('account.role')} name="role" fullWidth disabled />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" size={'large'} variant="contained">
              {statusStep == STATUS_STEP['UPDATE']
                ? t('update')
                : statusStep == STATUS_STEP['FINISH']
                ? t('finish')
                : t('submit')}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export { CompanyAccount }
