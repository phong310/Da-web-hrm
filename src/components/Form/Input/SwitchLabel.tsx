import { FormControlProps, OutlinedInputProps } from '@mui/material'
import Switch, { SwitchProps } from '@mui/material/Switch'
import { FieldValues, useController, UseControllerProps } from 'react-hook-form'
import FormControlLabel from '@mui/material/FormControlLabel'
import { AddControlProps } from '../Components/InputControl'

export type SwitchPropsCustom<T extends FieldValues> = UseControllerProps<T> &
  OutlinedInputProps &
  AddControlProps & {
    controlProps?: FormControlProps
    initValue?: boolean
  }

function SwitchLabel<T extends FieldValues>({
  name,
  control,
  defaultValue,
  label,
  ...props
}: SwitchPropsCustom<T>) {
  const {
    field: { ref, ...inputProps },
    fieldState: { error }
  } = useController({ name, control, defaultValue })
  return (
    <FormControlLabel
      control={<Switch {...inputProps} {...(props as SwitchProps)} inputRef={ref} />}
      label={label}
      sx={{ ...styleFormControlLabel }}
      // {...props}
    />
  )
}

const styleFormControlLabel = {
  color: '#000'
}

export { SwitchLabel }
