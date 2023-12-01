import CancelIcon from '@mui/icons-material/Cancel'
import { FormControlProps, IconButton, SxProps, TextField, Theme } from '@mui/material'
import { ResponsiveStyleValue } from '@mui/system'
import { OverridableStringUnion } from '@mui/types'
import { DatePickerProps, DatePicker as MuiXDatePicker } from '@mui/x-date-pickers'
import { useAuth } from 'lib/hook/useAth'
import { formatISODate } from 'lib/utils/format'
import React, { useEffect, useRef, useState } from 'react'
import { FieldValues, useController, UseControllerProps } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { AddControlProps, InputControl } from '../Components/InputControl'

type ControlProps = AddControlProps & {
  controlProps?: FormControlProps
  fullWidth?: boolean | ResponsiveStyleValue<boolean>
  sx?: SxProps<Theme>
  size?: OverridableStringUnion<'small' | 'medium'>
  readOnly?: boolean
  required?: boolean
  hasOnClear?: boolean
}

export type DatePickerType<T extends FieldValues, F extends FieldValues> = UseControllerProps<T> &
  ControlProps &
  Omit<DatePickerProps<T, F>, 'renderInput' | 'onChange' | 'value'> & {
    required?: boolean
  }

function DatePicker<T extends FieldValues, F extends FieldValues>({
  name,
  control,
  defaultValue,
  label,
  sx,
  helperText,
  fullWidth,
  views,
  size,
  controlProps,

  readOnly = true,
  required = false,
  hasOnClear = false,
  ...props
}: DatePickerType<T, F>) {
  const { t } = useTranslation()
  const {
    field: { onChange, value, ref, ...inputProps },
    fieldState: { error: fieldError }
  } = useController({ name, control, defaultValue })
  const { systemSetting } = useAuth()

  const handleChange = (newValue: any) => {
    onChange(formatISODate(newValue as Date | string))
  }
  //@ts-ignore
  const handleInputFormat = (views: readonly DatePickerView[] | undefined ) => {
    let inforFormat = systemSetting?.format_date
    views?.find((view) => view == 'year') ? (inforFormat = 'yyyy') : ''
    views?.find((view) => view == 'month') ? (inforFormat = 'yyyy-MM') : ''
    views?.find((view) => view == 'day') ? (inforFormat = 'dd/MM') : ''
    // views.find((view) => view == '') ? setInputFormat('yyyy/MM/dd') : ''
    return inforFormat
  }

  //@ts-ignore
  const handleMask = (views: readonly DatePickerView[] | undefined) => {
    let mask = '____-__-__'
    views?.find((view) => view == 'year') ? (mask = '____') : ''
    views?.find((view) => view == 'month') ? (mask = '____-__') : ''
    views?.find((view) => view == 'day') ? (mask = '__-__') : ''
    // views.find((view) => view == '') ? setInputFormat('yyyy/MM/dd') : ''
    return mask
  }

  const datePickerRef = useRef<HTMLDivElement>(document.createElement('div'))
  const [topIconCancel, setTopIconCancel] = useState<string>('')
  useEffect(() => {
    if (hasOnClear) {
      const parentEl = datePickerRef.current.parentElement

      if (parentEl) {
        const helperTextEl = parentEl.querySelector('.MuiFormHelperText-root')
        const helperTextElHeight = helperTextEl?.clientHeight || 20
        setTopIconCancel(
          label && !fieldError
            ? 'calc(50% + 12px)'
            : fieldError
            ? `calc(50% + 12px - ${helperTextElHeight / 2}px)`
            : '50%'
        )
      }
    }
  }, [fieldError, hasOnClear, label, topIconCancel, value])

  return (
    <InputControl
      required={required}
      fieldError={fieldError}
      fullWidth={fullWidth as boolean}
      label={label}
      helperText={helperText}
      onKeyDown={(e) => {
        e.preventDefault()
      }}
      {...controlProps}
    >
      <MuiXDatePicker
        ref={datePickerRef}
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
        {...props}
        {...inputProps}
        views={views}
        inputFormat={handleInputFormat(views)}
        mask={handleMask(views)}
        value={value ? value : defaultValue ? defaultValue : null}
        onChange={handleChange}
        inputRef={ref}
        renderInput={(params:any) => (
          <React.Fragment>
            <TextField
              sx={{
                '& .MuiOutlinedInput-input': {
                  cursor: 'auto',
                  fontSize: { xs: '14px', sm: '16px' }
                },
                '& .MuiOutlinedInput-root': {
                  height: '40px'
                },

                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: fieldError ? 'error.main' : 'rgba(0, 0, 0, 0.23)'
                },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: fieldError ? 'error.main' : 'primary.main'
                },
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: fieldError ? 'error.main' : 'inherit'
                },
                ...sx
              }}
              size={size}
              {...params}
              inputProps={{
                ...params.inputProps,
                readOnly
              }}
            />
            {hasOnClear && value && !props.disabled && (
              <IconButton
                style={{
                  position: 'absolute',
                  top: topIconCancel,
                  right: '36px',
                  transform: 'translateY(-50%)',
                  zIndex: 100
                }}
                onClick={() => onChange(null)}
              >
                <CancelIcon sx={{ width: '20px', height: '20px' }} />
              </IconButton>
            )}
          </React.Fragment>
        )}
        PopperProps={{
          placement: 'bottom-end'
        }}
      />
    </InputControl>
  )
}

export { DatePicker }
