// @ts-nocheck
import {
  AppBar,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Toolbar,
  Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { useTranslation } from 'react-i18next'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { ModalSkeleton } from 'components/Skeleton/ModalSkeleton'
import { toast } from 'react-toastify'
import { useApiResource } from 'lib/hook/useApiResource'
import { AllowanceData } from 'lib/types/baseMaster'
import { V1 } from 'constants/apiVersion'
import { STATUS_ALLOWANCE, STATUS_ALLOWANCE_OPTIONS } from 'lib/utils/contants'
import { Input } from 'components/Form/Input/Input'
import { Select } from 'components/Form/Autocomplete/Select'
import { MoneyInput } from 'components/Form/Input/MoneyInput'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
type AllowanceType = {
  openModal: boolean
  idEdit?: number | null
  onSuccess?: () => void
  closeModalDetail: () => void
}
const ModalFormFixedAllowance: React.FC<AllowanceType> = ({
  openModal,
  closeModalDetail,
  onSuccess,
  idEdit
}) => {
  const { createOrUpdateApi } = useApiResource<AllowanceData>(`${V1}/admin/allowance`)
  const { t } = useTranslation()
  const [isSubmitting, setIsSubbmitting] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(idEdit ? true : false)
  const isEdit = idEdit !== null && idEdit !== undefined
  const { control, setValue, watch, clearErrors, reset, setError, handleSubmit } =
    useForm<AllowanceData>({
      defaultValues: {
        id: idEdit ? Number(idEdit) : undefined,
        name: '',
        amount_of_money: 0,
        status: STATUS_ALLOWANCE['ACTIVE']
      }
    })
  useQuery<AllowanceData>([`${V1}/admin/allowance/${idEdit}`], {
    onSuccess: (data) => {
      setValue('name', data.name)
      setValue('amount_of_money', data.amount_of_money)
      setValue('status', data.status)
      setIsLoading(false)
    },
    enabled: idEdit ? true : false
  })

  useEffect(() => {
    clearErrors()
    reset()
  }, [openModal])

  const onSubmit: SubmitHandler<AllowanceData> = async (value) => {
    let message
    setIsSubbmitting(true)
    try {
      const res = await createOrUpdateApi(value)
      if (res.status == 200) {
        message = res.data.message
        toast.success(message)
        setIsSubbmitting(false)
        onSuccess && onSuccess()
        closeModalDetail && closeModalDetail()
      }
    } catch (error:any) {
      toast.error(error.error)
      setIsSubbmitting(false)
      if (error.errors) {
        for (const [key, value] of Object.entries(error.errors)) {
          setError(key as keyof AllowanceData, { message: value as string })
        }
      }
    }
  }
  return (
    <Dialog open={openModal}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>
            {isEdit ? t('allowances.edit_page') : t('allowances.create_page')}
          </Typography>
          <IconButton edge="end" color="inherit" onClick={closeModalDetail} aria-label="close">
            <CloseIcon sx={{ ...styleIconClose }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        {isLoading && idEdit ? (
          <ModalSkeleton />
        ) : (
          <Grid
            container
            rowSpacing={3}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            autoComplete="off"
          >
            <Grid item xs={12} container>
              <Input
                label={t('allowances.name')}
                placeholder={t('allowances.name')}
                name="name"
                control={control}
                fullWidth
                required
              />
            </Grid>
            <Grid container item spacing={2}>
              <Grid item xs={12} md={6}>
                <Select
                  fullWidth
                  label={t('allowances.status')}
                  placeholder={t('allowances.status')}
                  name="status"
                  control={control}
                  options={STATUS_ALLOWANCE_OPTIONS}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <MoneyInput
                  label={t('allowances.amount_of_money')}
                  placeholder={t('allowances.amount_of_money')}
                  name="amount_of_money"
                  type="number"
                  control={control}
                  fullWidth
                  setValue={setValue}
                  required
                />
              </Grid>
            </Grid>

            <Grid
              item
              xs={12}
              container
              columnSpacing={2}
              sx={{ alignContent: 'center', justifyContent: 'center' }}
            >
              <Grid item xs={6} sm={4}>
                <ButtonCommon onClick={closeModalDetail} variant="outlined" error={true}>
                  {t('cancel')}
                </ButtonCommon>
              </Grid>
              <Grid item xs={6} sm={4}>
                <ButtonCommon
                  disabled={isSubmitting}
                  startIcon={isSubmitting && <CircularProgress color="inherit" size={12} />}
                  type="submit"
                  variant="contained"
                >
                  {idEdit ? t('update') : t('add')}
                </ButtonCommon>
              </Grid>
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  )
}
const styleIconClose = {
  width: { xs: '20px', sm: '30px' }
}
export default ModalFormFixedAllowance
