import { LoadingButton } from '@mui/lab'
import { Grid } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { STEP } from './CompanyForm'
import { useAtom } from 'jotai'
import { companyAtom } from 'lib/atom/CompanyInfoAtom'
import { V1 } from 'constants/apiVersion'
import { readAsDataURL, setLocalStorageCleanup } from './file'
import { Input } from 'components/Form/Input/Input'
import { UploadFiles } from 'components/Form/Components/UploadFiles'
import { useApiResource } from 'lib/hook/useApiResource'
import { CompanyData } from 'lib/types/companyGroup'
import { BaseMaster } from 'lib/types/baseMaster'
import { TYPE_OF_BUSSINESS_OPTIONS } from 'lib/utils/contants'
import { Select } from 'components/Form/Autocomplete/Select'
type CompanyInfoProps = {
  companyId?: number
  setCompanyId: (s: number) => void
  handleComplete: (s: number) => void
  statusStep: string
}

const CompanyInfo: React.VFC<CompanyInfoProps> = ({ handleComplete }) => {
  const { t } = useTranslation()
  const [files, setFiles] = useState<any>()
  const [company_Atom, setCompanyAtom] = useAtom<CompanyData>(companyAtom)
  const { createOrUpdateApi } = useApiResource<BaseMaster>(`${V1}/user/companies/check_company`)
  const { control, handleSubmit, setError, clearErrors, formState } = useForm<CompanyData>({
    defaultValues: {
      id: 0,
      name: company_Atom?.name ?? '',
      phone_number: company_Atom?.phone_number ?? '',
      tax_code: company_Atom?.tax_code ?? '',
      address: company_Atom?.address ?? '',
      status: company_Atom?.status ?? 0,
      type_of_business: company_Atom?.type_of_business ?? 1,
      representative: company_Atom?.representative ?? '',
      logo: '',
      start_time: company_Atom?.start_time ?? '',
      end_time: company_Atom?.end_time ?? '',
      register_date: company_Atom?.register_date ?? ''
    }
  })
  const { isSubmitting } = formState
  const onSubmit: SubmitHandler<CompanyData> = async (value) => {
    clearErrors()
    try {
      const formData = new FormData()

      for (const [key, v] of Object.entries(value)) {
        if (key == 'id' && v == 0) {
          continue
        }
        formData.append(key, v as string)
      }

      if (files) {
        const base64Image = await readAsDataURL(files)
        value.logo = base64Image as string
      }
      value.is_create = 1
      const res = await createOrUpdateApi(formData)
      if (res.status == 200) {
        handleComplete(STEP[1])
        //@ts-ignore
        setCompanyAtom(value)
        setLocalStorageCleanup('company_info')
      }
      handleComplete(STEP[1])
    } catch (error:any) {
      toast.error(error.error)
      if (error.errors) {
        Object.entries(error.errors).forEach(([key, value]) => {
          setError(key as keyof CompanyData, { message: t(value as string) })
        })
      }
    }
  }

  const grid = { md: 6, xs: 12 }
  const gridFull = { md: 12, xs: 12 }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
      <Grid container columnSpacing={2} mt={2}>
        <Grid item container md={6} rowSpacing={2}>
          <Grid item {...gridFull}>
            <Input
              fullWidth
              placeholder={t('companies.name')}
              label={t('companies.name')}
              name="name"
              control={control}
              required
            />
          </Grid>
          <Grid item {...gridFull}>
            <Input
              fullWidth
              label={t('companies.representative')}
              placeholder={t('companies.representative')}
              name="representative"
              control={control}
              required
            />
          </Grid>
          <Grid container item {...gridFull} spacing={2}>
            <Grid item {...grid}>
              <Input
                fullWidth
                placeholder={t('companies.tax_code')}
                label={t('companies.tax_code')}
                name="tax_code"
                control={control}
                required
              />
            </Grid>
            <Grid item {...grid}>
              <Input
                fullWidth
                placeholder={t('companies.phone_number')}
                label={t('companies.phone_number')}
                name="phone_number"
                control={control}
                required
              />
            </Grid>
          </Grid>

          <Grid item {...gridFull}>
            <Input
              fullWidth
              placeholder={t('companies.address')}
              label={t('companies.address')}
              name="address"
              control={control}
              required
            />
          </Grid>

          <Grid item {...gridFull}>
            <Select
              fullWidth
              required
              placeholder={t('companies.type_of_business')}
              label={t('companies.type_of_business')}
              name="type_of_business"
              options={TYPE_OF_BUSSINESS_OPTIONS}
              control={control}
            />
          </Grid>
        </Grid>
        <Grid item {...grid} mt={3}>
          <UploadFiles
            files={files}
            setFiles={setFiles}
            acceptedFiles={['JPG', 'PNG', 'GIF', 'JPEG', 'WEBP']}
            filesLimit={1}
          />
        </Grid>

        <Grid item md={12} mt={3}>
          <LoadingButton type="submit" size={'large'} variant="contained" loading={isSubmitting}>
            {t('companies.steps.next')}
          </LoadingButton>
        </Grid>
      </Grid>
    </Box>
  )
}

export { CompanyInfo }
