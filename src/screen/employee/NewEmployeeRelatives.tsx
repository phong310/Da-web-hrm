import { yupResolver } from '@hookform/resolvers/yup'
import {
    AppBar,
    Box,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogContent,
    FormControlLabel,
    Grid,
    Toolbar,
    Typography
} from '@mui/material'
import { Select } from 'components/Form/Autocomplete/Select'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
import { DatePicker } from 'components/Form/Input/DatePicker'
import { Input } from 'components/Form/Input/Input'
import { V1 } from 'constants/apiVersion'
import { useApiResource } from 'lib/hook/useApiResource'
import { request } from 'lib/request'
import { Relative } from 'lib/types/relatives'
import { SELECT_RELATIVES, SELECT_SEX_RELATIVES } from 'lib/utils/selectRelatives'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { InferType, boolean, object, string } from 'yup'
export type DialogProps = {
  open: boolean
  close: () => void
  reload: () => void
  forceReRender?: any
  dataDetail?: Relative
}

export const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const NewEmployeeRelatives: React.FC<DialogProps> = ({
  open,
  close,
  reload,
  forceReRender,
  dataDetail
}) => {
  // @ts-ignore
  const [contentModal, setContentModal] = useState<any>(null)
  // @ts-ignore
  const { t } = useTranslation()
  const params = useParams()

  const [isDependent, setIsDependent] = useState<boolean>(false)
  // @ts-ignore
  const [dateApply, setDateApply] = useState<Date | null>(null)

  const { createOrUpdateApi } = useApiResource<Relative>(`${V1}/user/relatives/employee`)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  type relativesType = InferType<typeof relativeSchema>
  const relativeSchema = object({
    first_name: string()
      .required(t('validate.first_name'))
      .trim()
      .max(50, t('validate.max_first_name')),
    last_name: string()
      .required(t('validate.last_name'))
      .max(50, t('validate.max_last_name'))
      .trim(),
    birthday: string().required(t('validate.birthday')),
    relationship_type: string().required(t('validate.relatives_valid')),
    ward: string().required(t('validate.ward_id')).max(50, t('validate.ward_max')).trim(),
    address: string().required(t('validate.address')).max(50, t('validate.max_address')).trim(),
    district: string()
      .required(t('validate.district_id'))
      .max(50, t('validate.max_district'))
      .trim(),
    province: string()
      .required(t('validate.province_id'))
      .max(50, t('validate.max_province'))
      .trim(),
    phone: string()
      .required(t('validate.phone'))
      .matches(phoneRegExp, t('validate.phone_number'))
      .trim()
      .max(10, t('validate.max')),
    sex: string().required(t('validate.sex')),
    is_dependent_person: boolean(),
    date_apply: isDependent
      ? string().required(t('validate.require')).nullable()
      : string().nullable()
  })

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDependent(event.target.checked)
  }

  useEffect(() => {
    if (dataDetail && dataDetail?.id) {
      setIsDependent(dataDetail?.is_dependent_person == 1 ? true : false)
      reset({
        first_name: dataDetail?.first_name,
        last_name: dataDetail?.last_name,
        birthday: dataDetail?.birthday,
        relationship_type: dataDetail?.relationship_type,
        ward: dataDetail?.ward,
        address: dataDetail?.address,
        district: dataDetail?.district,
        province: dataDetail?.province,
        phone: dataDetail?.phone,
        sex: dataDetail?.sex,
        is_dependent_person: dataDetail?.is_dependent_person,
        //@ts-ignore
        date_apply: dataDetail?.date_apply
      })
    } else {
      reset({})
      clearErrors()
      setIsDependent(false)
    }
  }, [dataDetail, open])

  const {
    control,
    reset,
    handleSubmit,
    setError,
    clearErrors,
    // @ts-ignore
    formState: { errors }
  } = useForm<relativesType>({
    resolver: yupResolver(relativeSchema),
    mode: 'onChange'
  })
  const onSubmit: SubmitHandler<relativesType> = async (value) => {
    setIsLoading(true)
    try {
      const data = {
        first_name: value.first_name,
        last_name: value.last_name,
        birthday: String(value.birthday),
        relationship_type: Number(value.relationship_type),
        ward: value.ward,
        address: value.address,
        district: value.district,
        province: value.province,
        phone: value.phone,
        sex: Number(value.sex),
        employee_id: Number(params.id),
        is_dependent_person: isDependent,
        // @ts-ignore
        date_apply: isDependent ? value.date_apply : ''
      }
      const res = dataDetail?.id
        ? await request.post(`${V1}/user/relatives/employee/${dataDetail?.id}`, data)
        : await createOrUpdateApi(data)

      if (res.status === 200) {
        const message = res.data.message
        toast.success(message)
        close()
        setIsLoading(false)
        reset()
        reload()
        forceReRender?.(2)
      }
    } catch (error: any) {
      toast.error(error.error)
      if (error.errors) {
        for (const [key, value] of Object.entries(error.errors)) {
          setError(key as any, { message: value as any })
        }
      }
    }
  }

  const grid = { md: 6, xs: 12 }
  const styleHeightInput = {
    color: '#000',
    height: { xs: '38px', sm: '40px' }
  }

  // useEffect(() => {
  //   setContentModal(

  //   )
  // }, [isDependent])

  return (
    <Dialog open={open} maxWidth="md">
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ fontSize: '16px' }}>
            {dataDetail?.id ? t('companies.edit_info') : t('employee.add_new_relatives')}{' '}
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item {...grid}>
              <Input
                fullWidth
                label={t('employee.last_name')}
                required
                name="last_name"
                control={control}
                placeholder={t('employee.last_name')}
                sx={{ ...styleHeightInput }}
              />
            </Grid>
            <Grid item {...grid}>
              <Input
                fullWidth
                label={t('employee.first_name')}
                required
                name="first_name"
                control={control}
                placeholder={t('employee.first_name')}
                sx={{ ...styleHeightInput }}
              />
            </Grid>
            <Grid item {...grid}>
              <DatePicker
                fullWidth
                label={t('employee.birth_day')}
                required
                name="birthday"
                control={control}
                maxDate={new Date(new Date().valueOf() - 1000 * 60 * 60 * 24)}
              />
            </Grid>
            <Grid item {...grid}>
              <Select
                fullWidth
                label={t('employee.relatives_type')}
                required
                name="relationship_type"
                control={control}
                placeholder={t('employee.relatives_type')}
                options={SELECT_RELATIVES.map((relative) => ({
                  ...relative,
                  value: relative.value,
                  label: relative.label
                }))}
              />
            </Grid>
            <Grid item {...grid}>
              <Input
                fullWidth
                label={t('address.province')}
                required
                name="province"
                control={control}
                placeholder={t('address.province')}
                sx={{ ...styleHeightInput }}
              />
            </Grid>
            <Grid item {...grid}>
              <Input
                fullWidth
                label={t('address.district')}
                required
                name="district"
                control={control}
                placeholder={t('address.district')}
                sx={{ ...styleHeightInput }}
              />
            </Grid>
            <Grid item {...grid}>
              <Input
                fullWidth
                label={t('address.ward')}
                required
                name="ward"
                control={control}
                placeholder={t('address.ward')}
                sx={{ ...styleHeightInput }}
              />
            </Grid>
            <Grid item {...grid}>
              <Input
                fullWidth
                label={t('address.name')}
                required
                name="address"
                control={control}
                placeholder={t('address.name')}
                sx={{ ...styleHeightInput }}
              />
            </Grid>
            <Grid item {...grid}>
              <Input
                fullWidth
                label={t('employee.phone_number')}
                required
                name="phone"
                control={control}
                placeholder={t('employee.phone_number')}
                sx={{ ...styleHeightInput }}
              />
            </Grid>
            <Grid item {...grid}>
              <Select
                fullWidth
                label={t('employee.sex.name')}
                required
                name="sex"
                placeholder={t('employee.sex.name')}
                control={control}
                options={SELECT_SEX_RELATIVES.map((sex) => ({
                  ...sex,
                  value: sex.value,
                  label: sex.label
                }))}
              />
            </Grid>
            <Grid item {...grid}>
              <FormControlLabel
                checked={isDependent}
                control={<Checkbox onChange={handleCheckboxChange} />}
                label={<span>{t('employee.relatives_person')}</span>}
              />
            </Grid>
            {isDependent && (
              <Grid item {...grid}>
                <DatePicker
                  fullWidth
                  label={t('employee.relatives_date_apply')}
                  name="date_apply"
                  control={control}
                  maxDate={new Date(new Date().valueOf() - 1000 * 60 * 60 * 24)}
                  required
                />
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>
      {/* <FormModal
        open={open}
        handleClose={close}
        onSubmit={handleSubmit(onSubmit)}
        title={dataDetail?.id ? t('companies.edit_info') : t('add')}
        content={contentModal}
        customStyles={{
          width: { xs: '90%', md: '60%' },
          height: { xs: '600px', md: 'unset' },
          btnFooterRight: true
        }}
      /> */}
      <Grid
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        container
        sx={{ display: 'flex', mb: 3, justifyContent: 'center', alignItems: 'center' }}
        columnSpacing={2}
      >
        <Grid item xs={4} sm={3} md={2}>
          <ButtonCommon onClick={close} variant="outlined" error={true}>
            {t('cancel')}
          </ButtonCommon>
        </Grid>
        <Grid item xs={4} sm={3} md={2}>
          <ButtonCommon
            startIcon={isLoading ? <CircularProgress color="inherit" size="16px" /> : ''}
            type="submit"
            variant="contained"
          >
            {t('submit')}
          </ButtonCommon>
        </Grid>
      </Grid>
    </Dialog>
  )
}

export default NewEmployeeRelatives
