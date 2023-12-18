import { styled } from '@mui/material'
import { green, red } from '@mui/material/colors'
import { DOT_TIMESHEET_TYPE, MANAGEMENT_TIMESHEET_TYPE, TIMESHEET_TYPE_TIME } from 'constants/timeSheetType'
import { isWeekend } from 'date-fns'
import { TimeSheetData, WorkingDayData } from 'lib/types/timeSheet'
import { isDayOff } from 'lib/utils/datetime'
import { Base, Orange, Red, Yellow, blueV2, greenV2, grey, orangeV2, violetV2 } from 'styles/colors'

export const bgColorMonth = (date: string | Date, workingDays: WorkingDayData[] | undefined) => {
    if (!isDayOff(date, workingDays)) {
        return blueV2[100]
    } else {
        return blueV2[20]
    }
}

export const bgColorMonth2 = (index: number) => {
    if (index % 2 !== 0) {
        return grey[200]
    } else {
        return grey[400]
    }
}

export const bgColorRowIndex = (index: number) => {
    if (index === 0) {
        return grey[200]
    }
}

export const rowIndex = (t: any) => [
    {
        label: ''
    },
    {
        label: t('timesheet.working_time')
    },
    {
        label: t('timesheet.overtime')
    },
    {
        label: t('timesheet.late_time')
    },
    {
        label: t('timesheet.time_early')
    },
    // {
    //   label: t('timesheet.total_overtime')
    // },
    {
        label: t('timesheet.total_working_time')
    }
]

export const colorDayName = (date: string | Date, workingDays: WorkingDayData[] | undefined) => {
    if (!isDayOff(date, workingDays)) {
        return red[200]
    } else {
        return 'undefined'
    }
}

export const colorDayName1 = (date: string | Date | any) => {
    if (isWeekend(date)) {
        return red[200]
    } else {
        return undefined
    }
}

export const bgColorDay = (isFuture: boolean, isNotOnDay: boolean) => {
    if (isFuture && isNotOnDay == false) {
        return grey[200]
    }
    if (isFuture && isNotOnDay) {
        return grey[400]
    } else {
        return 'undefined'
    }
}

export const bgColorDayName = (dayName: string, hasEvent: boolean) => {
    if (dayName === 'Sat' || dayName === 'Sun') {
        // return orange[50]
        return undefined
    } else if (!hasEvent) {
        return grey[300]
    }
}

// V2-bg
export const bgColorTimelineTypeTime = (event: TimeSheetData) => {
    if (event.type_time === TIMESHEET_TYPE_TIME['WORKING_TIME']) {
        if (event.type) {
            return 'undefined'
        }

        if (event?.leave_form?.is_salary || event?.compensatory_leave) {
            return greenV2[20]
        } else {
            return orangeV2[20]
        }
    } else {
        return violetV2[20]
    }
}

// V2-color
export const colorTimeLineTypeTime = (event: TimeSheetData) => {
    if (event.type_time === TIMESHEET_TYPE_TIME['WORKING_TIME']) {
        if (event.type) {
            return Base.black
        }
        if (event?.leave_form?.is_salary || event?.compensatory_leave) {
            return greenV2[50]
        } else {
            return orangeV2[50]
        }
    } else {
        return violetV2[50]
    }
}


export const bgColorTimeline = (type: number) => {
    if (type === DOT_TIMESHEET_TYPE.NORMAL) {
        return '#ffffff'
    } else if (type === DOT_TIMESHEET_TYPE.OVER_TIME) {
        return Red[200]
    } else if (type === DOT_TIMESHEET_TYPE.PAID_LEAVE) {
        return green[50]
        // return blue[10]
    } else {
        // return orange[100]
        return Orange[200]
    }
}

export const backgroundColorManagementTimeline = (type: number) => {
    let bgColorTimeline
    switch (type) {
        case MANAGEMENT_TIMESHEET_TYPE.HAFT_TIME:
            bgColorTimeline = Yellow[200]
            break
        case MANAGEMENT_TIMESHEET_TYPE.FULL_TIME:
            bgColorTimeline = green[200]
            break
        case MANAGEMENT_TIMESHEET_TYPE.ON_LEAVE:
            bgColorTimeline = grey[500]
            break
    }
    return bgColorTimeline
}

export const dotBeforeTitle = (type: number) => {
    let checkRoundTimeline
    switch (type) {
        case MANAGEMENT_TIMESHEET_TYPE.HAFT_TIME:
            checkRoundTimeline = Yellow[100]
            break
        case MANAGEMENT_TIMESHEET_TYPE.FULL_TIME:
            checkRoundTimeline = '#ffffff'
            break
        case MANAGEMENT_TIMESHEET_TYPE.ON_LEAVE:
            checkRoundTimeline = grey[500]
            break
    }
    return checkRoundTimeline
}

export const HolidayStyled = styled('span')({
    position: 'absolute',
    top: '-6px',
    right: '-10px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: Red['200']
})
