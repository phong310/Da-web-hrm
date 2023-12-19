import { FormControlProps, OutlinedInputProps } from '@mui/material'
import { FieldValues, useController, UseControllerProps, UseFormSetValue } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { AddControlProps, InputControl } from '../Components/InputControl'
import { InputStyled } from '../Components/InputStyled'

export type InputProps<T extends FieldValues> = UseControllerProps<T> &
  OutlinedInputProps &
  AddControlProps & {
    controlProps?: FormControlProps
    setValue: UseFormSetValue<any>
    name: string
  }

function MoneyInput<T extends FieldValues>({
  name,
  control,
  setValue,
  defaultValue,
  fullWidth,
  label,
  helperText,
  controlProps,
  required,
  ...props
}: InputProps<T>) {
  const {
    field: { ref, value, ...inputProps },
    fieldState: { error }
  } = useController({ name, control, defaultValue })

  const formatNumberWithCommas = (number: number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const [money, setMoney] = useState<any>(value || '')

  useEffect(() => {
    setMoney(value || '')
  }, [value])

  const handleChange = (e: any) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setMoney(value ? parseInt(value) : null)
    //@ts-ignore
    setValue(name, value ? parseInt(value) : '')
    inputProps.onChange(value)
  }

  return (
    <InputControl
      fieldError={error}
      fullWidth={fullWidth}
      label={label}
      required={required}
      helperText={helperText}
      {...controlProps}
    >
      <InputStyled
        {...inputProps}
        value={money !== null ? formatNumberWithCommas(money) : ''}
        {...props}
        inputRef={ref}
        onChange={handleChange}
        type="text"
        sx={{ ...styleInput }}
      />
    </InputControl>
  )
}

export const styleInput = {
  height: {
    xs: 38,
    sm: 42
  }
}


export { MoneyInput }
