// @ts-nocheck
import CloseIcon from '@mui/icons-material/Close'
import {
  AppBar,
  Box,
  Dialog,
  DialogContent,
  DialogProps,
  Grid,
  IconButton,
  Toolbar,
  Typography
} from '@mui/material'
import { SelectOption } from 'components/Form/Autocomplete/Select'
import { ModalSkeleton } from 'components/Skeleton/ModalSkeleton'
import { Status } from 'components/Status/Status'
import { V1 } from 'constants/apiVersion'
import { Permissions } from 'constants/permissions'
import { useAtomValue } from 'jotai'
import { systemSettingAtom } from 'lib/atom/authAtom'
import { useApiResource } from 'lib/hook/useApiResource'
import { useAuth } from 'lib/hook/useAuth'
import { request } from 'lib/request'
import { CompensatoryLeaveFormType, KindOfLeaveType, ModelHasApproversType, STATUS_FORM, TYPE_FORM } from 'lib/types/applicationForm'
import { CompensatoryWorkingDayData, WorkingDayData } from 'lib/types/timeSheet'
import { EmployeeType } from 'lib/types/user'
import { KIND_OF_LEAVE_TYPES } from 'lib/utils/contants'
import { getLastDateinMonth, isWeekend } from 'lib/utils/datetime'
import { convertDatetimeTZ, convertLocalDatetimeToTZ, formatDate, formatDateTime, minutesToDays } from 'lib/utils/format'
import { checkFormIsDisableEdit, checkIsManager } from 'lib/utils/misc'
import { numberLeaveDay } from 'lib/utils/number_leave_day'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { BoxItem } from 'screen/OverTime/ModalUpdateStatusOvertime'
import { Approvers } from 'screen/application/Atoms/Approvers'
import ItemTimeDetail from 'screen/application/Atoms/ItemTimeDetail'
import { EmployeeSummaryInfov2 } from 'screen/leaveForm/EmployeeSummaryInfov2'
import { FooterApplication } from 'screen/leaveForm/FooterApplication'

type DataResponse<T> = {
  data: T[]
}
type PropType = DialogProps & {
  handleEditSuccess: () => void
  closeModalEdit: () => void
  idEdit?: number | null
}

const ModalUpdateStatusCompenSatory: React.VFC<PropType> = ({
  open,
  idEdit,
  handleEditSuccess,
  closeModalEdit
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
  const [dataDetail, setDataDetail] = useState<CompensatoryLeaveFormType>()
  const params = useParams()
  const { user } = useAuth()
  const [numberOfLeaveDay, setNumberOfLeaveDay] = useState<number>(0)

  const navigate = useNavigate()
  const { createOrUpdateApi } = useApiResource<CompensatoryLeaveFormType>(
    '1.0/user/compensatory-leave'
  )
  const { control, handleSubmit, setValue, watch, setError, reset, clearErrors } =
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
  const [isAprroverApprove, setApproverApprove] = useState(false)
  const [selectedApprovers, setSelectedApprovers] = React.useState<[ModelHasApproversType] | []>([])

  const systemSetting: any = useAtomValue(systemSettingAtom)

  const isManager = checkIsManager(location.pathname)
  const isEdit = idEdit !== null && idEdit !== undefined
  const isManagerEdit = permissions?.includes(Permissions.overtimeManage) && idEdit ? true : false

  const isDisaleEdit =
    idEdit === null
      ? false
      : checkFormIsDisableEdit(selectedApprovers) || watch('status') === STATUS_FORM['CANCEL']

  const [dateStartTime, setDateStartTime] = useState<Date | string>()
  const [dateEndTime, setDateEndTime] = useState<Date | string>()
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

  useQuery<CompensatoryLeaveFormType>(
    [`1.0/user/manager/form/${idEdit}?type=${TYPE_FORM['COMPENSATORY_LEAVE']}`],
    {
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

          setDateStartTime(
            formatDate(
              convertDatetimeTZ(data.start_time || '', systemSetting.time_zone),
              'yyyy/MM/dd'
            )
          )

          setDateEndTime(
            formatDate(
              convertDatetimeTZ(data.end_time || '', systemSetting.time_zone),
              'yyyy/MM/dd'
            )
          )
        }
      },
      onError: (error: any) => {
        toast.error(error.message)
      },
      enabled: !idEdit ? false : true
    }
  )

  useQuery<{ data: KindOfLeaveType[] }>(
    [`${V1}/user/kind-of-leave`, { type_equal: KIND_OF_LEAVE_TYPES['COMPENSATORY_LEAVE'] }],
    {
      onSuccess: (data) => {
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

  const [isSubmit, setIsSubmit] = useState<boolean>(false)
  const [isCancel, setIsCancel] = useState<boolean>(false)
  const handleCancel = async () => {
    try {
      setIsCancel(true)
      const res = await request.patch(`${V1}/user/compensatory-form/cancel/${idEdit}`)
      if (res.status == 200) {
        toast(res.data.message)
        handleEditSuccess()
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
  const [dataKindOfLeave, setDataKindOfLeave] = useState<KindOfLeaveType[]>()
  useEffect(() => {
    dataKindOfLeave?.filter((itemKindOfLeave) => {
      if (itemKindOfLeave.id === dataDetail?.kind_leave_id) {
        setKindOfLeave(`${itemKindOfLeave.name} (${itemKindOfLeave.symbol})`)
      }
    })
  })
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
  const [kindOfLeave, setKindOfLeave] = useState<string | undefined>()
  const handleAction = async (action: string) => {
    setIsCancel(true)
    if (isCancel) return
    if (!idEdit) return
    try {
      const res = await request.patch('1.0/user/manager/form/action/' + idEdit, {
        action,
        type: TYPE_FORM.COMPENSATORY_LEAVE,
        employee_id: watch('employee_id'),
        number_leave_day: numberOfLeaveDay
      })

      if (res.status == 200) {
        toast(res.data.message)
        setIsCancel(false)
        handleEditSuccess()
      }
    } catch (error :any) {
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

  return (
    <Dialog open={open} sx={{ ...stylePopUp }}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ flex: 1, ...styleTitleDialog }} variant="h6" component="div">
            {t('application_management.detail_compensatory_leave')}
          </Typography>
          <IconButton edge="end" color="inherit" aria-label="close" onClick={closeModalEdit}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ ...styleDialog }}>
        {loading ? (
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
export const styleDialog = {
  '&.MuiDialogContent-root': {
    padding: { xs: '12px 16px', sm: '20px 24px 20px 24px' },
    overflowX: 'hidden',
    overflowY: 'overlay'
  }
}

const styleHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start'
}

const styleTitleDialog = {
  fontSize: { xs: '14px', sm: '18px' }
}

export const stylePopUp = {
  '& .MuiDialog-container': {
    '& .MuiDialog-paper': {
      margin: '16px'
    }
  }
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
  width: { xs: '100px', sm: '242px' }
}
const styleRestTime = {
  fontSize: { xs: '12px', sm: '14px' },
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '20px',
  mr: 1
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
const styleNumberOfDayOff = {
  fontWeight: 'bold',
  fontSize: { xs: '12px', sm: '18px' }
}
export { ModalUpdateStatusCompenSatory }

