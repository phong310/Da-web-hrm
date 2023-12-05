import { DateRangePicker as DateRangePickerMui, DateRangePickerProps } from '@mui/lab'
import { DateRange } from '@mui/lab/DateRangePicker'
// import { MuiTextFieldProps } from '@mui/lab/internal/pickers/PureDateInput'
import { FormControlProps, Stack, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { MuiTextFieldProps } from '@mui/x-date-pickers/internals/components/PureDateInput'
import { parseISO } from 'date-fns'
import { FieldValues, useController, UseControllerProps } from 'react-hook-form'
import { AddControlProps, InputControl } from '../Components/InputControl'
import { formatISODate } from 'lib/utils/format'

type ControlProps = AddControlProps & {
  controlProps?: FormControlProps
  fullWidth?: boolean
}

type TextFieldProps = {
  textFieldProps?: MuiTextFieldProps
}

export type DateRangePickerType<T extends FieldValues> = UseControllerProps<T> &
  ControlProps &
  TextFieldProps &
  Omit<DateRangePickerProps, 'renderInput' | 'onChange' | 'value'>

function DateRangePicker<T extends FieldValues>({
  name,
  control,
  defaultValue,
  label,
  helperText,
  fullWidth,
  controlProps,
  textFieldProps,
  ...props
}: DateRangePickerType<T>) {
  const {
    field: { onChange, value, ref, ...inputProps },
    fieldState: { error: fieldError }
  } = useController({ name, control, defaultValue })

  const handleChange = (newValue: DateRange<Date>) => {
    onChange(
      newValue.map((d) => (d instanceof Date ? formatISODate(d) : formatISODate(new Date())))
    )
  }

  return (
    <InputControl
      fieldError={fieldError}
      fullWidth={fullWidth}
      label={label}
      helperText={helperText}
      {...controlProps}
    >
      <DateRangePickerMui
        {...props}
        {...inputProps}
        calendars={1}
        inputFormat="yyyy/MM/dd"
        mask="____-__-__"
        value={[
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore: Unreachable code error
          (value as string[])?.at(0) ? parseISO((value as string[])[0]) : null,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore: Unreachable code error
          (value as string[])?.at(1) ? parseISO((value as string[])[1]) : null
        ]}
        onChange={handleChange}
        inputRef={ref}
        renderInput={(startProps: any, endProps: any) => (
          <Stack direction="row" alignItems="center">
            <TextField
              {...startProps}
              {...textFieldProps}
              label={null}
              InputLabelProps={{ shrink: false }}
            />
            <Box sx={{ mx: 0.5 }}> To </Box>
            <TextField
              {...endProps}
              {...textFieldProps}
              label={null}
              InputLabelProps={{ shrink: false }}
            />
          </Stack>
        )}
      />
    </InputControl>
  )
}

export { DateRangePicker }
