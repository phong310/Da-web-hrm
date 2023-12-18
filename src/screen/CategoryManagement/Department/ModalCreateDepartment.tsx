import CloseIcon from '@mui/icons-material/Close'
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
import { ModalSkeleton } from 'components/Skeleton/ModalSkeleton'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'
import { BaseMaster } from 'lib/types/baseMaster'
import { useApiResource } from 'lib/hook/useApiResource'
import { V1 } from 'constants/apiVersion'
import { Input } from 'components/Form/Input/Input'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
type DepartmentType = {
  openModal: boolean
  idEdit?: number | null
  onSuccess?: () => void
  closeModalDetail: () => void
}

type Departmentesponse = {
  data: BaseMaster
}

const ModalCreateDepartment: React.FC<DepartmentType> = ({
  openModal,
  idEdit,
  closeModalDetail,
  onSuccess
}) => {
  const isEdit = idEdit !== null && idEdit !== undefined
  const { t } = useTranslation()
  const [isSubmitting, setIsSubbmitting] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(isEdit ? true : false)
  const { createOrUpdateApi } = useApiResource<BaseMaster>(`${V1}/admin/department`)
  const { control, handleSubmit, reset, clearErrors, setValue, setError } = useForm<BaseMaster>({
    defaultValues: {
      id: idEdit ? idEdit : undefined,
      name: ''
    }
  })
  const onSubmit: SubmitHandler<BaseMaster> = async (value) => {
    setIsSubbmitting(true)
    try {
      const res = await createOrUpdateApi(value)
      if (res.status == 200) {
        toast.success(res?.data?.message)
        setIsSubbmitting(false)
        onSuccess && onSuccess()
      }
    } catch (error:any) {
      toast.error(error.error)
      setIsSubbmitting(false)
      if (error.errors) {
        for (let [key, value] of Object.entries(error.errors)) {
          //@ts-ignore
          setError(key, { message: value })
        }
      }
    }
  }

  useQuery<Departmentesponse>([`${V1}/admin/department/${idEdit}`], {
    onSuccess: (data) => {
      setValue('name', data.data.name)
      setIsLoading(false)
    },
    enabled: idEdit ? true : false
  })

  useEffect(() => {
    clearErrors()
    reset()
  }, [openModal])

  return (
    <Dialog
      open={openModal}
      sx={{
        ...styleDialogCategoryManagement
      }}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>
            {isEdit ? t('department_admin.edit_page') : t('department_admin.create_page')}
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
            <Grid item container xs={12} columnSpacing={2}>
              <Grid item xs={12}>
                <Input
                  fullWidth
                  placeholder={t('department_admin.name')}
                  label={t('department_admin.name')}
                  name="name"
                  control={control}
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
              <Grid item xs={4}>
                <ButtonCommon onClick={closeModalDetail} variant="outlined" error={true}>
                  {t('cancel')}
                </ButtonCommon>
              </Grid>
              <Grid item xs={4}>
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
export const styleDialogCategoryManagement = {
  '& .MuiDialog-container': {
    '& .MuiDialog-paper': {
      minWidth: { sm: '500px' }
    }
  }
}
export default ModalCreateDepartment
