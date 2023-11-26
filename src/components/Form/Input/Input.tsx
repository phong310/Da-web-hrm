import { FormControlProps, OutlinedInputProps } from '@mui/material'
import { FieldValues, useController, UseControllerProps } from 'react-hook-form'
import { AddControlProps, InputControl } from '../Components/InputControl'
import { InputStyled } from '../Components/InputStyled'
export type InputProps<T extends FieldValues> = UseControllerProps<T> &
  OutlinedInputProps &
  AddControlProps & {
    controlProps?: FormControlProps
  }

function Input<T extends FieldValues>({
  name,
  control,
  defaultValue,
  fullWidth,
  label,
  helperText,
  controlProps,
  required,
  ...props
}: InputProps<T>) {
  const {
    field: { ref, ...inputProps },
    fieldState: { error }
  } = useController({ name, control, defaultValue })

  return (
    <InputControl
      fieldError={error}
      fullWidth={fullWidth}
      label={label}
      required={required}
      helperText={helperText}
      {...controlProps}
    >
      <InputStyled {...inputProps} {...props} inputRef={ref} />
    </InputControl>
  )
}

export { Input }
