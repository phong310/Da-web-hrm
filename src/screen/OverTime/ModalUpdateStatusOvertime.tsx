import CloseIcon from '@mui/icons-material/Close'
import {
    AppBar,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogProps,
    Grid,
    IconButton,
    styled,
    Toolbar,
    Typography
} from '@mui/material'
import { SelectOption } from 'components/Form/Autocomplete/Select'
import { ModalSkeleton } from 'components/Skeleton/ModalSkeleton'
import { V1 } from 'constants/apiVersion'
import { Permissions } from 'constants/permissions'
import { useAtomValue } from 'jotai'
import { systemSettingAtom } from 'lib/atom/authAtom'
import { useApiResource } from 'lib/hook/useApiResource'
import { useAuth } from 'lib/hook/useAuth'
import { request } from 'lib/request'
import { ModelHasApproversType, OvertimeFormType, STATUS_FORM, TYPE_FORM } from 'lib/types/applicationForm'
import { EmployeeType } from 'lib/types/user'
import { getLastDateinMonth, subOneDayWhenZeroHour } from 'lib/utils/datetime'
import { convertDatetimeTZ, convertLocalDatetimeToTZ, formatDateTime } from 'lib/utils/format'
import { checkFormIsDisableEdit, checkIsManager } from 'lib/utils/misc'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Approvers } from 'screen/application/Atoms/Approvers'
import ItemTimeDetail from 'screen/application/Atoms/ItemTimeDetail'
import { EmployeeSummaryInfov2 } from 'screen/leaveForm/EmployeeSummaryInfov2'
import { FooterApplication } from 'screen/leaveForm/FooterApplication'
import { minutesToHours } from '../../lib/utils/datetime'

type DataResponse<T> = {
  data: T[]
}

type PropType = DialogProps & {
  onSuccess: () => void
  closeModalEdit: () => void
  idEdit?: number | null
  open?: boolean
}

