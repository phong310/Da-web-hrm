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
import { GridCloseIcon } from '@mui/x-data-grid'
import { Select, SelectOption } from 'components/Form/Autocomplete/Select'
import { DateTimePickerSeparate } from 'components/Form/Input/DateTimePickerSeparator'
import { Input } from 'components/Form/Input/Input'
import { V1 } from 'constants/apiVersion'
import { Permissions } from 'constants/permissions'
import { useAtomValue } from 'jotai'
import { systemSettingAtom } from 'lib/atom/authAtom'
import { useApiResource } from 'lib/hook/useApiResource'
import { useAuth } from 'lib/hook/useAuth'
import { request } from 'lib/request'
import {
  KindOfLeaveType,
  LeaveFormType,
  ModelHasApproversType,
  STATUS_FORM,
  TYPE_FORM
} from 'lib/types/applicationForm'
import { CompensatoryWorkingDayData, WorkingDayData } from 'lib/types/timeSheet'
import { EmployeeType } from 'lib/types/user'
import { IS_PAID_LEAVE, KIND_OF_LEAVE_TYPES } from 'lib/utils/contants'
import { getDayIdInDate, getLastDateinMonth, isWeekend } from 'lib/utils/datetime'
import {
  convertDatetimeTZ,
  convertDatetimeUTC,
  convertLocalDatetimeToTZ,
  formatDate,
  formatDateTime,
  minutesToDays
} from 'lib/utils/format'
import { checkFormIsDisableEdit, checkIsManager } from 'lib/utils/misc'
import { numberLeaveDay } from 'lib/utils/number_leave_day'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { blueV2 } from 'styles/colors'
import { ApprovalInformation } from './ApprovalInformation'
import { EmployeeSummaryInfo } from './EmployeeSummaryInfo'
import { FooterApplication } from './FooterApplication'
import { SwitchLabel } from 'components/Form/Input/SwitchLabel'

type DataResponse<T> = {
  data: T[]
}

type PropType = DialogProps & {
  closeModalEdit: () => void
  idEdit?: number | null
  onSuccess: () => void
  dateParams?: string | null
}

