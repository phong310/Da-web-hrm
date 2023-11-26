import {
  Autocomplete,
  CircularProgress,
  FormControlProps,
  IconButton,
  InputAdornment,
  OutlinedInputProps,
  Stack
} from '@mui/material'
import React, { SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FieldValues, useController, UseControllerProps } from 'react-hook-form'
import { makeStyles } from '@mui/styles'
// import { styleInput } from '../Input/v2/common'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { checkHasRole } from 'constants/roles'
import { useAuth } from 'lib/hook/useAth'
import { UnknownObj } from 'lib/types/utils'
import { useSelectQuery } from 'lib/hook/useSelectQuery'
import { AddControlProps, InputControl } from '../Components/InputControl'
import { Tag } from '../Components/Tag'
import { InputStyled } from '../Components/InputStyled'
export type SelectOption = {
  label: string
  value: unknown
}

export type SelectQueryProps<T extends UnknownObj> = {
  query?: string
  queryFilter?: string
  addQueryFilter?: UnknownObj
  labelValueKeys?: [keyof T, keyof T]
  children?: React.ReactChild | React.ReactFragment | React.ReactPortal | React.ReactNode
}

export type LabelValueType<T> = [keyof T, keyof T]

export type BaseSelectProps<T, F extends FieldValues> = UseControllerProps<F> &
  AddControlProps &
  OutlinedInputProps & {
    controlProps?: FormControlProps
    options?: SelectOption[]
    multiple?: boolean
    loading?: boolean
    labelValueKeys?: LabelValueType<T>
    setInputState?: (value: string) => void
    onAddOptions?: (type?: string | undefined) => void
    isAddOption?: boolean
  }
const useStyles = makeStyles({
  paper: {
    fontSize: '14px',
    '@media screen and (min-width: 600px)': {
      fontSize: '16px'
    }
  },
  customIconButton: {
    '&:hover': {
      backgroundColor: 'transparent !important' // Đặt màu nền khi hover thành trong suốt
    }
  }
})

export type SelectProps<T extends UnknownObj, F extends FieldValues> = BaseSelectProps<T, F> &
  SelectQueryProps<T>

const defaultKey = ['name', 'id']

function Select<T extends UnknownObj, F extends FieldValues = any>({
  onAddOptions,
  isAddOption = false,
  name,
  control,
  defaultValue,
  fullWidth,
  label,
  helperText,
  controlProps,
  options: rawOptions,
  multiple,
  loading,
  disabled,
  query,
  required,
  queryFilter,
  addQueryFilter,
  labelValueKeys = defaultKey as LabelValueType<T>,
  setInputState,
  ...props
}: SelectProps<T, F>) {
  const {
    field: { ref, onChange, onBlur, value: rawValue },
    fieldState: { error }
  } = useController({ name, control, defaultValue })

  const [inputValue, setInputValue] = useState('')
  const { role } = useAuth()

  const queryParams = useMemo(() => {
    if (!queryFilter && !addQueryFilter) return { per_page: -1 }
    const inputParams = inputValue && queryFilter ? { [queryFilter]: inputValue } : undefined

    return { per_page: -1, ...inputParams, ...addQueryFilter }
  }, [addQueryFilter, inputValue, queryFilter])

  const { options: queryOptions, isLoading } = useSelectQuery<T>({
    endpoint: query,
    params: queryParams,
    labelValueKeys: labelValueKeys as [keyof T, keyof T],
    enabled: !!query
  })

  const filterValue = useCallback(
    (value: unknown | unknown[]) => {
      const _options = query ? queryOptions : rawOptions

      if (!_options) {
        return multiple ? [] : null
      }

      if (multiple) {
        return (
          _options.filter(
            (option) => ((value as unknown[]) || []).findIndex((el) => el === option.value) !== -1
          ) || []
        )
      }

      return _options.find((option) => option.value === value) || null
    },
    [query, queryOptions, rawOptions, multiple]
    // []
  )

  const [value, setValue] = useState<SelectOption | SelectOption[] | null>(null)

  useEffect(() => {
    setValue(filterValue(rawValue))
  }, [rawValue, filterValue, multiple])

  const handleChangeValue = (
    e: SyntheticEvent<Element, Event>,
    newValue: SelectOption | SelectOption[] | null
  ) => {
    if (!newValue) {
      return
    }
    if (multiple) {
      const _value = (newValue as SelectOption[]).map((option) => option.value)
      onChange(_value)
    } else {
      onChange((newValue as SelectOption).value)
      setInputValue((newValue as SelectOption).label)

      setInputState && setInputState((newValue as SelectOption).label)
    }

    setValue(newValue)
  }

  const handleChangeInputValue = (e: SyntheticEvent<Element, Event>, newValue: string) => {
    setInputValue(newValue)
    setInputState && setInputState(newValue)
    if (!newValue) {
      onChange('')
    }
  }
  const selectRef = useRef<HTMLDivElement | null>(null)

  const handleSelectClick = () => {
    if (selectRef.current) {
      selectRef.current.blur() // Ngăn focus
    }
  }
  const classes = useStyles()
  return (
    <Stack flexDirection="row" alignItems="center">
      <InputControl
        fieldError={error}
        fullWidth={fullWidth}
        label={label}
        required={required}
        helperText={helperText}
        {...controlProps}
      >
        <Autocomplete
          value={value}
          inputValue={inputValue}
          onChange={handleChangeValue}
          onInputChange={handleChangeInputValue}
          multiple={multiple}
          onBlur={onBlur}
          tabIndex={-1}
          ListboxProps={{
            style: {
              maxHeight: 180,
              overflowY: 'auto'
            }
          }}
          classes={{ paper: classes.paper }}
          sx={{
            '.MuiInputBase-input': {
              height: 8,
              fontSize: { xs: '14px', sm: '16px' }
            }
          }}
          ref={selectRef}
          loading={loading || isLoading}
          disablePortal
          options={rawOptions || queryOptions}
          isOptionEqualToValue={(options, value) => options.value === value.value}
          disabled={disabled}
          onClick={handleSelectClick}
          renderInput={(params) => (
            <InputStyled
            //   sx={{ ...styleInput }}
              fullWidth
              disabled={disabled}
              {...params.InputProps}
              inputProps={{
                ...params.inputProps
              }}
              endAdornment={
                <InputAdornment position="end">
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </InputAdornment>
              }
              {...props}
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option: SelectOption, index: number) => (
              <Tag label={option.label} {...getTagProps({ index })} key={index} tabIndex={-1} />
            ))
          }
        />
      </InputControl>
      {isAddOption && checkHasRole('admin', role) && (
        <IconButton
          className={classes.customIconButton}
          onClick={() => onAddOptions && onAddOptions('default')}
        >
          <AddCircleOutlineIcon sx={{ color: '#c4c4c4', mt: 3 }} />
        </IconButton>
      )}
    </Stack>
  )
}

export { Select }
