import { FormControlProps, OutlinedInputProps } from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import { FieldValues, useController, UseControllerProps } from 'react-hook-form'
import { Key } from 'react'
import { AddControlProps, InputControl } from '../Components/InputControl'

export type RadioProps<T extends FieldValues> = UseControllerProps<T> &
  OutlinedInputProps &
  AddControlProps & {
    controlProps?: FormControlProps
  } & { options: Array<{ value: number; label: string }> }

function RadioComponent<T extends FieldValues>({
  name,
  control,
  defaultValue,
  fullWidth,
  label,
  helperText,
  controlProps,
  options,
  ...props
}: RadioProps<T>) {
  const {
    field: { ref, ...inputProps },
    fieldState: { error }
  } = useController({ name, control, defaultValue })

  return (
    <InputControl
      fieldError={error}
      fullWidth={fullWidth}
      label={label}
      helperText={helperText}
      {...controlProps}
    >
      <RadioGroup
        {...inputProps}
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        {options.map((o: { value: number; label: string }, index: Key | null | undefined) => {
          return (
            <FormControlLabel value={o.value} control={<Radio />} label={o.label} key={index} />
          )
        })}
      </RadioGroup>
    </InputControl>
  )
}

export { RadioComponent }
