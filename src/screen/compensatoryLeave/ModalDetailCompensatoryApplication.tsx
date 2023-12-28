// @ts-nocheck
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  Grid,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  styled
} from '@mui/material'
import { blue } from '@mui/material/colors'
import { SelectOption } from 'components/Form/Autocomplete/Select'
import { ModalSkeleton } from 'components/Skeleton/ModalSkeleton'
import { V1 } from 'constants/apiVersion'
import { Permissions } from 'constants/permissions'
import { useAtomValue } from 'jotai'
import { systemSettingAtom } from 'lib/atom/authAtom'
import { useApiResource } from 'lib/hook/useApiResource'
import { useAuth } from 'lib/hook/useAuth'
import { CompensatoryLeaveFormType, KindOfLeaveType, ModelHasApproversType, STATUS_FORM, TYPE_FORM } from 'lib/types/applicationForm'
import { CompensatoryWorkingDayData, WorkingDayData } from 'lib/types/timeSheet'
import { EmployeeType } from 'lib/types/user'
import { KIND_OF_LEAVE_TYPES } from 'lib/utils/contants'
import { getLastDateinMonth, isWeekend } from 'lib/utils/datetime'
import { convertDatetimeTZ, convertLocalDatetimeToTZ, formatDateTime, minutesToDays } from 'lib/utils/format'
import { checkFormIsDisableEdit, checkIsManager } from 'lib/utils/misc'
import { numberLeaveDay } from 'lib/utils/number_leave_day'
import React, { useEffect, useState } from 'react'
import {  useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import { Approvers } from 'screen/application/Atoms/Approvers'
import ItemTimeDetail from 'screen/application/Atoms/ItemTimeDetail'
import { Status } from 'components/Status/Status'
import { Green, Orange, Red } from 'styles/colors'
type DataResponse<T> = {
  data: T[]
}

type PropType = DialogProps & {
  item?: CompensatoryLeaveFormType
  textRandom?: string
  open?: boolean
  idDetail?: number | null
  handleEditInModalDetai?: () => void
  closeModalDetail: () => void
}

const ModalDetailCompensatoryApplication: React.VFC<PropType> = ({
  open,
  idDetail,
  handleEditInModalDetai,
  closeModalDetail
}) => {
  const queryString = window.location.search

  const urlParams = new URLSearchParams(queryString)
  const { permissions } = useAuth()
  const multipleValueInWeekend = isWeekend(new Date(new Date().valueOf() + 1000 * 60 * 60 * 24))
    ? 3
    : 1
  const [reasons, setReasons] = useState<SelectOption[]>()
  const { t } = useTranslation()
  const location: any = useLocation()

  const { user } = useAuth()

  const { createOrUpdateApi } = useApiResource<CompensatoryLeaveFormType>(
    '1.0/user/compensatory-leave'
  )
  const [dataDetail, setDataDetail] = useState<CompensatoryLeaveFormType>()

  const { control, handleSubmit, setValue, watch, setError, reset } =
    useForm<CompensatoryLeaveFormType>({
      defaultValues: {
        start_time:
          urlParams.get('date') ||
          formatDateTime(
            convertLocalDatetimeToTZ(
              new Date(new Date().valueOf() + 1000 * 60 * 60 * 24 * multipleValueInWeekend)
            )
          ),
        end_time:
          urlParams.get('date') ||
          convertLocalDatetimeToTZ(
            new Date(new Date().valueOf() + 1000 * 60 * 60 * 24 * multipleValueInWeekend)
          ),
        number_leave_day: 0,
        kind_leave_id: undefined,
        reason: '',
        approver_id_1: undefined,
        approver_id_2: undefined,
        approval_deadline: formatDateTime(getLastDateinMonth()),
        note: ''
      }
    })

  const [loading, setLoading] = useState<boolean>(true)

  const [approvers, setApprovers] = useState<SelectOption[]>([])

  const [isAprroverApprove, setApproverApprove] = useState(false)
  const [selectedApprovers, setSelectedApprovers] = React.useState<[ModelHasApproversType] | []>([])

  const systemSetting: any = useAtomValue(systemSettingAtom)

  const isManager = checkIsManager(location.pathname)
  const isEdit = !isManager && idDetail
  const isManagerEdit =
    permissions?.includes(Permissions.leaveFormManage) && isManager && idDetail ? true : false
  const isDisaleEdit =
    checkFormIsDisableEdit(selectedApprovers) || watch('status') === STATUS_FORM['CANCEL']

  useQuery<EmployeeType[]>([`1.0/user/manager/approvers?type=${TYPE_FORM['COMPENSATORY_LEAVE']}`], {
    onSuccess: (data) => {
      setApprovers(() =>
        data.map((item) => {
          return {
            label: item.full_name,
            value: item.id
          }
        })
      )
    }
  })

  const [refetchNumberDayOff, setRefetchNumberDayOff] = useState<boolean>(false)

  const [workingDays, setWorkingDays] = useState<WorkingDayData[]>()
  useQuery<DataResponse<WorkingDayData>>([`1.0/user/working-day`], {
    onSuccess: (data) => {
      setWorkingDays(data.data)
      setRefetchNumberDayOff(!refetchNumberDayOff)
    },
    onError: (error: any) => {
      toast.error(error.message)
    }
    // enabled: !isManagerEdit && !isDisaleEdit ? true : false
  })

  const [compensatoryWDs, setCompensatoryWDs] = useState<CompensatoryWorkingDayData[]>()
  useQuery<DataResponse<CompensatoryWorkingDayData>>([`1.0/user/compensatory-working-day`], {
    onSuccess: (data) => {
      setCompensatoryWDs(data.data)
      setRefetchNumberDayOff(!refetchNumberDayOff)
    }
  })

  useQuery<CompensatoryLeaveFormType>([`1.0/user/compensatory-leave/${idDetail}`], {
    onSuccess: (data) => {
      const myId = user?.employee_id
      let index = 0
      if (myId === data.approver_id_1) {
        index = 0
      }
      if (myId === data.approver_id_2) {
        index = 1
      }
      if (data.approvers[index].status === STATUS_FORM.UNAPPROVED) {
        setApproverApprove(true)
      }
      setDataDetail(data)
      setValue('id', data.id)
      setSelectedApprovers(data.approvers)
      setValue('employee_id', data.employee_id)
      setValue('updated_at', formatDateTime(convertDatetimeTZ(data.updated_at || '')))
      setValue(
        'start_time',
        formatDateTime(convertDatetimeTZ(data.start_time || '', systemSetting.time_zone))
      )
      setValue(
        'end_time',
        formatDateTime(convertDatetimeTZ(data.end_time || '', systemSetting.time_zone))
      )
      setValue('kind_leave_id', data.kind_leave_id)
      setValue('approver_id_1', data.approver_id_1)
      setValue('approver_id_2', data.approver_id_2)
      setValue('reason', data.reason)
      setValue('approval_deadline', data.approval_deadline)
      setValue('note', data.note)
      setValue('status', data.status)
      setValue(
        'number_leave_day',
        data.number_of_days_off
          ? minutesToDays(Math.abs(Number(data.number_of_days_off.number_of_minutes)))
          : minutesToDays(
              numberLeaveDay(watch('start_time'), watch('end_time'), workingDays, compensatoryWDs)
            )
      )

      if (data.number_of_days_off) {
        setRefetchNumberDayOff(!refetchNumberDayOff)
      }

      if (isEdit && !isManagerEdit) {
        setLoading(false)
      }
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
    enabled: !idDetail ? false : true
  })
  const [dataKindOfLeave, setDataKindOfLeave] = useState<KindOfLeaveType[]>()
  const [kindOfLeave, setKindOfLeave] = useState<string | undefined>()
  useQuery<{ data: KindOfLeaveType[] }>(
    [`${V1}/user/kind-of-leave`, { type_equal: KIND_OF_LEAVE_TYPES['COMPENSATORY_LEAVE'] }],
    {
      onSuccess: (data) => {
        setDataKindOfLeave(data?.data)
        setReasons(() =>
          data.data.map((kol: KindOfLeaveType) => {
            return {
              label: `${kol.name} (${kol.symbol})`,
              value: kol.id
            }
          })
        )
      },
      onError: (error: any) => {
        toast.error(error.message)
      }
    }
  )
  useEffect(() => {
    dataKindOfLeave?.filter((itemKindOfLeave) => {
      if (itemKindOfLeave.id === dataDetail?.kind_leave_id) {
        setKindOfLeave(`${itemKindOfLeave.name} (${itemKindOfLeave.symbol})`)
      }
    })
  })

  // Reset input when redirect from edit or manager edit to create form
  useEffect(() => {
    reset()
  }, [isEdit, isManagerEdit, reset, setValue])

  const [disabledEdit, setDisabledEdit] = useState(true)
  useEffect(() => {
    const check = selectedApprovers.filter((item) => item?.status === 0)
    if (check && check.length >= 1 && dataDetail?.status === 0) {
      setDisabledEdit(false)
    } else {
      setDisabledEdit(true)
    }
  }, [dataDetail, selectedApprovers])

  return (
    <Dialog open={open} sx={{ ...stylePopUp }}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ flex: 1, ...styleTitleDialog }} variant="h6" component="div">
            {t('application_management.detail_compensatory_leave')}
          </Typography>
          <IconButton edge="end" color="inherit" aria-label="close" onClick={closeModalDetail}>
            <CloseIcon sx={{ ...styleIconClose }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {loading && (isEdit || isManagerEdit) ? (
        <ModalSkeleton />
      ) : (
        <DialogContent
          sx={{
            ...styleDialog
          }}
        >
          <Box>
            <Grid sx={{ ...styleGridHeader }}>
              <Typography sx={{ flex: 1, ...styleTitle }} variant="subtitle1" component="div">
                {t('approval_information')}
              </Typography>
              {disabledEdit ? (
                <Box />
              ) : (
                <Tooltip title={t('application_management.edit')} placement="top">
                  <IconButton edge="end" color="inherit" onClick={handleEditInModalDetai}>
                    <EditIcon sx={{ ...styleIconClose }} />
                  </IconButton>
                </Tooltip>
              )}
            </Grid>
            <Approvers data={dataDetail} />

            <Box sx={{ mt: 2, mb: 3 }}>
              <Divider sx={{ ...styleDivider }} />
            </Box>
            <Grid display={'flex'} mb={2}>
              <Typography sx={{ flex: 1, ...styleTitle }} variant="subtitle1" component="div">
                {t('overview.detail')}
              </Typography>
              <Grid display={'flex'}>
                <Typography sx={{ flex: 1, ...styleRestTime }} variant="body2" component="div">
                  {t('timesheet.time_off')}:
                </Typography>
                <Typography variant="body1" sx={{ ...styleNumberOfDayOff }} component="div">
                  {watch('number_leave_day')}
                </Typography>
              </Grid>
            </Grid>
            <ItemTimeDetail dataDetails={dataDetail} />

            <Grid display={'flex'} justifyContent={'space-between'}>
              <Grid>
                <Typography sx={{ ...styleBelow }} variant="body2" component="div">
                  {t('application_form.status_form')}
                </Typography>
              </Grid>
              <Grid>
                <Status value={dataDetail?.status as number} />
              </Grid>
            </Grid>
            <Grid display={'flex'} justifyContent={'space-between'}>
              <Typography variant="body1" component="div" sx={{ flex: 1, ...styleBelow }}>
                {t('application_form.kind_of_leave')}
              </Typography>
              <Typography sx={{ ...styleKindOfLeave }} variant="body1" component="div">
                {kindOfLeave}
              </Typography>
            </Grid>

            <Grid display={'flex'} justifyContent={'space-between'}>
              <Typography variant="body1" component="div" sx={{ flex: 1, ...styleBelow }}>
                {t('application_form.reason')}
              </Typography>
              <Box sx={{ ...styleBoxNote }}>
                <Typography sx={{ ...styleNote }} variant="body1" component="div">
                  {dataDetail?.reason}
                </Typography>
              </Box>
            </Grid>
            <Grid display={'flex'} justifyContent={'space-between'}>
              <Typography variant="body1" component="div" sx={{ flex: 1, ...styleBelow }}>
                {t('note')}
              </Typography>
              <Box sx={{ ...styleBoxNote }}>
                <Typography sx={{ ...styleNote }} variant="body1" component="div">
                  {dataDetail?.note}
                </Typography>
              </Box>
            </Grid>
          </Box>
        </DialogContent>
      )}
    </Dialog>
  )
}
export const ButtonResponsive = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    maxWidth: '120px'
  }
}))