const ModalUpdateStatusOvertime: React.VFC<PropType> = ({
  open,
  idEdit,
  onSuccess,
  closeModalEdit
}) => {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const { permissions, user } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const location: any = useLocation()

  const { createOrUpdateApi } = useApiResource<OvertimeFormType>('1.0/user/overtime-form')
  const { control, handleSubmit, setValue, watch, reset, setError, clearErrors } =
    useForm<OvertimeFormType>({
      defaultValues: {
        start_time: formatDateTime(convertLocalDatetimeToTZ(new Date())),
        end_time: formatDateTime(convertLocalDatetimeToTZ(new Date())),
        date: urlParams.get('date') || formatDateTime(convertLocalDatetimeToTZ(new Date())),
        reason: '',
        approval_deadline: formatDateTime(getLastDateinMonth()),
        note: '',
        approver_id_1: NaN,
        approver_id_2: NaN
      }
    })
  const [loading, setLoading] = useState<boolean>(true)

  const [approvers, setApprovers] = useState<SelectOption[]>([])
  const [isAprroverApprove, setApproverApprove] = useState(false)
  const [selectedApprovers, setSelectedApprovers] = React.useState<[ModelHasApproversType] | []>([])
  const [totalOvertime, setTotalOvertime] = useState<number>(120)
  const [dataDetail, setDataDetail] = useState<OvertimeFormType>()
  const systemSetting: any = useAtomValue(systemSettingAtom)
  const isManager = checkIsManager(location.pathname)
  const isEdit = idEdit !== null && idEdit !== undefined
  const isManagerEdit = permissions?.includes(Permissions.overtimeManage) && idEdit ? true : false

  const isDisaleEdit =
    isEdit === false
      ? false
      : checkFormIsDisableEdit(selectedApprovers) || watch('status') === STATUS_FORM['CANCEL']

  useQuery<OvertimeFormType>([`1.0/user/manager/form/${idEdit}?type=${TYPE_FORM['OVERTIME']}`], {
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
      setTotalOvertime(parseInt(data.total_time_work))

      setValue('employee_id', data.employee_id)
      setValue(
        'start_time',
        formatDateTime(convertDatetimeTZ(data.start_time || '', systemSetting.time_zone))
      )
      setValue(
        'end_time',
        formatDateTime(
          subOneDayWhenZeroHour(convertDatetimeTZ(data.end_time || '', systemSetting.time_zone))
        )
      )
      setValue(
        'date',
        formatDateTime(convertDatetimeTZ(data.start_time || '', systemSetting.time_zone))
      )
      setValue('approver_id_1', data.approver_id_1)
      setValue('approver_id_2', data.approver_id_2)
      setValue('reason', data.reason)
      setValue('note', data.note)
      setValue('status', data.status)

      if (isEdit && !isManagerEdit) {
        setLoading(false)
      }
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
    enabled: !idEdit ? false : true
  })
  const [isSubmit, setIsSubmit] = useState<boolean>(false)
  const [isCancel, setIsCancel] = useState<boolean>(false)
  const handleCancel = async () => {
    try {
      setIsCancel(true)
      const res = await request.patch(`${V1}/user/overtime-form/cancel/${idEdit}`)
      if (res.status == 200) {
        toast(res.data.message)
        onSuccess()
        setIsCancel(false)
      }
    } catch (error:any) {
      toast.error(error.errors)
      if (error.errors) {
        for (const [key, value] of Object.entries(error.errors)) {
          setError(key as any, { message: value as any })
        }
      }
    }
  }
  // Manager
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeType>()

  useQuery<EmployeeType>([`1.0/user/employee/${watch('employee_id')}/info`], {
    onSuccess: (data) => {
      setEmployeeInfo(data)
      setLoading(false)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
    enabled: watch('employee_id') && isManagerEdit ? true : false
  })

  const handleAction = async (action: string) => {
    setIsCancel(true)
    if (isCancel) return
    if (!idEdit) return
    try {
      const res = await request.patch('1.0/user/manager/form/action/' + idEdit, {
        action,
        type: TYPE_FORM.OVERTIME,
        employee_id: watch('employee_id')
      })

      if (res.status == 200) {
        toast(res.data.message)
        // navigate('/applications/manager/overtimes', {
        //   state: { tabIndex: KEY_SCREEN.AWAITING_CONFIRM }
        // })
        setIsCancel(false)
        onSuccess()
      }
    } catch (error:any) {
      toast.error(error.message)
    }
    setIsCancel(false)
  }

  return (
    <Dialog open={open} sx={{ ...stylePopUp }}>
      <AppBar
        sx={{ position: 'relative', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
      >
        <Toolbar>
          <Typography sx={{ flex: 1, ...styleTitleDialog }} variant="h6" component="div">
            {t('application_management.detail_ot')}
          </Typography>
          <IconButton edge="end" color="inherit" aria-label="close" onClick={closeModalEdit}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {loading ? (
        <ModalSkeleton />
      ) : (
        <DialogContent sx={{ ...styleDialog }}>
          {loading && (isEdit || isManagerEdit) ? (
            <ModalSkeleton />
          ) : (
            <Box>
              {isManagerEdit ? (
                <>
                  <Grid container item xs={12} sx={{ margin: '10px 0' }}>
                    <Typography
                      sx={{
                        fontWeight: 'bold',
                        fontSize: { xs: 14, sm: 16, md: 18 },
                        color: '#146BD2'
                      }}
                    >
                      {t('information.employee')}
                    </Typography>
                  </Grid>
                  <EmployeeSummaryInfov2
                    fullName={employeeInfo?.personal_information?.full_name}
                    employeeId={watch('employee_id')}
                    avatar={employeeInfo?.personal_information?.thumbnail_url}
                    branchName={employeeInfo?.branch?.name}
                    departmentName={employeeInfo?.department?.name}
                    positionName={employeeInfo?.position?.name}
                  />
                </>
              ) : null}
              <Grid display={'flex'}>
                <Typography sx={{ flex: 1, ...styleTitle }} variant="subtitle1" component="div">
                  {t('overview.detail')}
                </Typography>
                <Grid display={'flex'}>
                  <Typography sx={{ flex: 1, ...styleRestTime }} variant="body2" component="div">
                    {t('total_time') + ': '}
                  </Typography>
                  <Typography variant="body1" sx={{ ...styleNumberOfDayOff }} component="div">
                    {minutesToHours(Number(totalOvertime)) || '0h'}
                  </Typography>
                </Grid>
              </Grid>
              <ItemTimeDetail dataDetails={dataDetail} />
              <BoxItem>
                <Typography variant="body1" component="div" sx={{ flex: 1, ...styleBelow }}>
                  {t('application_form.reason')}
                </Typography>
                <Box sx={{ ...styleBoxNote }}>
                  <Typography sx={{ ...styleNote }} variant="body1" component="div">
                    {dataDetail?.reason}
                  </Typography>
                </Box>
              </BoxItem>
              <BoxItem>
                <Typography variant="body1" component="div" sx={{ flex: 1, ...styleBelow }}>
                  {t('note')}
                </Typography>
                <Box sx={{ ...styleBoxNote }}>
                  <Typography sx={{ ...styleNote }} variant="body1" component="div">
                    {dataDetail?.note}
                  </Typography>
                </Box>
              </BoxItem>
              <Box sx={{ ...styleHeader }}>
                <Typography sx={{ flex: 1, ...styleTitle }} variant="subtitle1" component="div">
                  {t('approval_information')}
                </Typography>
              </Box>
              <Approvers data={dataDetail} />
            </Box>
          )}
        </DialogContent>
      )}

      <Box sx={{ padding: '0px 10px 30px 10px' }}>
        <FooterApplication
          handleAction={handleAction}
          handleCancel={handleCancel}
          isCancel={isCancel}
          isManagerEdit={isManagerEdit}
          isEdit={isEdit as boolean}
          loading={loading}
          isSubmit={isSubmit}
          isAprroverApprove={isAprroverApprove}
          isDisaleEdit={isDisaleEdit}
          status={watch('status')}
        />
      </Box>
    </Dialog>
  )
}

export const ButtonResponsive = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    maxWidth: '120px'
  }
}))

