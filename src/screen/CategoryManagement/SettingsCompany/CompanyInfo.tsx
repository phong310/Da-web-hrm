// @ts-nocheck
import { Box, Button, CircularProgress, Grid, Stack, Typography, styled } from '@mui/material'
import { Select } from 'components/Form/Autocomplete/Select'
import { AvatarCustom } from 'components/Form/Components/AvatarCustom'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
import { DatePicker } from 'components/Form/Input/DatePicker'
import { Input } from 'components/Form/Input/Input'
import { RoundPaper } from 'components/Layouts/Page/RoundPaper'
import { useApiResource } from 'lib/hook/useApiResource'
import { useAuth } from 'lib/hook/useAuth'
import { AVATAR_SIZE, TYPE_OF_BUSSINESS_OPTIONS } from 'lib/utils/contants'
import { formatDate } from 'lib/utils/format'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'
import { grey } from 'styles/colors'
import { StatusCompany } from './StatusCompany'

export type CompanyDataInfo = {
  id: number
  name: string
  phone_number: string
  tax_code: string
  address: string
  status: number | string
  type_of_business: number
  representative: string
  logo: string
  logo_url: string
  start_time?: Date | string | null
  end_time?: Date | string | null
  register_date?: Date | string
}
export const CompanyInfo: React.FC = () => {
  const { t } = useTranslation()
  const { user, systemSetting } = useAuth()

  const { createOrUpdateApi } = useApiResource<CompanyDataInfo>(
    `/1.0/admin/companies/${user?.company.id}/info`
    //@ts-ignore
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { control, watch, clearErrors, setError, handleSubmit, getValues, setValue } =
    useForm<CompanyDataInfo>({
      defaultValues: {
        id: Number(user?.company?.id),
        name: '',
        phone_number: '',
        tax_code: '',
        address: '',
        status: 1,
        type_of_business: 1,
        representative: '',
        logo_url: '',
        start_time: '',
        end_time: '',
        register_date: ''
      }
    })
  const grid = { xs: 12, md: 6 }
  const [files, setFiles] = useState<File>()

  const { refetch } = useQuery<CompanyDataInfo>([`1.0/admin/companies/${user?.company.id}`], {
    onSuccess: (data) => {
      setValue('name', data.name)
      setValue('representative', data.representative)
      setValue('tax_code', data.tax_code)
      setValue('type_of_business', data.type_of_business)
      setValue(
        'start_time',
        data.start_time ? formatDate(data.start_time, systemSetting?.format_date) : null
      )
      setValue(
        'end_time',
        data.start_time ? formatDate(data.start_time, systemSetting?.format_date) : null
      )
      setValue('status', data.status)
      setValue('address', data.address)
      setValue('logo_url', data.logo_url.replace('http://localhost:8000/storage/', ''))
      setValue('phone_number', data.phone_number)
      setValue('register_date', data.register_date)
    }
  })
  const onSubmit: SubmitHandler<CompanyDataInfo> = async (value) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      if (files) {
        formData.append('logo', files)
      }

      formData.append('id', String(user?.company.id))
      formData.append('name', String(value.name))
      formData.append('phone_number', String(value.phone_number))
      formData.append('tax_code', String(value.tax_code))
      formData.append('address', String(value.address))
      formData.append('type_of_business', String(value.type_of_business))
      formData.append('representative', String(value.representative))
      formData.append('register_date', String(value.register_date))
      const res = await createOrUpdateApi(formData)
      if (res.status == 200) {
        toast.success(res.data.message)
        refetch()
        setIsLoading(false)
      }
    } catch (error: any) {
      setIsLoading(false)
      toast.error(error.error)
      if (error.errors) {
        for (let [key, value] of Object.entries(error.errors)) {
          //@ts-ignore
          setError(key, { message: value })
        }
      }
    }
  }

  return (
    <Grid container>
      <Grid
        sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <RoundPaper sx={{ flex: 1 }}>
          <Grid item xs={12} mb={2}>
            <Stack direction={'column'} spacing={3}>
              <Stack justifyContent={'center'} spacing={1}>
                <Stack direction={'column'} spacing={3}>
                  <Stack justifyContent="center" pt={2}>
                    <Button
                      component="label"
                      sx={{
                        p: 0,
                        '&:hover': {
                          backgroundColor: 'initial'
                        }
                      }}
                    >
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={(e) => {
                          const listFile = e.target.files as FileList
                          const file = listFile[0]
                          setFiles(file)
                        }}
                      />
                      {files ? (
                        <AvatarCustom
                          size={AVATAR_SIZE.MAX}
                          alt="description"
                          thumbnail_url={URL.createObjectURL(files)}
                        />
                      ) : (
                        <Stack direction={'column'} justifyContent="center" mt={'unset'}>
                          <AvatarCustom
                            thumbnail_url={
                              watch('logo_url')
                                ? watch('logo_url').indexOf('https') !== -1
                                  ? watch('logo_url').substring(watch('logo_url').indexOf('https'))
                                  : null
                                : null
                            }
                            alt="imageUpload"
                            size={AVATAR_SIZE.MAX}
                          />
                        </Stack>
                      )}
                    </Button>
                  </Stack>
                  <Stack justifyContent={'center'} spacing={1}>
                    <Stack textAlign={'center'}>
                      <Typography color={grey[600]}>
                        <>
                          {t('validate.image_size')} <br /> {t('validate.image_type')}
                        </>
                      </Typography>
                    </Stack>
                    <Stack direction={'row'} justifyContent={'center'}>
                      <Button
                        variant="contained"
                        component="label"
                        sx={{
                          p: '8px 16px',
                          '&:hover': {
                            backgroundColor: 'none'
                          },
                          textTransform: 'none',
                          height: 50
                        }}
                      >
                        <input
                          hidden
                          accept="image/*"
                          type="file"
                          onChange={(e) => {
                            const listFile = e.target.files as FileList
                            const file = listFile[0]
                            setFiles(file)
                          }}
                        />
                        <Typography variant="subtitle2">{t('validate.upload_image')}</Typography>
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Grid>
        </RoundPaper>
        <Grid container sx={{ width: { xs: '100%', md: '73%' } }}>
          <RoundPaper sx={{ width: '100%' }}>
            <Grid container>
              <Typography sx={{ px: '20px', mt: '24px', fontWeight: '600' }}>
                {t('information.user_info')}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              rowSpacing={3}
              columnSpacing={2}
              container
              sx={{ display: 'flex', px: '20px', py: '32px' }}
            >
              <Grid item {...grid}>
                <Input
                  fullWidth
                  placeholder={t('companies.name')}
                  label={t('companies.name')}
                  name="name"
                  control={control}
                  required
                />
              </Grid>
              <Grid item {...grid}>
                <Input
                  fullWidth
                  label={t('companies.representative')}
                  placeholder={t('companies.representative')}
                  name="representative"
                  control={control}
                  required
                />
              </Grid>
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
          </RoundPaper>
          <RoundPaper sx={{ mt: 2 }}>
            <Grid
              item
              xs={12}
              rowSpacing={3}
              columnSpacing={2}
              container
              sx={{ px: '20px', py: '32px' }}
            >
              <Grid item {...grid}>
                <Select
                  fullWidth
                  placeholder={t('companies.type_of_business')}
                  label={t('companies.type_of_business')}
                  name="type_of_business"
                  options={TYPE_OF_BUSSINESS_OPTIONS}
                  control={control}
                  required
                />
              </Grid>
              <Grid item {...grid}>
                <Input
                  fullWidth
                  placeholder={t('companies.address')}
                  label={t('companies.address')}
                  name="address"
                  control={control}
                  required
                />
              </Grid>
              <Grid item {...grid}>
                <DatePicker
                  fullWidth
                  disabled
                  label={t('companies.end_time')}
                  name="end_time"
                  control={control}
                  required
                />
              </Grid>
              <Grid item {...grid}>
                <DatePicker
                  fullWidth
                  disabled
                  label={t('companies.start_time')}
                  name="start_time"
                  control={control}
                  required
                />
              </Grid>
              <Grid item {...grid}>
                <DatePicker
                  fullWidth
                  label={t('companies.register_date')}
                  name="register_date"
                  control={control}
                  required
                />
              </Grid>
              <Grid
                item
                {...grid}
                sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                  <Typography sx={{ fontWeight: '600' }}>{t('companies.status')}</Typography>
                  <Typography sx={{ mt: 2 }}>
                    <StatusCompany value={getValues('status')} />
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Stack direction={'row'} m={4} justifyContent={'end'} spacing={1}>
              <ButtonCommon
                variant="contained"
                type="submit"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={12} /> : ''}
                sx={{ height: 50, maxWidth: '150px' }}
              >
                {t('update')}
              </ButtonCommon>
            </Stack>
          </RoundPaper>
        </Grid>
      </Grid>
    </Grid>
  )
}
const LogoImg = styled('img')(({ theme }) => ({
  height: theme.spacing(3),
  lineHeight: theme.spacing(2)
}))

const AvtImg = styled('img')(({ theme }) => ({
  height: theme.spacing(3),
  lineHeight: theme.spacing(2)
}))
