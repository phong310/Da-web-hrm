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
    Toolbar,
    Typography,
    styled
} from '@mui/material'
import { V1 } from 'constants/apiVersion'
import { useAtomValue } from 'jotai'
import { request } from 'lib/request'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'
import { Approvers } from 'screen/application/Atoms/Approvers'
import { ModalSkeleton } from 'components/Skeleton/ModalSkeleton'
import { Status } from 'components/Status/Status'
import { KindOfLeaveType, LeaveFormType, LeaveFormTypeV2, ModelHasApproversType, STATUS_FORM, TYPE_FORM } from 'lib/types/applicationForm'
import { CompensatoryWorkingDayData, WorkingDayData } from 'lib/types/timeSheet'
import { EmployeeType } from 'lib/types/user'
import { KIND_OF_LEAVE_TYPES } from 'lib/utils/contants'
import { getLastDateinMonth } from 'lib/utils/datetime'
import { convertDatetimeTZ, convertLocalDatetimeToTZ, formatDateTime, minutesToDays } from 'lib/utils/format'
import { checkFormIsDisableEdit } from 'lib/utils/misc'
import { numberLeaveDay } from 'lib/utils/number_leave_day'
import ItemTimeDetail from 'screen/application/Atoms/ItemTimeDetail'
import { EmployeeSummaryInfov2 } from './EmployeeSummaryInfov2'
import { FooterApplication } from './FooterApplication'
import { stylePopUp } from './ModalDetailLeaveApplication'
import { useAuth } from 'lib/hook/useAuth'
import { systemSettingAtom } from 'lib/atom/authAtom'
import { Permissions } from 'constants/permissions'
type DataResponse<T> = {
  data: T[]
}

type PropType = DialogProps & {
  closeModalEdit: () => void
  idEdit?: number | null
  onSuccess: () => void
}

