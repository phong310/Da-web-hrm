// @ts-nocheck
import {
    Box,
    Grid,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from '@mui/material'
import { useAtomValue } from 'jotai'
import { request } from 'lib/request'
import lodash from 'lodash'
import React, { useMemo, useState } from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { endOfMonth, startOfMonth } from 'date-fns'
import { TableSkeleton, TableSkeletonType } from 'components/Skeleton/TableSkeleton'
import { CompensatoryWorkingDayData, TimeSheetData, TimesheetCalendarType, WorkingDayData } from 'lib/types/timeSheet'
import { useAuth } from 'lib/hook/useAuth'
import { convertDatetimeTZ, formatDate, formatDateTime, formatISODate, formatNormalDateV2, formatYearMonth } from 'lib/utils/format'
import { getLastDateinMonth } from 'lib/utils/datetime'
import { systemSettingAtom } from 'lib/atom/authAtom'
import { floatDiffInMinutes } from 'lib/utils/number_leave_day'
import { TYPE_FORM } from 'lib/types/applicationForm'
import { ModalDetailOverTimeApplication } from 'screen/OverTime/ModalDetailOverTimeApplication'
import ModalDetailRequestChangeTimesheetApplication from 'screen/RequestChangeTimesheet/ModalDetailRequestChangeTimesheetApplication'
import { ModalDetailCompensatoryApplication } from 'screen/compensatoryLeave/ModalDetailCompensatoryApplication'
import { ModalLeaveForm } from 'screen/leaveForm/ModalLeaveForm'
import { ModalOverTimeForm } from 'screen/OverTime/ModalOverTimeForm'
import { ModalRequestChangeTimeSheet } from 'screen/RequestChangeTimesheet/ModalRequestChangeTimeSheet'
import { ModalCompensatoryForm } from 'screen/compensatoryLeave/ModalCompensatoryForm'
import { Pagev2 } from 'components/Layouts/Page/Pagev2'
import { checkDateWeek, isCheckDate } from 'lib/utils/timesheet'
import { TYPE_TIME } from 'lib/utils/contants'
import { TimeSheetCalendarTable } from './TimeSheetCalendarTable'
import { TimesheetColorNote } from '../TimeSheetColorNote'
import { WorkingTimeInMonth } from './WorkingTimeInMonth'
import { OverTimeInMonth } from './OverTimeInMonth'
import { TimekeepingModal } from '../TimeKeepingModal'
interface TimeSheetCalendarProps {
  month: Date | string
  skeletonConfig?: TableSkeletonType
  onWeekTimeSheet: () => void
  onMonthTimeSheet: () => void
  handleNextWeek: () => void
  handleBackWeek: () => void
  calendar: React.ReactElement
  startDate: Date | string
  typeSheet: string
  endDate: Date | string
}

type checkStartOrEndTimeNullType = {
  start: boolean
  end: boolean
}

export type WorkingDayResponse = {
  data: WorkingDayData[]
}

type timeOffType = {
  paid_leave: number
  unpaid_leave: number
}

type HasFormType = {
  overtime_id: number | null
  request_change_timesheet_id: number | null
  leave_form_id: number | null
  compensatory_leave_id: number | null
}

interface TotalTimeOT {
  total_time_ot: {
    [key: string]: number | string
  }
}

export interface TimekeepingResponse extends TotalTimeOT {
  // timesheets: { data: TimeSheetData[] }
  total_time_work: number
  total_paid_leave: number
  total_unpaid_leave: number
}

interface TimkeepingResponseByDay extends TotalTimeOT {
  data: TimeSheetData[]
}

type DataResponse<T> = {
  data: T[]
}

const TimeSheetCalendar = ({
  month,
  calendar,
  skeletonConfig,
  handleNextWeek,
  handleBackWeek,
  startDate,
  endDate,
  typeSheet,
  onWeekTimeSheet,
  onMonthTimeSheet
}: TimeSheetCalendarProps) => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()

  const { control, handleSubmit, setValue, watch, reset } = useForm<TimesheetCalendarType>({
    defaultValues: {
      employee_id: user?.employee_id,
      check_in_time: '',
      check_out_time: '',
      type: 0,
      date: '',
      approver_id: 1,
      approval_date: formatDateTime(getLastDateinMonth()),
      note: '',
      total_time_work: 0,
      late_time: 0,
      time_early: 0
    }
  })
  const [openDialog, setOpenDialog] = useState<boolean>(false)

  const [loading, setLoading] = useState<boolean>(true)
  const [events, setEvents] = useState({})
  const [totalActualWorkingDays, setTotalActualWorkingDays] = useState<number>(0)

  const [numOfWorkingDays, setNumOfWorkingDays] = useState<number>(0)
  const [totalOvertime, setTotalOvertime] = useState<any>({})
  const [totalTimeOff, setTotalTimeOff] = useState<timeOffType>({ paid_leave: 0, unpaid_leave: 0 })

  const [coefficientSalary, setCoefficientSalary] = useState<(number | string)[]>([])
  const [totalAllTimeWork, setTotalAllTimeWork] = useState<number | any>(0)

  const systemSetting: any = useAtomValue(systemSettingAtom)
  let start_date = checkDateWeek(startDate, endDate, month).startviewDate
  let end_date = checkDateWeek(endDate, endDate, month).endviewDate


  // timesheet
  useQuery<TimekeepingResponse>(
    [
      `1.0/user/timekeeping/total-time-in-month`,
      { month: formatYearMonth(new Date(month).getMonth() + 1, new Date(month).getFullYear()) }
    ],
    {
      onSuccess: ({ total_time_work, total_paid_leave, total_unpaid_leave, total_time_ot }) => {
        setLoading(false)

        setCoefficientSalary(Object.keys(total_time_ot).sort((a: any, b: any) => a - b))

        setNumOfWorkingDays(total_time_work)

        setTotalOvertime(total_time_ot)

        setTotalTimeOff({
          paid_leave: total_paid_leave,
          unpaid_leave: total_unpaid_leave
        })
      }
    }
  )
  useQuery<TimkeepingResponseByDay>(
    [
      `1.0/user/timekeeping`,
      {
        start_date: start_date,
        end_date: end_date
      }
    ],
    {
      onSuccess: ({ data }) => {
        const result = lodash.groupBy(data, ({ date }: TimeSheetData) => date)
        setEvents(result)
        setLoading(false)
      },
      enabled: (start_date && end_date) !== ''
    }
  )
  useQuery<TimkeepingResponseByDay>(
    [
      `1.0/user/timekeeping`,
      {
        start_date: formatNormalDateV2(startOfMonth(new Date(month))),
        end_date: formatNormalDateV2(endOfMonth(new Date(month)))
      }
    ],
    {
      onSuccess: ({ data }) => {
        const result = lodash.groupBy(data, ({ date }: TimeSheetData) => date)
        setTotalActualWorkingDays(
          Object.values(result).reduce(
            (accumulator, currentValue) =>
              currentValue[0].total_time_work ? accumulator + 1 : accumulator + 0,
            0
          )
        )
      }
    }
  )

  const [checkStartOrEndTimeNull, setCheckStartOrEndTimeNull] =
    useState<checkStartOrEndTimeNullType>({
      start: false,
      end: false
    })

  const [hasForm, setHasForm] = useState<HasFormType>({
    leave_form_id: null,
    overtime_id: null,
    request_change_timesheet_id: null,
    compensatory_leave_id: null
  })

  const handleCheckHasForm = useMemo(
    () => async (date: string | Date) => {
      try {
        const res = await request.get(
          `1.0/user/timesheet/check-has-form-by-date/${formatDate(date, 'yyyy-MM-dd')}`
        )

        if (res.status == 200) {
          const { leave_form, overtime, request_change_timesheet, compensatory_leave } = res.data
          setHasForm((prev) => ({
            ...prev,
            leave_form_id: leave_form?.id,
            overtime_id: overtime?.id,
            request_change_timesheet_id: request_change_timesheet?.id,
            compensatory_leave_id: compensatory_leave?.id
          }))
          setTotalAllTimeWork(res.data.total_all_time_work)
        }
      } catch (error:any) {
        toast.error(error.message)
      }
    },
    []
  )

  const handleSelect = (event: TimeSheetData) => {
    if (event) {
      handleCheckHasForm(event.date)
      reset()

      setCheckStartOrEndTimeNull({
        start: event?.start_time ? false : true,
        end: event?.end_time ? false : true
      })

      let checkIn = convertDatetimeTZ(event?.start_time || event?.date, systemSetting.time_zone)
      let checkOut = convertDatetimeTZ(event?.end_time || event?.date, systemSetting.time_zone)

      if (checkIn !== undefined && isCheckDate(checkIn)) {
        setValue('check_in_time', formatDateTime(checkIn))
      }

      if (checkOut !== undefined && isCheckDate(checkOut)) {
        setValue('check_out_time', formatDateTime(checkOut))
      }

      setValue('total_time_work', event?.total_time_work ? event?.total_time_work : 0)
      setValue(
        'total_time_work_without_time_off',
        event?.total_time_work_without_time_off ? event?.total_time_work_without_time_off : 0
      )
      setValue('late_time', event?.late_time ? event.late_time : 0)
      setValue('time_early', event?.time_early ? event.time_early : 0)
      setValue('date', formatISODate(event?.date))
      if (Number(event?.id) != 0) {
        setValue('timesheet_id', Number(event?.id))
      }
      setValue('overtime', event.overtime)
      setValue('leave_form_has_timesheets', event.leave_form_has_timesheets)
      setValue('compensatory_leave_has_timesheet', event.compensatory_leave_has_timesheet)
      setValue('type', event.type)
    }
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
  }

  const [workingDays, setWorkingDays] = useState<WorkingDayData[]>()
  useQuery<WorkingDayResponse>([`1.0/user/working-day`], {
    onSuccess: (data) => {
      setWorkingDays(
        data.data.map((item) => {
          let total_time_work = floatDiffInMinutes(item.start_time, item.end_time)

          if (item.start_lunch_break && item.end_lunch_break) {
            total_time_work -= floatDiffInMinutes(item.start_lunch_break, item.end_lunch_break)
          }

          return { ...item, total_time_work }
        })
      )
    }
  })

  const [compensatoryWDs, setCompensatoryWDs] = useState<CompensatoryWorkingDayData[]>([])
  useQuery<DataResponse<CompensatoryWorkingDayData>>([`1.0/user/compensatory-working-day`], {
    onSuccess: (data) => {
      setCompensatoryWDs(
        data.data.map((item) => {
          let total_time_work = floatDiffInMinutes(item.start_time, item.end_time)

          if (item.start_lunch_break && item.end_lunch_break) {
            total_time_work -= floatDiffInMinutes(item.start_lunch_break, item.end_lunch_break)
          }

          return { ...item, total_time_work }
        })
      )
    }
  })

  const [openForm, setOpenForm] = useState(false)
  const [openFormCreate, setOpenFormCreate] = useState(false)
  const [idDetail, setIdDetail] = useState<number | null>()
  const [typeModal, setTypeForm] = useState<number>(0)
  const [typeModalCreate, setTypeModalCreate] = useState<number>(0)
  const [dateParams, setDateParams] = useState<string>('')
  const [idEdit, setIDEdit] = useState<number | null>()
  const [checkEditinModalDetail, setCheckEditinModalDetail] = useState<boolean | null>(false)
  const handleEditInModalDetai = () => {
    setCheckEditinModalDetail(true)
    setIDEdit(idDetail)
    setIdDetail(null)
    setOpenForm(false)
    setTypeModalCreate(typeModal)
    setOpenFormCreate(true)
  }
  const handleOnClickForm = (type_form: number) => {
    let link = '/applications/'
    const params = new URLSearchParams()

    switch (type_form) {
      case TYPE_FORM['LEAVE']:
        setOpenDialog(false)
        setTypeModalCreate(TYPE_FORM['LEAVE'])
        setOpenFormCreate(true)
        setDateParams(watch('date') as string)
        break
      case TYPE_FORM['OVERTIME']:
        setOpenDialog(false)
        if (hasForm.overtime_id) {
          setTypeForm(TYPE_FORM['OVERTIME'])
          setIdDetail(hasForm.overtime_id)
          setOpenForm(true)
        } else {
          setTypeModalCreate(TYPE_FORM['OVERTIME'])
          setOpenFormCreate(true)
          setDateParams(watch('date') as string)
        }
        break
      case TYPE_FORM['REQUEST_CHANGE_TIMESHEET']:
        setOpenDialog(false)
        if (hasForm.request_change_timesheet_id) {
          setTypeForm(TYPE_FORM['REQUEST_CHANGE_TIMESHEET'])
          setIdDetail(hasForm.request_change_timesheet_id)
          setOpenForm(true)
        } else {
          setTypeModalCreate(TYPE_FORM['REQUEST_CHANGE_TIMESHEET'])
          setOpenFormCreate(true)
          setDateParams(watch('date') as string)
        }
        break
      case TYPE_FORM['COMPENSATORY_LEAVE']:
        setOpenDialog(false)
        if (hasForm.compensatory_leave_id) {
          setTypeForm(TYPE_FORM['COMPENSATORY_LEAVE'])
          setIdDetail(hasForm.compensatory_leave_id)
          setOpenForm(true)
        } else {
          setTypeModalCreate(TYPE_FORM['COMPENSATORY_LEAVE'])
          setOpenFormCreate(true)
          setDateParams(watch('date') as string)
        }

        break
      default:
        break
    }
  }
  const closeModal = () => {
    setOpenDialog(!openDialog)
    setOpenForm(false)
    setOpenFormCreate(false)
    setDateParams('')
    setTypeForm(0)
    setIDEdit(null)
    setTypeModalCreate(0)
    setCheckEditinModalDetail(false)
  }
  const onSuccess = () => {
    setOpenFormCreate(false)
    setTypeForm(0)
    setCheckEditinModalDetail(false)
    setIDEdit(null)
    if (checkEditinModalDetail) {
      setTypeForm(typeModalCreate)
      setOpenForm(true)
      setIdDetail(idEdit)
      setIDEdit(null)
    }
  }
  const renderModalDetail = (
    typeForm: number,
    idDetail: number | null | undefined,
    openModal: boolean
  ) => {
    if (typeof typeModal === 'number') {
      switch (typeForm) {
        case TYPE_FORM['OVERTIME']:
          return (
            <ModalDetailOverTimeApplication
              open={openModal} // Hoặc openModal nếu bạn có sử dụng biến openModal
              idDetail={idDetail}
              handleEditInModalDetai={handleEditInModalDetai}
              closeModalDetail={closeModal}
            />
          )
        case TYPE_FORM['REQUEST_CHANGE_TIMESHEET']:
          return (
            <ModalDetailRequestChangeTimesheetApplication
              open={openModal} // Hoặc openModal nếu bạn có sử dụng biến openModal
              idDetail={idDetail}
              handleEdit={handleEditInModalDetai}
              handleClose={closeModal}
            />
          )
        case TYPE_FORM['COMPENSATORY_LEAVE']:
          return (
            <ModalDetailCompensatoryApplication
              open={openModal} // Hoặc openModal nếu bạn có sử dụng biến openModal
              idDetail={idDetail}
              handleEditInModalDetai={handleEditInModalDetai}
              closeModalDetail={closeModal}
            />
          )
      }
    }
  }
  const renderModalUpdate = (typeForm: number, dateParams: string, openModal: boolean) => {
    switch (typeForm) {
      case TYPE_FORM['LEAVE']:
        return (
          <ModalLeaveForm
            closeModalEdit={closeModal}
            open={openModal}
            dateParams={dateParams}
            onSuccess={onSuccess}
          />
        )
      case TYPE_FORM['OVERTIME']:
        return (
          <ModalOverTimeForm
            closeModalEdit={closeModal}
            open={openModal}
            idEdit={idEdit}
            dateParams={dateParams}
            onSuccess={onSuccess}
          />
        )
      case TYPE_FORM['REQUEST_CHANGE_TIMESHEET']:
        return (
          <ModalRequestChangeTimeSheet
            open={openModal}
            dateParams={dateParams}
            idEdit={idEdit}
            handleCloseModal={closeModal}
            onSuccessEdit={onSuccess}
          />
        )
      case TYPE_FORM['COMPENSATORY_LEAVE']:
        return (
          <ModalCompensatoryForm
            closeModalEdit={closeModal}
            checkInEdit={false}
            idEdit={idEdit}
            dateParams={dateParams}
            open={openModal}
            handleEditSuccess={onSuccess}
          />
        )
      default:
        return null
    }
  }


  return (
    <Pagev2 sx={{ padding: { xs: 1, sm: 2 } }}>
      <Grid container spacing={2} display="flex" justifyContent="flex-end">
        <Grid
          item
          xs={6}
          sm={8}
          md={10}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
        >
          <Typography
            sx={{
              ...styleTimesheetTitle
            }}
          >
            {t('timesheet.title')}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          {calendar}
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              ...styleOptionDayTimesheet
            }}
          >
            <Stack direction="row">
              <button
                onClick={handleBackWeek}
                style={{
                  color:
                    typeSheet === TYPE_TIME.MONTH ||
                    start_date === formatNormalDateV2(startOfMonth(new Date(month)))
                      ? '#ccc'
                      : 'black',
                  ...syleButtonSheet
                }}
                disabled={
                  true
                    ? typeSheet == TYPE_TIME.MONTH ||
                      start_date === formatNormalDateV2(startOfMonth(new Date(month)))
                    : false
                }
              >
                <ArrowBackIosNewIcon sx={{ ...styleIcon }} />
              </button>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {' '}
                <Typography sx={{ ...stylesDay }}>
                  {formatDate(start_date, systemSetting.format_date)} -{' '}
                  {formatDate(end_date, systemSetting.format_date)}
                </Typography>
              </Box>

              <button
                onClick={handleNextWeek}
                style={{
                  color:
                    typeSheet === TYPE_TIME.MONTH ||
                    end_date === formatNormalDateV2(endOfMonth(new Date(month)))
                      ? '#ccc'
                      : 'black',
                  ...syleButtonSheet
                }}
                disabled={
                  true
                    ? typeSheet == TYPE_TIME.MONTH ||
                      end_date === formatNormalDateV2(endOfMonth(new Date(month)))
                    : false
                }
              >
                <ArrowForwardIosIcon sx={{ ...styleIcon }} />
              </button>
            </Stack>
            <Stack direction="row" sx={{ ...optionTimeSheet }}>
              <ToggleButtonGroup exclusive size="small" sx={{ ...styleToggleButtonGroup }}>
                <ToggleButton
                  value="all"
                  sx={{ ...ButtonStyled }}
                  selected={typeSheet === TYPE_TIME.WEEK}
                  onClick={onWeekTimeSheet}
                >
                  <Typography sx={{ ...styleTextDayOrMonth }}>
                    {t('timesheet.time_weekV2')}
                  </Typography>
                </ToggleButton>

                <ToggleButton
                  value="unread"
                  sx={{ ...ButtonStyled }}
                  selected={typeSheet === TYPE_TIME.MONTH}
                  onClick={onMonthTimeSheet}
                >
                  <Typography sx={{ ...styleTextDayOrMonth }}>
                    {t('timesheet.time_monthV2')}
                  </Typography>
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Box>
        </Grid>
      </Grid>
      <>
        {loading && lodash.isEmpty(events) ? (
          <TableSkeleton {...skeletonConfig} />
        ) : (
          <React.Fragment>
            <TimeSheetCalendarTable
              events={events}
              startDate={startDate}
              month={month}
              workingDays={workingDays}
              type={typeSheet}
              endDate={endDate}
              onSelectEvent={handleSelect}
            />
            <Grid container sx={{ ...styleGridContainer }}>
              <Grid item lg={12} xs={12}>
                <Box
                  sx={{
                    ...syleBoxTimesheetColor
                  }}
                >
                  <TimesheetColorNote />
                </Box>
              </Grid>
            </Grid>
          </React.Fragment>
        )}
        <Grid container sx={{ width: '100%', marginTop: 3 }}>
          <WorkingTimeInMonth
            workingDays={workingDays}
            compensatoryWDs={compensatoryWDs}
            month={month}
            totalActualWorkingDays={totalActualWorkingDays}
            numOfWorkingDays={numOfWorkingDays}
            totalOvertime={totalOvertime}
            totalTimeOff={totalTimeOff}
          />

          <OverTimeInMonth coefficientSalary={coefficientSalary} totalOvertime={totalOvertime} />
        </Grid>
      </>

      <TimekeepingModal
        data={watch()}
        calendar={month}
        open={openDialog}
        handleClose={handleClose}
        checkStartOrEndTimeNull={checkStartOrEndTimeNull}
        handleOnClickForm={handleOnClickForm}
        totalAllTimeWork={totalAllTimeWork}
      />
      {renderModalDetail(typeModal, idDetail, openForm)}
      {renderModalUpdate(typeModalCreate, dateParams, openFormCreate)}
    </Pagev2>
  )
}
export const styleText = {
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '20px'
}
const styleTimesheetTitle = {
  textTransform: 'uppercase',
  fontWeight: 600,
  fontFamily: 'Lato',
  fontSize: { xs: '1rem', md: '1.5rem' },
  color: 'var(--primary-600, #146BD2)'
}
const styleGridContainer = {
  backgroundColor: 'white',
  padding: { xs: 2, md: 3 }
}
const styleOptionDayTimesheet = {
  display: 'flex',
  padding: { xs: '12px 4px', sm: 2 },
  justifyContent: 'space-between',
  backgroundColor: 'white',
  overflow: 'hidden',
  alignItems: 'center',
  '@media (max-width: 320px)': {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  }
}

