// @ts-nocheck
import {
  AppBar,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogProps,
  Grid,
  IconButton,
  Toolbar,
  Typography
} from '@mui/material'
import { STATUS_ALLOWANCE } from 'lib/utils/contants'
import { numberWithCommas } from 'lib/utils/format-number'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'
import CloseIcon from '@mui/icons-material/Close'
import { ModalSkeleton } from 'components/Skeleton/ModalSkeleton'
import * as yup from 'yup'
import i18n from 'lib/lang/translations/i18n'
import { yupResolver } from '@hookform/resolvers/yup'
import { SwitchLabel } from 'components/Form/Input/SwitchLabel'
import { useApiResource } from 'lib/hook/useApiResource'
import { AllowanceData, LaborContractTypeData } from 'lib/types/baseMaster'
import { V1 } from 'constants/apiVersion'
import { Input } from 'components/Form/Input/Input'
import { MultiSelect } from 'components/Form/Input/MultiSelect'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
type PropType = DialogProps & {
  open?: boolean
  closeModalDetail: () => void
  checkAddSuccess: () => void
  idEdit?: number | null
}
type ResponseType<T> = {
  data: T[]
}
type OptionType = {
  label: string
  value: string | number
}

const validateLabor = yup.object({
  duration_of_contract: yup
    .number()
    .positive(i18n.t('validate.duration_of_contract'))
    .transform((value, originalValue) => {
      if (originalValue === '') {
        return undefined
      }
      return value
    })
    .nullable()
})

const ModalFormLaborContractType: React.FC<PropType> = ({
  open,
  closeModalDetail,
  checkAddSuccess,
  idEdit
}) => {
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmmitting] = useState<boolean>(false)
  const { t } = useTranslation()
  const isEdit = idEdit !== undefined && idEdit !== null
  const { createOrUpdateApi } = useApiResource<LaborContractTypeData>(
    `${V1}/admin/labor-contract-type`
  )
  const { control, handleSubmit, setValue, watch, reset, setError } =
    useForm<LaborContractTypeData>({
      defaultValues: {
        id: idEdit ? Number(idEdit) : undefined,
        name: '',
        duration_of_contract: null,
        allowances: [],
        status_apply_holiday: 0
      },
      resolver: yupResolver(validateLabor)
    })
  const [allowanceOption, setAllowanceOption] = useState<OptionType[]>([])
  useQuery<ResponseType<AllowanceData>>(
    [`${V1}/admin/allowance?per_page=100&status_equal=${STATUS_ALLOWANCE['ACTIVE']}`],
    {
      onSuccess: (data) => {
        setAllowanceOption(
          data.data.map((item) => ({
            label: `${item.name} (${numberWithCommas(item.amount_of_money)} vnđ/tháng)`,
            value: item.id
          }))
        )
      },
      enabled: true
    }
  )
  useQuery<LaborContractTypeData>([`${V1}/admin/labor-contract-type/${idEdit}`], {
    onSuccess: (data) => {
      setValue('name', data.name)
      setValue('duration_of_contract', data.duration_of_contract)
      setValue('allowances', data?.allowances)
      setValue('status_apply_holiday', data?.status_apply_holiday)
      setLoading(false)
    },
    enabled: idEdit ? true : false
  })

  const onSubmit: SubmitHandler<LaborContractTypeData> = async (value) => {
    setIsSubmmitting(true)
    try {
      const res = await createOrUpdateApi(value)

      if (res.status == 200) {
        toast.success(res.data.message)
        setIsSubmmitting(false)
        checkAddSuccess && checkAddSuccess()
        closeModalDetail()
      }
    } catch (error:any) {
      setIsSubmmitting(false)
      if (error.errors) {
        for (const [key, value] of Object.entries(error.errors)) {
          setError(key as keyof LaborContractTypeData, { message: value as string })
        }
      }
    }
  }
  useEffect(() => {
    reset()
  }, [isEdit, open])
  return (
    <Dialog
      open={open}
      sx={{
        ...stylePopUp,
        '& .MuiDialog-container': {
          '& .MuiDialog-paper': {
            width: '680px'
          }
        }
      }}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ flex: 1, ...styleTitleDialog }} variant="h6" component="div">
            {isEdit ? t('labor_contract_types.edit_page') : t('labor_contract_types.create_page')}
          </Typography>
          <IconButton edge="end" color="inherit" onClick={closeModalDetail} aria-label="close">
            <CloseIcon sx={{ ...styleIconClose }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ ...styleDialogSalary }}>
        {loading && isEdit ? (
          <ModalSkeleton />
        ) : (
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
            <Grid container spacing={2}>
              <Grid item md={6} xs={12}>
                <Input
                  required
                  fullWidth
                  placeholder={t('labor_contract_types.name')}
                  label={t('labor_contract_types.name')}
                  name="name"
                  control={control}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Input
                  fullWidth
                  type="number"
                  placeholder={t('labor_contract_types.duration_of_contract_placeholder')}
                  label={t('labor_contract_types.duration_of_contract')}
                  name="duration_of_contract"
                  control={control}
                />
              </Grid>
              <Grid item xs={12}>
                <MultiSelect
                  label={t('labor_contract_types.allowance')}
                  name="allowances"
                  control={control}
                  placeholder={t('labor_contract_types.allowance')}
                  options={allowanceOption}
                  fullWidth
                  style={{ minHeight: 120 }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <SwitchLabel
                  label={t('labor_contract_types.apply_holiday')}
                  name="status_apply_holiday"
                  control={control}
                  //@ts-ignore
                  checked={!!watch('status_apply_holiday')}
                />
              </Grid>
            </Grid>

            <Grid
              container
              rowSpacing={2}
              justifyContent="center"
              style={{ marginTop: 20 }}
              xs={12}
              columnSpacing={2}
            >
              <Grid item xs={6} sm={4}>
                <ButtonCommon onClick={closeModalDetail} variant="outlined" error={true}>
                  {t('cancel')}
                </ButtonCommon>
              </Grid>
              <Grid item xs={6} sm={4}>
                <ButtonCommon
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress color="inherit" size="16px" /> : ''}
                >
                  {isEdit ? t('update', { ns: 'translation' }) : t('add', { ns: 'translation' })}
                </ButtonCommon>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

const styleTitleDialog = {
  fontSize: { xs: '14px', sm: '16px' }
}

const styleIconClose = {
  width: { xs: '20px', sm: '30px' }
}

const styleDialogSalary = {
  '&.MuiDialogContent-root': {
    padding: '24px 16px',
    overflowX: 'hidden',
    overflowY: 'overlay'
  }
}

export const stylePopUp = {
  '& .MuiDialog-container': {
    '& .MuiDialog-paper': {
      margin: '16px'
    }
  }
}

export default ModalFormLaborContractType
