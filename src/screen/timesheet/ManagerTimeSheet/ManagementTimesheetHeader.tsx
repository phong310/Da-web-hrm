import { Box, Stack } from '@mui/material'
import { DatePicker } from 'components/Form/Input/DatePicker'
import { formatDateTime } from 'lib/utils/format'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
interface ManagementTimesheetHeaderProps {
  onChangeTime: any
  hasColorNote?: boolean
}

export const ManagementTimesheetHeader = ({
  onChangeTime,
  hasColorNote
}: ManagementTimesheetHeaderProps) => {
  const { control, handleSubmit, setValue, watch, getValues, setError } = useForm({
    defaultValues: {
      month: formatDateTime(new Date())
    }
  })
  const { t } = useTranslation()

  useEffect(() => {
    onChangeTime(watch('month'))
  }, [watch('month')])
  const styleHeader = {
    height: '100%',
    flexDirection: {
      xs: 'column',
      sm: 'row'
    },
    alignItems: {
      xs: 'start',
      sm: 'center'
    }
  }
  return (
    <Stack
      direction="row"
      gap={2}
      sx={{
        ...styleHeader
      }}
    >
      {/* {hasColorNote && <TimesheetColorNote />} */}
      <Box sx={{ width: { md: 250, xs: '100%' } }}>
        <DatePicker
          fullWidth
          name="month"
          sx={{
            '.MuiInputBase-root': {
              backgroundColor: 'white'
            }
          }}
          views={['year', 'month']}
          maxDate={new Date()}
          control={control}
          defaultValue={formatDateTime(new Date())}
          size="small"
        />
      </Box>
    </Stack>
  )
}