const optionTimeSheet = {
  justifyContent: 'space-between'
}
const ButtonStyled = {
  '&.Mui-selected , &.Mui-selected:hover': {
    color: 'var(--primary-600, #146BD2)',
    backgroundColor: '#fff',
    boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10)'
  },
  width: { xs: '70px', sm: '112px' },
  padding: { sm: '6px 12px', xs: '6px 0' }
}
const styleTextDayOrMonth = {
  fontSize: { xs: '12px', md: '14px' },
  fontWeight: '500',
  textTransform: 'capitalize'
}
const syleBoxTimesheetColor = {
  display: 'flex',
  justifyContent: { lg: 'center' }
}
const styleToggleButtonGroup = {
  backgroundColor: '#f0f0f0',
  borderRadius: '8px',
  height: { xs: '35px', sm: '42px' },
  padding: '1px',

  '& .MuiToggleButtonGroup-grouped': {
    margin: 0.5,
    border: 0,

    '&.Mui-disabled': {
      border: 0
    },
    '&:not(:first-of-type)': {
      borderRadius: '8px'
    },
    '&:first-of-type': {
      borderRadius: '8px'
    },
    '&.Mui-selected': {
      backgroundColor: '#fff'
    }
  }
}

const styleIcon = {
  fontSize: { xs: '16px', md: '18px' }
}

const syleButtonSheet = {
  border: 'none',
  outline: 'none',
  padding: 0,
  cursor: 'pointer',
  margin: 0,
  display: 'flex',
  width: '20px',
  height: '20px',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent'
}

const stylesDay = {
  fontSize: { xs: '12px', lg: '18px' }
}
export { TimeSheetCalendar }

