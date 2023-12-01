//@ts-nocheck
import { TimePickerProps } from '@mui/lab'
import { FormControl, FormControlProps, Stack, TextField, TextFieldProps } from '@mui/material'
import { useController, UseControllerProps } from 'react-hook-form'
import { AddControlProps, InputControl } from '../Components/InputControl'
import { useAuth } from 'lib/hook/useAth'
import { convertLocalDatetimeToTZ, formatDate, formatDateTime, formatTime } from 'lib/utils/format'

type ControlProps = AddControlProps & {
  controlProps?: FormControlProps
  fullWidth?: boolean
  required?: boolean
  size?: TextFieldProps['size']
}

type DateTimePickerType<T> = UseControllerProps<T> &
  ControlProps &
  Omit<TimePickerProps, 'renderInput' | 'onChange' | 'value'>

function TimePicker<T>({
  name,
  control,
  defaultValue,
  label,
  helperText,
  fullWidth,
  required = false,
  controlProps,
  size,
  ...props
}: DateTimePickerType<T>) {
  const {
    field: { onChange, value, ref, ...inputProps },
    fieldState: { error: fieldError }
  } = useController({ name, control, defaultValue })
  const { systemSetting } = useAuth()

  const setTimeInit = (value: any) => {
    return new Date('2020-01-01 ' + value)
  }

  const handleChangeTime = (e: any) => {
    let updatedValue = value

    if (!updatedValue) {
      updatedValue = formatDateTime(convertLocalDatetimeToTZ(new Date()))
    }

    const date = formatDate(updatedValue as string, 'yyyy/MM/dd')
    onChange(formatDateTime(date + ' ' + e.target.value))
  }

  return (
    <InputControl
      required={required}
      fieldError={fieldError}
      fullWidth={fullWidth}
      label={label}
      helperText={helperText}
      {...controlProps}
    >
      <Stack direction="row" spacing={1}>
        <FormControl fullWidth>
          <TextField
            {...props}
            size={size}
            type="time"
            variant="outlined"
            value={value ? formatTime(value as string) : null}
            InputLabelProps={{
              shrink: true
            }}
            onChange={handleChangeTime}
            inputProps={{
              step: 300 // 5 min
            }}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-input': {
                cursor: 'text',
                fontSize: { xs: '14px', sm: '16px' }
              },
              '& input[type="time"]::-webkit-calendar-picker-indicator': {
                cursor: 'pointer'
              },
              '.MuiInputBase-root': {
                height: { xs: '38px', sm: '42px' }
              }
            }}
          />
        </FormControl>
      </Stack>
    </InputControl>
  )
}

export { TimePicker }