const ModalLeaveForm: React.VFC<PropType> = ({
  open,
  dateParams,
  onSuccess,
  idEdit,
  closeModalEdit
}) => {
  // const queryString = window.location.search
  // const urlParams = new URLSearchParams(queryString)

  const { permissions } = useAuth()
  // check if tomorrow is weekend -> default start_time is Monday in next week
  const multipleValueInWeekend = isWeekend(new Date(new Date().valueOf() + 1000 * 60 * 60 * 24))
    ? 3
    : 1
  const [reasons, setReasons] = useState<SelectOption[]>()
  const { t } = useTranslation()
  const location: any = useLocation()
  const { user } = useAuth()
  const [numberOfLeaveDay, setNumberOfLeaveDay] = useState<number>(0)
  const [minutesRemains, setMinutesRemains] = useState<number>(0)
  // const [isSalary, setIsSalary] = useState<boolean>(true)
  // const navigate = useNavigate()
  const { createOrUpdateApi } = useApiResource<LeaveFormType>('1.0/user/leave-form')
  const [openAdminOptions, setAdminOption] = useState<boolean>(false)
  const { control, handleSubmit, setValue, watch, setError, reset, clearErrors } =
    useForm<LeaveFormType>({
      defaultValues: {
        start_time:
          dateParams ||
          formatDateTime(
            convertLocalDatetimeToTZ(
              new Date(new Date().valueOf() + 1000 * 60 * 60 * 24 * multipleValueInWeekend)
            )
          ),
        end_time:
          dateParams ||
          convertLocalDatetimeToTZ(
            new Date(new Date().valueOf() + 1000 * 60 * 60 * 24 * multipleValueInWeekend)
          ),
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

  const [approvers, setApprovers] = useState<SelectOption[]>([])

  const [isAprroverApprove, setApproverApprove] = useState(false)
  const [selectedApprovers, setSelectedApprovers] = React.useState<[ModelHasApproversType] | []>([])

  const systemSetting: any = useAtomValue(systemSettingAtom)

  const isManager = checkIsManager(location.pathname)

  const isEdit = idEdit !== null && idEdit !== undefined
  const isManagerEdit =
    permissions?.includes(Permissions.leaveFormManage) && isManager && idEdit ? true : false

  const isDisaleEdit =
    isEdit === false
      ? false
      : checkFormIsDisableEdit(selectedApprovers) || watch('status') === STATUS_FORM['CANCEL']
  useQuery<EmployeeType[]>([`1.0/user/manager/approvers?type=${TYPE_FORM.LEAVE}`], {
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

  useQuery<{ annual_leave: number; leave_form: number }>(
    [`${V1}/user/day-off/remaining-days-off?employee_id=${user?.employee_id}`],
    {
      onSuccess: (data) => {
        setMinutesRemains(data.annual_leave - data.leave_form)
      },
      onError: (error: any) => {
        toast.error(error.message)
      }
    }
  )

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

  useQuery<LeaveFormType>(
    [
      isManager
        ? `1.0/user/manager/form/${idEdit}?type=${TYPE_FORM['LEAVE']}`
        : `1.0/user/leave-form/${idEdit}`
    ],
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

  const { refetch } = useQuery<{ data: KindOfLeaveType[] }>(
    [`${V1}/user/kind-of-leave`, { type_equal: KIND_OF_LEAVE_TYPES['NORMAL_LEAVE'] }],
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

  const onSubmit: SubmitHandler<LeaveFormType> = async (value) => {
    setIsSubmit(true)
    if (isSubmit) return
    try {
      const data = value
      data['start_time'] = formatDateTime(convertDatetimeUTC(value['start_time']))
      data['end_time'] = formatDateTime(convertDatetimeUTC(value['end_time']))
      // data['approval_deadline'] = formatDateTime(convertDatetimeUTC(value['approval_deadline']))
      data['number_leave_day'] = numberOfLeaveDay
      data['is_salary'] = value['is_salary'] ? IS_PAID_LEAVE['YES'] : IS_PAID_LEAVE['NO']

      if (data['is_salary']) {
        if (numberOfLeaveDay > minutesRemains) {
          toast.error(t('validate.run_out_of_leave_time'))
          setIsSubmit(false)
          return
        }
      }

      const res = await createOrUpdateApi(data)
      if (res.status == 200) {
        toast(res.data.message)
        onSuccess()

        // navigate('/applications/leave-form')
      }
    } catch (error: any) {
      toast.error(error.errors)
      if (error.errors) {
        for (const [key, value] of Object.entries(error.errors)) {
          setError(key as any, { message: value as any })
        }
      }
    }
    setIsSubmit(false)
  }

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
    } catch (error: any) {
      toast.error(error.errors)
      if (error.errors) {
        for (const [key, value] of Object.entries(error.errors)) {
          setError(key as any, { message: value as any })
        }
      }
      setIsCancel(false)
    }
  }

  // Reset input when redirect from edit or manager edit to create form
  useEffect(() => {
    reset()
  }, [isEdit, isManagerEdit, reset, setValue])

  useEffect(() => {
    reset()
    clearErrors()
    setIsFirstStartTime(!isFirstStartTime)
    setIsFirstEndTime(!isFirstEndTime)
    setDateStartTime('')
    setDateEndTime('')

    if (workingDays) {
      let workingDayStart: WorkingDayData | undefined = workingDays.find(
        (wd) => wd.day_in_week_id == getDayIdInDate(watch('start_time'))
      )

      if (!workingDayStart) {
        workingDayStart = workingDays.find((wd) => wd.day_in_week_id == 1)
      }
      if (workingDayStart && dateParams) {
        setValue(
          'start_time',
          `${formatDate(dateParams, 'yyyy/MM/dd')} ${workingDayStart.start_time}`
        )
      }
      // End time
      let workingDayEnd: WorkingDayData | undefined = workingDays.find(
        (wd) => wd.day_in_week_id == getDayIdInDate(watch('end_time'))
      )

      if (!workingDayEnd) {
        workingDayEnd = workingDays.find((wd) => wd.day_in_week_id == 1)
      }

      if (workingDayEnd && dateParams) {
        setValue('end_time', `${formatDate(dateParams, 'yyyy/MM/dd')} ${workingDayEnd.end_time}`)
      }
    }
  }, [dateParams, open, workingDays])

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
  // @ts-ignore
  const [isSubmitAction, setIsSubmitAction] = useState<boolean>(false)

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
    } catch (error: any) {
      toast.error(error.message)
    }
    setIsCancel(false)
  }

  const [isFirstStartTime, setIsFirstStartTime] = useState<boolean>(true)
  // Nếu chỉ thay đổi ngày không thay đổi giờ của thời gian bắt đầu,
  // Thì sẽ thay đổi giờ, phút bằng thời gian bắt đầu ngày đó(theo quy định cty)
  // Chỉ thay đổi lần đầu khi vào form
  useEffect(() => {
    if (!isManagerEdit) {
      if (workingDays) {
        let workingDayStart: WorkingDayData | undefined = workingDays.find(
          (wd) => wd.day_in_week_id == getDayIdInDate(watch('start_time'))
        )

        if (!workingDayStart) {
          workingDayStart = workingDays.find((wd) => wd.day_in_week_id == 1)
        }

        if (
          workingDayStart &&
          dateStartTime != formatDate(watch('start_time'), 'yyyy/MM/dd') &&
          isFirstStartTime &&
          !isEdit
        ) {
          setIsFirstStartTime(false)
          setValue(
            'start_time',
            `${formatDate(watch('start_time'), 'yyyy/MM/dd')} ${workingDayStart.start_time}`
          )
          setDateStartTime(formatDate(watch('start_time'), 'yyyy/MM/dd'))
        }
      }
    }
  }, [watch('start_time'), workingDays, isEdit, isFirstStartTime])

  const [isFirstEndTime, setIsFirstEndTime] = useState<boolean>(true)

  // Nếu chỉ thay đổi ngày không thay đổi giờ của thời gian kết thúc,
  // Thì sẽ thay đổi giờ, phút bằng thời gian kết thúc ngày đó(theo quy định cty)
  // Chỉ thay đổi lần đầu khi vào form
  useEffect(() => {
    if (!isManagerEdit) {
      if (workingDays) {
        let workingDayEnd: WorkingDayData | undefined = workingDays.find(
          (wd) => wd.day_in_week_id == getDayIdInDate(watch('end_time'))
        )

        if (!workingDayEnd) {
          workingDayEnd = workingDays.find((wd) => wd.day_in_week_id == 1)
        }

        if (
          workingDayEnd &&
          dateEndTime != formatDate(watch('end_time'), 'yyyy/MM/dd') &&
          isFirstEndTime &&
          !isEdit
        ) {
          setIsFirstEndTime(false)
          setValue(
            'end_time',
            `${formatDate(watch('end_time'), 'yyyy/MM/dd')} ${workingDayEnd?.end_time}`
          )
          setDateEndTime(formatDate(watch('end_time'), 'yyyy/MM/dd'))
        }
      }
    }
  }, [watch('end_time'), workingDays, isEdit, isFirstEndTime])

  useEffect(() => {
    const start = new Date(watch('start_time'))
    const end = new Date(watch('end_time'))

    if (start && end) {
      const num = numberLeaveDay(start, end, workingDays, compensatoryWDs)
      setNumberOfLeaveDay(num)
      setValue('number_leave_day', minutesToDays(num))
    }
  }, [
    watch('start_time'),
    watch('end_time'),
    workingDays,
    refetchNumberDayOff,
    compensatoryWDs,
    dateParams
  ])
  const handleOpenSetOptions = () => {
    setAdminOption(!openAdminOptions)
  }
  // @ts-ignore
  const onSuccessAddOptions = () => {
    refetch()
    setAdminOption(false)
  }

  return (
    <>
      <Dialog open={open} maxWidth="md" sx={{ ...styleDialog }}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ ...styleTextTitle }}>
              {isEdit
                ? t('application_management.edit_leave_applicaton')
                : t('application_form.create_leave_app')}
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="close"
              sx={{ ...iconButton }}
              onClick={closeModalEdit}
            >
              <GridCloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Box
            sx={{ ...styleBoxContainer }}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            autoComplete="off"
          >
            <Grid container spacing={3}>
              {!isEdit && !isManagerEdit ? (
                <>
                  <Grid
                    sx={{
                      mt: 3
                    }}
                    xs={11}
                    justifyContent="flex-start"
                    item
                    container
                  >
                    <Typography variant="body2" sx={{ fontSize: '16px' }}>
                      {t('application_form.remaining_day_off')} :
                      <span
                        style={{
                          ...remainingDayStyle
                        }}
                      >
                        {minutesRemains > 0 ? minutesToDays(minutesRemains, true) : 0}
                      </span>
                    </Typography>
                  </Grid>
                </>
              ) : undefined}

              {isManagerEdit ? (
                <>
                  <Grid container item xs={12}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>
                      {t('information.employee')}
                    </Typography>
                  </Grid>
                  <EmployeeSummaryInfo
                    fullName={employeeInfo?.personal_information?.full_name}
                    employeeId={watch('employee_id')}
                    branchName={employeeInfo?.branch?.name}
                    departmentName={employeeInfo?.department?.name}
                    positionName={employeeInfo?.position?.name}
                  />
                </>
              ) : null}
              {selectedApprovers.length && isEdit ? (
                <>
                  <Grid container item {...grid_title}>
                    <Typography sx={{ ...styleTitle }}>{t('approval_information')}</Typography>
                  </Grid>
                  {selectedApprovers.map((approver, index) => (
                    <ApprovalInformation
                      key={index}
                      fullName={approver.full_name}
                      status={approver.status}
                      approvalAt={approver.approval_time}
                      rejectAt={approver.rejected_time}
                    />
                  ))}
                </>
              ) : null}

              <Grid item {...grid_input}>
                <DateTimePickerSeparate
                  label={t('application_form.from')}
                  name="start_time"
                  control={control}
                  fullWidth
                  disableAll={!!(isManagerEdit || isDisaleEdit)}
                  helperText={
                    <span style={{ fontSize: '14px' }}>
                      {t('application_form.time_of_leave_day') + ': '}
                      <span style={{ fontWeight: 900 }}>{watch('number_leave_day')}</span>
                    </span>
                  }
                />
              </Grid>

              <Grid item {...grid_input}>
                <DateTimePickerSeparate
                  label={t('application_form.to')}
                  minDate={new Date(watch('start_time'))}
                  name="end_time"
                  control={control}
                  fullWidth
                  disableAll={!!(isManagerEdit || isDisaleEdit)}
                />
              </Grid>

              <Grid item {...grid_input}>
                <Select
                  label={t('application_form.kind_of_leave')}
                  name="kind_leave_id"
                  options={reasons}
                  isAddOption
                  onAddOptions={handleOpenSetOptions}
                  placeholder={t('application_form.placeholder_kind_of_leave')}
                  control={control}
                  fullWidth
                  disabled={!!(isManagerEdit || isDisaleEdit)}
                  required
                />
              </Grid>
              <Grid item {...grid_input}>
                <Input
                  label={t('application_form.reason')}
                  name="reason"
                  placeholder={t('application_form.placeholder_reason')}
                  control={control}
                  fullWidth
                  disabled={!!(isManagerEdit || isDisaleEdit)}
                  required
                  sx={{ ...styleHeightInput }}
                />
              </Grid>
              <Grid item {...grid_input}>
                <Select
                  label={t('application_form.approver_1')}
                  name="approver_id_1"
                  placeholder={t('application_form.placeholder_approver')}
                  options={approvers.filter(
                    (approver) => approver.value !== watch('approver_id_2')
                  )}
                  control={control}
                  fullWidth
                  disabled={!!(isManagerEdit || isDisaleEdit)}
                  required
                />
              </Grid>

              <Grid item {...grid_input}>
                <Select
                  label={t('application_form.approver_2')}
                  name="approver_id_2"
                  placeholder={t('application_form.placeholder_approver')}
                  options={approvers.filter(
                    (approver) => approver.value !== watch('approver_id_1')
                  )}
                  control={control}
                  fullWidth
                  disabled={!!(isManagerEdit || isDisaleEdit)}
                />
              </Grid>

              <Grid item md={12} {...grid_input}>
                <Input
                  label={t('application_form.note')}
                  name="note"
                  placeholder={t('application_form.placeholder_note')}
                  control={control}
                  multiline
                  sx={{ fontSize: { xs: '14px', sm: '16px' } }}
                  rows={4}
                  fullWidth
                  disabled={!!(isManagerEdit || isDisaleEdit)}
                />
              </Grid>

              <Grid item md={12} {...grid_input} gap={2} spacing={2}>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid
                    item
                    xs={12}
                    md={5}
                    sx={{ display: 'flex', alignItems: 'flex-end', marginLeft: 1 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SwitchLabel
                        label={t('application_form.is_paid_leave')}
                        name="is_salary"
                        control={control}
                        disabled={!!(isManagerEdit || isDisaleEdit)}
                        //@ts-ignore
                        checked={!!watch('is_salary')}
                      />
                    </Box>
                  </Grid>
                </Grid>
                <i style={{ fontWeight: 400, fontSize: 16, marginLeft: 8, color: '#878C95' }}>
                  {t('note')}: {t('application_form.note_leave_form')}
                </i>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <Box
          sx={{ padding: '0px 10px 30px 10px' }}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          autoComplete="off"
        >
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

const iconButton = {
  marginLeft: 'auto'
}
const grid_input = {
  sm: 6,
  xs: 12
}

const grid_title = {
  xs: 12
}

const styleTitle = {
  fontWeight: 'bold',
  fontSize: { xs: 14, sm: 16, md: 18 }
}

const styleBoxContainer = {
  padding: { xs: '10px 12px', sm: '10px 30px' },
  position: 'relative',
  overflow: 'auto',
  '::-webkit-scrollbar': { width: 4, height: 8 },
  '::-webkit-scrollbar-thumb': {
    backgroundColor: '#F0F0F0'
  }
}

const styleTextTitle = {
  fontSize: { xs: 14, sm: 16 }
}

const styleDialog = {
  '.MuiDialogContent-root': { padding: { xs: 1, sm: 2 } },
  '& .MuiDialog-container': {
    '& .MuiDialog-paper': {
      margin: '16px'
    }
  }
}

export const styleHeightInput = {
  height: { xs: '38px', sm: '42px' },
  fontSize: { xs: '14px', sm: '16px' }
}

export const ButtonStyled = styled(Button)(({ theme }) => ({
  fontSize: '16px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px'
  }
}))
const remainingDayStyle = {
  fontWeight: 700,
  fontSize: 20,
  color: blueV2[50],
  marginTop: '2px'
}
export { ModalLeaveForm }
