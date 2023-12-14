import {
    AppBar,
    Box,
    Dialog,
    DialogContent,
    DialogProps,
    Grid,
    IconButton,
    Stack,
    Toolbar,
    Typography
} from '@mui/material'
import { useAtomValue } from 'jotai'
import { request } from 'lib/request'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { GridCloseIcon } from '@mui/x-data-grid'
import { ModalSkeleton } from 'components/Skeleton/ModalSkeleton'
import { WorkingDayData } from 'lib/types/timeSheet'
import { useAuth } from 'lib/hook/useAuth'
import { useApiResource } from 'lib/hook/useApiResource'
import { ModelHasApproversType, RequestChangeTimesheetFormType, STATUS_FORM, TYPE_FORM } from 'lib/types/applicationForm'
import { convertDatetimeTZ, convertDatetimeUTC, convertLocalDatetimeToTZ, formatDate, formatDateTime, formatISODate, formatNormalTime } from 'lib/utils/format'
import { getDayIdInDate, getLastDateinMonth } from 'lib/utils/datetime'
import { Select, SelectOption } from 'components/Form/Autocomplete/Select'
import { systemSettingAtom } from 'lib/atom/authAtom'
import { checkFormIsDisableEdit, checkIsManager } from 'lib/utils/misc'
import { Permissions } from 'constants/permissions'
import { EmployeeType } from 'lib/types/user'
import { EmployeeSummaryInfo } from 'screen/leaveForm/EmployeeSummaryInfo'
import { ApprovalInformation } from 'screen/leaveForm/ApprovalInformation'
import { DatePicker } from 'components/Form/Input/DatePicker'
import { TimePicker } from 'components/Form/Input/TimePicker'
import { Input } from 'components/Form/Input/Input'
import { FooterApplication } from 'screen/leaveForm/FooterApplication'
import { V1 } from 'constants/apiVersion'
type WorkingDayResponse = {
  data: WorkingDayData[]
}
type PropType = DialogProps & {
  open?: boolean
  idEdit?: number | null
  handleCloseModal: () => void
  onSuccessEdit: () => void
  dateParams?: string | null
}

