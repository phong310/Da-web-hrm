// @ts-nocheck
import CancelIcon from '@mui/icons-material/Cancel'
import {
  Chip,
  FormControlProps,
  MenuItem,
  MenuProps,
  OutlinedInput,
  Select,
  SelectProps
} from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { FieldValues, useController, UseControllerProps } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { AddControlProps, InputControl } from '../Components/InputControl'

type OptionType = {
  label: string
  value: unknown
}

export type MultiSelectType<T extends FieldValues> = UseControllerProps<T> &
  Omit<SelectProps, 'value' | 'input' | 'renderValue'> &
  AddControlProps & {
    controlProps?: FormControlProps
    menuProps?: MenuProps
    options: OptionType[]
    required?: boolean
  }

function MultiSelect<T extends FieldValues, F = number>({
  name,
  control,
  defaultValue,
  label,
  helperText,
  fullWidth,
  options,
  controlProps,
  menuProps,
  placeholder,
  required = false,
  ...props
}: MultiSelectType<T>) {
  const {
    field: { onChange, value, ref, ...inputProps },
    fieldState: { error: fieldError }
  } = useController({ name, control, defaultValue })

  const { t } = useTranslation()
  const [newOptions, setNewOptions] = useState<OptionType[]>(options)

  const handleChange = (newValue: any) => {
    if (newValue.target.value.includes('all')) {
      onChange(options.map((option) => option.value))
      handleClose()

      return
    }
    onChange(newValue as F[])
  }

  const handleDelete = (Deletingvalue: unknown) => {
    const newValue = (value as F[]).filter((e) => e !== Deletingvalue)
    onChange(newValue as F[])
  }

  useEffect(() => {
    setNewOptions([...options, { label: t('all'), value: 'all' }])
  }, [options, t])

  const [isOpenOptions, setIsOpenOptions] = useState(false)

  const handleClose = () => {
    setIsOpenOptions(false)
  }

  const handleOpen = () => {
    setIsOpenOptions(true)
  }

  return (
    <InputControl
      fieldError={fieldError}
      fullWidth={fullWidth}
      label={label}
      helperText={helperText}
      required={required}
      {...controlProps}
      placeholder={placeholder}
    >
      <Select
        {...props}
        multiple
        open={isOpenOptions}
        onClose={handleClose}
        onOpen={handleOpen}
        value={value ? value : []}
        onChange={handleChange}
        input={<OutlinedInput />}
        ref={ref}
        placeholder={placeholder}
        MenuProps={{
          style: {
            maxHeight: 250
          },
          ...menuProps
        }}
        sx={{
          '& .MuiSelect-select .notranslate::after': placeholder
            ? {
                content: `"${placeholder}"`,
                opacity: 0.42
              }
            : {}
        }}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {(selected as F[]).map((selectedValue) => {
              const selectedOpt = options.find((e) => e.value === selectedValue)

              return (
                selectedOpt && (
                  <Chip
                    size="small"
                    key={selectedOpt.value as unknown as string}
                    label={selectedOpt.label}
                    deleteIcon={<CancelIcon onMouseDown={(event) => event.stopPropagation()} />}
                    onDelete={() => handleDelete(selectedValue)}
                  />
                )
              )
            })}
          </Box>
        )}
      >
        {newOptions.map((option) => (
          <MenuItem key={option.label} value={option.value as unknown as number | string}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </InputControl>
  )
}

export { MultiSelect }
