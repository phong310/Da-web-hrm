import { FormControl, FormControlProps, Stack, styled, TextField } from '@mui/material'
import { DatePicker as MuiXDatePicker, DatePickerProps, TimePickerProps } from '@mui/x-date-pickers'
// import { useAuth } from 'lib/hooks'
// import { formatDate, formatDateTime, formatTime } from 'lib/utils'
import { FieldValues, useController, UseControllerProps } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { AddControlProps, InputControl } from '../Components/InputControl'
import { useAuth } from 'lib/hook/useAuth'
import { formatDate, formatDateTime, formatTime } from 'lib/utils/format'
// import { AddControlProps, InputControl } from '..'

type ControlProps = AddControlProps & {
  controlProps?: FormControlProps
  fullWidth?: boolean
  disableAll?: boolean
}

type DateTimePickerType<T extends FieldValues, F> = UseControllerProps<T> &
  ControlProps &
  Omit<TimePickerProps<T, F>, 'renderInput' | 'onChange' | 'value'> &
  Omit<DatePickerProps<T, F>, 'renderInput' | 'onChange' | 'value'>

function DateTimePickerSeparate<T extends FieldValues, F>({
  name,
  control,
  defaultValue,
  label,
  helperText,
  fullWidth,
  controlProps,
  disableAll = false,
  ...props
}: DateTimePickerType<T, F>) {
  const {
    field: { onChange, value, ref, ...inputProps },
    fieldState: { error: fieldError }
  } = useController({ name, control, defaultValue })
  const { systemSetting } = useAuth()
  const { t } = useTranslation()
  const handleChange = (newValue: unknown) => {
    onChange(formatDateTime(newValue as Date))
  }

  const handleChangeTime = (e: any) => {
    const date = formatDate(value as string, 'yyyy/MM/dd')

    onChange(formatDateTime(date + ' ' + e.target.value))
  }

  return (
    <InputControl
      fieldError={fieldError}
      fullWidth={fullWidth}
      label={label}
      helperText={helperText}
      {...controlProps}
    >
      <Stack direction="row" spacing={1}>
        <FormControl fullWidth>
          <MuiXDatePicker
            onOpen={() => {
              setTimeout(() => {
                const ok = document.querySelectorAll('.MuiButton-root') as unknown as Element[]
                const selectDate = document.querySelectorAll(
                  '.MuiTypography-root '
                ) as unknown as Element[]
                if (ok) {
                  ok.forEach((e) => {
                    if (e.innerHTML.toLowerCase() === 'ok') {
                      e.innerHTML = `${t('button.ok')}`
                    }
                    if (e.innerHTML.toLowerCase() === 'cancel') {
                      e.innerHTML = `${t('button.cancel')}`
                    }
                  })
                }
                if (selectDate) {
                  selectDate.forEach((e) => {
                    if (e.innerHTML.toLowerCase() === 'select date') {
                      e.innerHTML = `${t('application_form.select_date')}`
                    }
                  })
                }
              }, 0)
            }}
            disabled={disableAll}
            {...props}
            {...inputProps}
            inputFormat={systemSetting?.format_date || 'dd/MM/yyyy'}
            value={value ? value : null}
            onChange={handleChange}
            inputRef={ref}
            renderInput={(params) => (
              <StyledTextField
                {...params}
                inputProps={{
                  ...params.inputProps,
                  readOnly: true
                }}
              />
            )}
            PopperProps={{
              sx: {
                '.css-27fwfg-MuiPickersCalendarHeader-labelContainer': {
                  fontSize: '15px'
                }
              }
            }}
          />
        </FormControl>
        <FormControl fullWidth>
          <StyledTextField
            disabled={disableAll}
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
          />
        </FormControl>
      </Stack>
    </InputControl>
  )
}

export { DateTimePickerSeparate }

const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-input {
    cursor: text;
  }
  && {
    .MuiOutlinedInput-root {
      height: 42px; /* V2 DateTime Leave Form */
    }
  }
  @media (max-width: 600px) {
    /* xs screen */
    && {
      .MuiOutlinedInput-root {
        height: 38px; /* Set height for xs screen */
        font-size: 14px;
      }
    }
  }

  @media (min-width: 601px) {
    /* sm screen */
    && {
      .MuiOutlinedInput-root {
        height: 42px; /* Set height for sm screen */
        font-size: 16px;
      }
    }
  }
`