const ModalRequestChangeTimeSheet: React.VFC<PropType> = ({
  open,
  idEdit,
  dateParams,
  handleCloseModal,
  onSuccessEdit
}) => {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const { permissions, user } = useAuth()

  const { t } = useTranslation()
  const location = useLocation()
  const params = useParams()

  const navigate = useNavigate()
  const { createOrUpdateApi } = useApiResource<RequestChangeTimesheetFormType>(
    '1.0/user/request-change-timesheet'
  )
  const { control, handleSubmit, setValue, watch, getValues, setError, clearErrors, reset } =
    useForm<RequestChangeTimesheetFormType>({
      defaultValues: {
        check_in_time: formatDateTime(convertLocalDatetimeToTZ(new Date())),
        check_out_time: formatDateTime(convertLocalDatetimeToTZ(new Date())),
        approver_id_1: undefined,
        approver_id_2: undefined,
        approval_deadline: formatISODate(getLastDateinMonth()),
        note: undefined,
        date: dateParams || String(new Date(new Date().valueOf() - 1000 * 60 * 60 * 24))
      }
    })

  const [selectedApprovers, setSelectedApprovers] = React.useState<[ModelHasApproversType] | []>([])
  const [loading, setLoading] = useState<boolean>(true)

  const [approvers, setApprovers] = useState<SelectOption[]>([])
  const [isAprroverApprove, setApproverApprove] = useState(false)
  const systemSetting: any = useAtomValue(systemSettingAtom)

  const isManager = checkIsManager(location.pathname)
  const isEdit = idEdit !== null && idEdit !== undefined
  const isManagerEdit =
    permissions?.includes(Permissions.overtimeManage) && isManager && idEdit ? true : false
  const isDisaleEdit =
    idEdit === null
      ? false
      : checkFormIsDisableEdit(selectedApprovers) || watch('status') === STATUS_FORM['CANCEL']

  useQuery<EmployeeType[]>(
    [`1.0/user/manager/approvers?type=${TYPE_FORM.REQUEST_CHANGE_TIMESHEET}`],
    {
      onSuccess: (data) => {
        setApprovers(() =>
          data.map((item) => {
            return {
              label: item.full_name,
              value: item.id
            }
          })
        )
      },
      onError: (error: any) => {
        toast.error(error.message)
      }
    }
  )

  useQuery<RequestChangeTimesheetFormType>(
    [
      isManager
        ? `1.0/user/manager/form/${idEdit}?type=${TYPE_FORM['REQUEST_CHANGE_TIMESHEET']}`
        : `1.0/user/request-change-timesheet/${idEdit}`
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
        setValue('date', data.date)
        setValue(
          'check_in_time',
          formatDateTime(convertDatetimeTZ(data.check_in_time || '', systemSetting.time_zone))
        )
        setValue(
          'check_out_time',
          formatDateTime(convertDatetimeTZ(data.check_out_time || '', systemSetting.time_zone))
        )
        setValue('approver_id_1', data.approver_id_1)
        setValue('approver_id_2', data.approver_id_2)

        setValue('status', data.status)
        setValue(
          'approval_deadline',
          data.approval_deadline ? data.approval_deadline : formatISODate(getLastDateinMonth())
        )
        setValue('note', data.note)

        if (isEdit && !isManagerEdit) {
          setLoading(false)
        }
      },
      onError: (error: any) => {
        toast.error(error.message)
      },
      enabled: !idEdit ? false : true
    }
  )

  const [workingDays, setWorkingDays] = useState<WorkingDayData[]>()
  useQuery<WorkingDayResponse>([`1.0/user/working-day`], {
    onSuccess: (data) => {
      setWorkingDays(data.data)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
    enabled: !isManagerEdit && !isDisaleEdit ? true : false
  })

  const [isSubmit, setIsSubmit] = useState<boolean>(false)

  const onSubmit: SubmitHandler<RequestChangeTimesheetFormType> = async (value) => {
    if (isSubmit) return
    setIsSubmit(true)
    try {
      const data = value
      data['check_in_time'] = formatDateTime(convertDatetimeUTC(value['check_in_time']))
      data['check_out_time'] = formatDateTime(convertDatetimeUTC(value['check_out_time']))
      // data['approval_deadline'] = formatDateTime(convertDatetimeUTC(value['approval_deadline']))
      data['date'] = formatISODate(value['date'])
      const res = await createOrUpdateApi(data)
      if (res.status == 200) {
        toast(res.data.message)
        onSuccessEdit()
      }
    } catch (error:any) {
      toast.error(error.errors)
      if (error.errors) {
        Object.entries(error.errors).forEach(([key, value]: any) => {
          setError(key, { message: t(value[0]) })
        })
      }
    }
    setIsSubmit(false)
  }

  // If date change -> date of check_in_time and check_out_time will change
  useEffect(() => {
    if (
      formatDate(getValues('check_out_time')) !== formatDate(watch('date')) ||
      formatDate(getValues('check_in_time')) !== formatDate(watch('date'))
    ) {
      setValue(
        'check_out_time',
        `${formatDate(watch('date'), 'yyyy/MM/dd')} ${formatNormalTime(watch('check_out_time'))}`
      )
      setValue(
        'check_in_time',
        `${formatDate(watch('date'), 'yyyy/MM/dd')} ${formatNormalTime(watch('check_in_time'))}`
      )
    }
  }, [watch('date')])

  const [isCancel, setIsCancel] = useState<boolean>(false)

  const handleCancel = async () => {
    try {
      setIsCancel(true)
      const res = await request.patch(`${V1}/user/request-change-timesheet/cancel/${idEdit}`)
      if (res.status == 200) {
        toast(res.data.message)
        // navigate('/applications/request-change-timesheets')
        setIsCancel(false)
        onSuccessEdit()
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

  // Reset input when redirect from edit or manager edit to create form
  useEffect(() => {
    reset()
    setApproverApprove(false)
  }, [isEdit, isManagerEdit, reset, setValue, open])
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeType>()

  useQuery<EmployeeType>([`1.0/user/employee/${watch('employee_id')}/info`], {
    onSuccess: (data) => {
      setEmployeeInfo(data)
      setLoading(false)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
    enabled: !watch('employee_id') ? false : true
  })

  const [isSubmitAction, setIsSubmitAction] = useState<boolean>(false)
  const handleAction = async (action: string) => {
    setIsCancel(true)
    if (isCancel) return
    if (!idEdit) return
    try {
      const res = await request.patch('1.0/user/manager/form/action/' + idEdit, {
        action,
        type: TYPE_FORM.REQUEST_CHANGE_TIMESHEET,
        employee_id: watch('employee_id')
      })

      if (res.status == 200) {
        toast(res.data.message)
        setIsCancel(false)
        onSuccessEdit()
      }
    } catch (error:any) {
      toast.error(error.message)
    }
    setIsCancel(false)
  }
  useEffect(() => {
    let workingDay = workingDays?.find((wd) => wd.day_in_week_id == getDayIdInDate(watch('date')))

    if (!workingDay) {
      workingDay = workingDays?.find((wd) => wd.day_in_week_id == 1)
    }

    if (workingDay) {
      // Check first change date when edit form
      if (open && !isEdit && !isManagerEdit && !isDisaleEdit && !isManager) {
        setValue(
          'check_in_time',
          `${formatDate(watch('date'), 'yyyy/MM/dd')} ${workingDay.start_time}`
        )
        setValue(
          'check_out_time',
          `${formatDate(watch('date'), 'yyyy/MM/dd')} ${workingDay.end_time}`
        )
        if (dateParams) {
          setValue('date', dateParams)
        }
      }
    }
  }, [watch('date'), workingDays, isEdit, open])
  const grid_input = {
    sm: 6,
    xs: 12
  }
  const grid_inputfull = {
    xs: 12
  }
  const styleDialog = {
    '.MuiDialogContent-root': { padding: { xs: 1, sm: 2 } },
    '& .MuiDialog-container': {
      '& .MuiDialog-paper': {
        margin: '16px'
      }
    }
  }
  return (
    <Dialog open={open} maxWidth="md" sx={{ ...styleDialog }}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ ...styleTitleDialog }}>
            {isEdit ? t('application_form.edit_rqt_app') : t('application_form.create_rqt_app')}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="close"
            sx={{ ...iconButton }}
            onClick={handleCloseModal}
          >
            <GridCloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        {loading && (isEdit || isManagerEdit) ? (
          <ModalSkeleton />
        ) : (
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
            <Box sx={{ ...styleBoxContainer }}>
              <Grid container spacing={3}>
                {isManagerEdit && isEdit !== null && isEdit !== undefined ? (
                  <>
                    <Grid container item xs={12}>
                      <Typography sx={{ ...styleTitle }}>{t('information.employee')}</Typography>
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
                {selectedApprovers.length && idEdit !== null && idEdit !== undefined ? (
                  <>
                    <Grid container item {...grid_input}>
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
                  <DatePicker
                    label={t('date')}
                    name="date"
                    maxDate={new Date(new Date().valueOf() - 1000 * 60 * 60 * 24)}
                    control={control}
                    fullWidth
                    disabled={!!(isManagerEdit || isDisaleEdit)}
                  />
                </Grid>
                <Grid item {...grid_input}>
                  <Stack direction="row" alignItems="flex-start" sx={{ gap: 1 }}>
                    <TimePicker
                      label={t('start_time')}
                      name="check_in_time"
                      control={control}
                      fullWidth
                      disabled={!!(isManagerEdit || isDisaleEdit)}
                    />
                    <TimePicker
                      label={t('end_time')}
                      name="check_out_time"
                      control={control}
                      fullWidth
                      disabled={!!(isManagerEdit || isDisaleEdit)}
                    />
                  </Stack>
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
                    // required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Input
                    label={t('note')}
                    name="note"
                    multiline
                    sx={{ fontSize: { xs: '14px', sm: '16px' } }}
                    rows={4}
                    placeholder={t('application_form.placeholder_note')}
                    control={control}
                    fullWidth
                    required
                    disabled={!!(isManagerEdit || isDisaleEdit)}
                  />
                </Grid>
                <Grid item sx={{ ...boxNote }} {...grid_inputfull}>
                  <i style={{ ...styleNote }}>{t('application_form.note_create_change_time')}</i>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </DialogContent>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
        sx={{ padding: '0px 10px 30px 10px' }}
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
  )
}

export { ModalRequestChangeTimeSheet }

const styleBoxContainer = {
  padding: { xs: '10px 12px', sm: '10px 30px' },
  position: 'relative',
  maxHeight: '800px',
  overflow: 'auto',
  // Remove the '&' before '::webkit-scrollbar' and '::webkit-scrollbar-thumb'
  '::-webkit-scrollbar': { width: 4, height: 8 },
  '::-webkit-scrollbar-thumb': {
    backgroundColor: '#F0F0F0'
  }
}
const styleTitleDialog = {
  fontSize: { xs: '14px', sm: '16px' }
}
const styleNote = {
  fontWeight: 400,
  fontSize: 16,
  color: '#878C95'
}
const styleTitle = {
  fontWeight: 'bold',
  fontSize: { xs: 14, sm: 16, md: 18 }
}
const iconButton = {
  marginLeft: 'auto'
}
const styleTextTitle = {
  fontSize: { xs: 14, sm: 20 }
}
const boxNote = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 2,
  justifyContent: 'flex-start'
}