export const styleHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start'
}

const styleTitle = {
  fontWeight: 'bold',
  color: '#146BD2',
  mb: '20px',
  fontSize: { xs: 14, sm: 16, md: 18 }
}
const styleTitleDialog = {
  fontSize: { xs: '14px', sm: '18px' }
}
export const BoxItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: '24px',
  justifyContent: 'space-between'
}))

const stylePopUp = {
  '& .MuiDialog-container': {
    '& .MuiDialog-paper': {
      margin: '16px'
    }
  }
}

const styleNote = {
  fontWeight: 400,
  fontSize: 16,
  color: '#878C95'
}

const styleBoxNote = {
  justifyContent: 'flex-end',
  textAlign: 'justify',
  display: { xs: 'flex', sm: 'none' }
}

export const styleBelow = {
  fontSize: { xs: '14px', sm: '16px' },
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '22px',
  color: '#111'
}

export const styleDialog = {
  '&.MuiDialogContent-root': {
    padding: { xs: '12px 16px', sm: '20px 24px' },
    overflowX: 'hidden',
    overflowY: 'overlay'
  },
  '&::-webkit-scrollbar': {
    width: 5,
    height: 8
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#F0F0F0'
  }
}

export const styleNumberOfDayOff = {
  fontWeight: 'bold',
  fontSize: { xs: '12px', sm: '18px' }
}

export const styleRestTime = {
  fontSize: { xs: '12px', sm: '14px' },
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '20px',
  mr: 1
}

export { ModalUpdateStatusOvertime }