export const styleGridHeader = {
  display: 'flex',
  mb: 2,
  justifyContent: 'space-between',
  alignItems: 'center'
}

export const styleBoxNote = {
  width: { xs: '60%', sm: '60%' },
  justifyContent: 'flex-end',
  display: 'flex',
  textAlign: 'justify'
}
export const styleNote = {
  fontSize: { xs: '13px', sm: '16px' },
  fontStyle: 'normal',
  fontWeight: '600',
  lineHeight: '22px',
  wordBreak: ' break-word',
  marginLeft: { xs: '-20px', sm: '58px ' }
}


const styleKindOfLeave = {
  fontSize: { xs: '13px', sm: '16px' },
  fontStyle: 'normal',
  fontWeight: '600',
  lineHeight: '22px',
  textAlign: 'right',
  width: { xs: '100px', sm: '242px' },
  mb: 3
}
const styleTitleDialog = {
  fontSize: { xs: '14px', sm: '18px' }
}
const styleRestTime = {
  fontSize: { xs: '12px', sm: '14px' },
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '20px',
  mr: 1
}

const styleNumberOfDayOff = {
  fontWeight: 'bold',
  fontSize: { xs: '12px', sm: '18px' }
}

export const styleDialog = {
  '&.MuiDialogContent-root': {
    padding: { xs: '12px 16px', sm: '20px 24px 20px 24px' },
    overflowX: 'hidden',
    overflowY: 'overlay'
  }
}

const styleDivider = {
  margin: '0 -24px',
  width: 'calc(100% + 48px)'
}
const styleTitle = {
  color: '#146BD2',
  fontSize: { xs: '13px', sm: '18px' },
  fontStyle: 'normal',
  fontWeight: '600',
  lineHeight: '26px',
  mb: 2,
  pt: 1
}
const styleBelow = {
  fontSize: { xs: '14px', sm: '16px' },
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '22px',
  color: '#111'
}


export const stylePopUp = {
  '& .MuiDialog-container': {
    '& .MuiDialog-paper': {
      margin: '16px'
    }
  }
}

export const getBgTimeColor = (status: number) => {
  if (status === 0) return blue[600]
  if (status === 1) return Green[600]
  if (status === 2) return Red[400]
  if (status === 3) return Orange[400]
}

const styleIconClose = {
  width: { xs: '20px', sm: '30px' }
}

export { ModalDetailCompensatoryApplication }