const ModalUpdateStatusLeave: React.VFC<PropType> = ({
  open,
  onSuccess,
  idEdit,
  closeModalEdit
}) => {
  const { permissions } = useAuth()
  const { t } = useTranslation()
  const { user } = useAuth()
  const [numberOfLeaveDay, setNumberOfLeaveDay] = useState<number>(0)
  const [dataDetail, setDataDetail] = useState<LeaveFormTypeV2>()
  const { control, handleSubmit, setValue, watch, setError, reset, getValues, clearErrors } =
    useForm<LeaveFormType>({
      defaultValues: {
        start_time: formatDateTime(convertLocalDatetimeToTZ(new Date())),
        end_time: formatDateTime(convertLocalDatetimeToTZ(new Date())),
        number_leave_day: 0,
        kind_leave_id: undefined,
        reason: '',
        approver_id_1: undefined,
        approver_id_2: undefined,
        approval_deadline: formatDateTime(getLastDateinMonth()),
        note: '',
        is_salary: true
      }
    })

  const [loading, setLoading] = useState<boolean>(true)

  const [isAprroverApprove, setApproverApprove] = useState(false)
  const [selectedApprovers, setSelectedApprovers] = React.useState<[ModelHasApproversType] | []>([])
  const systemSetting: any = useAtomValue(systemSettingAtom)
  const isEdit = idEdit !== null && idEdit !== undefined
  const isManagerEdit = permissions?.includes(Permissions.leaveFormManage) && idEdit ? true : false

  const isDisaleEdit =
    isEdit === false
      ? false
      : checkFormIsDisableEdit(selectedApprovers) || watch('status') === STATUS_FORM['CANCEL']
  const [refetchNumberDayOff, setRefetchNumberDayOff] = useState<boolean>(false)
  const [kindOfLeave, setKindOfLeave] = useState<string | undefined>()
  const [workingDays, setWorkingDays] = useState<WorkingDayData[]>()
  const [dataKindOfLeave, setDataKindOfLeave] = useState<KindOfLeaveType[]>()
  useQuery<{ data: KindOfLeaveType[] }>(
    [`${V1}/user/kind-of-leave`, { type_equal: KIND_OF_LEAVE_TYPES['NORMAL_LEAVE'] }],
    {
      onSuccess: (data) => {
        setDataKindOfLeave(data?.data)
      }
    }
  )
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
  useEffect(() => {
    dataKindOfLeave?.filter((itemKindOfLeave) => {
      if (itemKindOfLeave.id === dataDetail?.kind_leave_id) {
        setKindOfLeave(`${itemKindOfLeave.name} (${itemKindOfLeave.symbol})`)
      }
    })
  })
  const [compensatoryWDs, setCompensatoryWDs] = useState<CompensatoryWorkingDayData[]>()
  useQuery<DataResponse<CompensatoryWorkingDayData>>([`1.0/user/compensatory-working-day`], {
    onSuccess: (data) => {
      setCompensatoryWDs(data.data)
      setRefetchNumberDayOff(!refetchNumberDayOff)
    }
  })

  useQuery<LeaveFormType>([`1.0/user/manager/form/${idEdit}?type=${TYPE_FORM['LEAVE']}`], {
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
      setLoading(false)
      //@ts-ignore
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
      setValue('is_salary', !!data.is_salary)
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
      const res = await request.patch(`${V1}/user/leave-form/cancel/${idEdit}`)
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
      setIsCancel(false)
    }
  }
  // Manager
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeType>()

  useQuery<EmployeeType>([`1.0/user/employee/${watch('employee_id')}/info`], {
    onSuccess: (data) => {
      setEmployeeInfo(data)
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
        type: TYPE_FORM.LEAVE,
        employee_id: watch('employee_id'),
        number_leave_day: numberOfLeaveDay
      })

      if (res.status == 200) {
        toast(res.data.message)
        setIsCancel(false)
        onSuccess()
      }
    } catch (error:any) {
      toast.error(error.message)
    }
    setIsCancel(false)
  }
  useEffect(() => {
    const start = new Date(watch('start_time'))
    const end = new Date(watch('end_time'))

    if (start && end) {
      const num = numberLeaveDay(start, end, workingDays, compensatoryWDs)
      setNumberOfLeaveDay(num)
      setValue('number_leave_day', minutesToDays(num))
    }
  }, [watch('start_time'), watch('end_time'), workingDays, refetchNumberDayOff, compensatoryWDs])

  const BoxItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    marginBottom: '24px',
    justifyContent: 'space-between'
  }))
  return (
    <>
      <Dialog open={open} sx={{ ...stylePopUp }}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography sx={{ flex: 1, ...styleTitleDialog }} variant="h6" component="div">
              {t('application_management.detail_leave_applicaton')}
            </Typography>
            <IconButton edge="end" color="inherit" onClick={closeModalEdit} aria-label="close">
              <CloseIcon sx={{ ...styleIconClose }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        {loading ? (
          <ModalSkeleton />
        ) : (
          <DialogContent
            sx={{
              ...styleDialog
            }}
          >
            <Box>
              {isManagerEdit ? (
                <Box sx={{ ...styleInfoEmployee }}>
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
                    employee_code={employeeInfo?.employee_code}
                    avatar={employeeInfo?.personal_information?.thumbnail_url}
                    fullName={employeeInfo?.personal_information?.full_name}
                    employeeId={watch('employee_id')}
                    branchName={employeeInfo?.branch?.name}
                    departmentName={employeeInfo?.department?.name}
                    positionName={employeeInfo?.position?.name}
                  />
                </Box>
              ) : null}
              <Box>
                <Grid display={'flex'}>
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

                <BoxItem>
                  <Grid>
                    <Typography sx={{ flex: 1, ...styleBelow }} variant="body2" component="div">
                      {t('application_form.status_form')}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Status value={dataDetail?.status as number} />
                  </Grid>
                </BoxItem>

                <BoxItem>
                  <Typography variant="body1" component="div" sx={{ flex: 1, ...styleBelow }}>
                    {t('application_form.kind_of_leave')}
                  </Typography>
                  <Typography sx={{ ...styleKindOfLeave }} variant="body1" component="div">
                    {kindOfLeave}
                  </Typography>
                </BoxItem>

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
                    {t('application_form.is_paid_leave')}
                  </Typography>
                  <Status value={dataDetail?.is_salary as number} isStatusPaidLeave={true} />
                </BoxItem>
                <BoxItem>
                  <Typography
                    variant="body1"
                    component="div"
                    sx={{ flex: 1, marginBottom: 0, ...styleBelow }}
                  >
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
            </Box>
          </DialogContent>
        )}
        <Box sx={{ padding: '0px 16px 20px 16px' }}>
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
    </>
  )
}
export const styleHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start'
}
const styleTitleDialog = {
  fontSize: { xs: '14px', sm: '18px' }
}
export const styleBelow = {
  fontSize: { xs: '14px', sm: '16px' },
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '22px',
  color: '#111'
}
const styleIconClose = {
  width: { xs: '20px', sm: '30px' }
}
export const styleRestTime = {
  fontSize: { xs: '12px', sm: '14px' },
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '20px',
  mr: 1
}

export const styleNumberOfDayOff = {
  fontWeight: 'bold',
  fontSize: { xs: '12px', sm: '18px' }
}

export const styleTitle = {
  fontWeight: 'bold',
  color: '#146BD2',
  mb: '20px',
  fontSize: { xs: 14, sm: 16, md: 18 }
}
const styleInfoEmployee = {
  mb: 3
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

export const styleHeightInput = {
  height: '42px',
  fontSize: { xs: '14px', sm: '16px' }
}

export const ButtonStyled = styled(Button)(({ theme }) => ({
  fontSize: '16px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px'
  }
}))
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
  width: { xs: '100px', sm: '242px' }
}

export { ModalUpdateStatusLeave }

