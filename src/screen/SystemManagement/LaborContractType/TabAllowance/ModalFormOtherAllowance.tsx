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
import { styleDialogCategoryManagement } from 'screen/CategoryManagement/Department/ModalCreateDepartment'
import { useApiResource } from 'lib/hook/useApiResource'
import { OtherAllowanceData } from 'lib/utils/contants'
import { V1 } from 'constants/apiVersion'
import { Input } from 'components/Form/Input/Input'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
type OtherAllowanceType = {
  openModal: boolean
  idEdit?: number | null
  onSuccess?: () => void
  closeModalDetail: () => void
}
const ModalFormOtherAllowance: React.FC<OtherAllowanceType> = ({
  openModal,
  closeModalDetail,
  onSuccess,
  idEdit
}) => {
  const { createOrUpdateApi } = useApiResource<OtherAllowanceData>(`${V1}/admin/other-allowance`)
  const { t } = useTranslation()
  const [isSubmitting, setIsSubbmitting] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(idEdit ? true : false)
  const isEdit = idEdit !== null && idEdit !== undefined
  const { control, setValue, watch, clearErrors, reset, setError, handleSubmit } =
    useForm<OtherAllowanceData>({
      defaultValues: {
        id: idEdit ? Number(idEdit) : undefined,
        name: ''
      }
    })
  useQuery<OtherAllowanceData>([`${V1}/admin/other-allowance/${idEdit}`], {
    onSuccess: (data) => {
      setValue('name', data.name)
      setIsLoading(false)
    },
    enabled: idEdit ? true : false
  })

  useEffect(() => {
    clearErrors()
    reset()
  }, [openModal])

  const onSubmit: SubmitHandler<OtherAllowanceData> = async (value) => {
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
          setError(key as keyof OtherAllowanceData, { message: value as string })
        }
      }
    }
  }
  return (
    <Dialog open={openModal} sx={{ ...styleDialogCategoryManagement }}>
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
                label={t('other_allowances.name')}
                placeholder={t('other_allowances.name')}
                name="name"
                control={control}
                fullWidth
                required
              />
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
export default ModalFormOtherAllowance
