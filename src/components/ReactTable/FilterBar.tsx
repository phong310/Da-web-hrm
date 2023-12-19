//@ts-nocheck
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SearchSharpIcon from '@mui/icons-material/SearchSharp'
import { Box, BoxProps, Grid, GridTypeMap } from '@mui/material'
import { styled } from '@mui/system'
import debounce from 'lodash/debounce'
import { memo, useCallback, useEffect, useMemo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { Column } from 'react-table'
import { Select, SelectProps } from 'components/Form/Autocomplete/Select'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
import { DatePicker, DatePickerType } from 'components/Form/Input/DatePicker'
import { DateRangePicker, DateRangePickerType } from 'components/Form/Input/DateRangePicker'
import { Input, InputProps } from 'components/Form/Input/Input'
import { useAtom } from 'jotai'
import { searchParamsAtom } from 'lib/atom/searchAtom'
import { UnknownObj } from 'lib/types/utils'
import { dayAfterOneYear } from 'lib/utils/datetime'
import { formatYearMonth } from 'lib/utils/format'
import { snakeToCamel } from 'lib/utils/misc'
import { SwitchLabel } from 'components/Form/Input/SwitchLabel'

export type FilterBarColumn = {
  regex?: '_like' | '_equal' | '_between' | '_notEqual' | '_isnull' | 'has_' | 'none'
  queryKey?: string | any
  searchType?:
    | 'select'
    | 'text'
    | 'time-range-picker'
    | 'timepicker'
    | 'date-picker'
    | 'month-picker'
    | 'switch'
  additionSearchProps?: Partial<SelectProps<UnknownObj, UnknownObj> | InputProps<UnknownObj>>
  search?: boolean
  grid?: GridTypeMap
}


export type FilterBarProps<T extends UnknownObj> = BoxProps<
  'div',
  {
    searchColumns: Column<T>[]
    handleChangeParams: (params: UnknownObj) => void
    watchMode?: boolean
    loading?: boolean
    isUrlExpiring?: boolean
    isUrlMonth?: boolean
    onClickExpandFil: () => void
    setIsUrlExpiring?: (isUrlExpiring: boolean) => void
    setIsUrlMonth?: (isUrlMonth: boolean) => void
  }
>

const convertRelationship = (accessor = '') => {
  const arr = accessor.split('.')
  return [snakeToCamel(arr[0]), arr[1]].join(':')
}

const convertParamKey = (accessor = ''): string => {
  // Replace all array key
  const _accessor = accessor.replace(/\[[^\]]*\]/g, '')
  const name = _accessor.includes('.') ? convertRelationship(_accessor) : accessor
  return name
}

function FilterBarComponent<T extends UnknownObj>({
  isUrlExpiring,
  isUrlMonth,
  handleChangeParams,
  setIsUrlExpiring,
  setIsUrlMonth,
  searchColumns,
  loading,
  onClickExpandFil,
  watchMode
}: FilterBarProps<T>) {
  const { control, handleSubmit, watch, reset, setValue, getValues } = useForm<UnknownObj>({
    defaultValues: searchColumns.reduce((df, cur) => {
      ;(df as UnknownObj)[convertParamKey(cur['accessor'] as string)] = ''
      return df
    }, {})
  })

  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [searchAtom, setSearchParams] = useAtom(searchParamsAtom)
  const getSearchObj = useCallback(
    (key: string) => {
      return searchColumns.find((el) => convertParamKey(el.accessor as string) === key)
    },
    [searchColumns]
  )
  const getQueryParams = useCallback(
    (values: UnknownObj) => {
      const params = Object.keys(values).reduce<UnknownObj>((_params, cur) => {
        if (values[cur] || values[cur] === 0) {
          const searchObj = getSearchObj(cur)
          const _regex = searchObj?.regex || '_like'
          const regex = _regex === 'none' ? '' : _regex
          const queryKey = searchObj?.queryKey || cur 
          _params[`${queryKey}${regex}`] = values[cur]
        }
        return _params
      }, {})
      return params
    },
    [getSearchObj]
  )

  const debounceChange = useMemo(
    () => debounce((params) => handleChangeParams(params), 300),
    [handleChangeParams]
  )
  useEffect(() => {
    if (!watchMode) return
    const subscription = watch((value, { name }) => {
      const searchObj = getSearchObj(name as string)
      const hasDebounce = searchObj?.searchType === 'text' || searchObj?.searchType === undefined
      const params = getQueryParams(value)
      if (hasDebounce) {
        debounceChange(params)
      } else {
        handleChangeParams(params)
        setSearchParams(params)
      }
    })
    return () => subscription.unsubscribe()
  }, [debounceChange, getQueryParams, getSearchObj, handleChangeParams, watch, watchMode])

  useEffect(() => {
    if (searchParams.get('is_expiring') && isUrlExpiring) {
      setValue('is_expiring', true)
      const params = getQueryParams({ ...getValues(), is_expiring: true })
      handleChangeParams(params)
      setSearchParams(params)
    }
    if (searchParams.get('month') && isUrlMonth) {
      const params = getQueryParams({ ...getValues(), month: searchParams.get('month') })
      handleChangeParams(params)
      setSearchParams(params)
    }
  }, [searchParams.get('is_expiring'), searchParams.get('month')])

  useEffect(() => {
    if (!watch('is_expiring')) {
      const currentURL = window.location.href
      const newURL = new URL(currentURL)
      newURL.searchParams.delete('is_expiring')
      window.history.pushState({}, '', newURL.toString())
      setIsUrlExpiring && setIsUrlExpiring(false)
    }
  }, [watch('is_expiring')])

  const onSubmit: SubmitHandler<UnknownObj> = (values) => {
    if (values.month) {
      values.month = formatYearMonth(
        new Date(values.month as string).getMonth() + 1,
        new Date(values.month as string).getFullYear()
      )
    }

    const params = getQueryParams(values)
    handleChangeParams(params)
    setSearchParams(params)
  }
  const onReset = () => {
    const params = {}
    const currentURL = window.location.href
    const newURL = new URL(currentURL)
    reset()
    handleChangeParams(params)
    setSearchParams(params)
    setValue('is_expiring', false)
    setIsUrlExpiring && setIsUrlExpiring(false)
    setIsUrlMonth && setIsUrlMonth(false)
    newURL.searchParams.delete('is_expiring')
    newURL.searchParams.delete('month')
    window.history.pushState({}, '', newURL.toString())
  }

  const CustomizedBox = styled(Box)(({ theme }) => ({
    padding: '0 16px 16px 16px',
    borderRadius: '8px',
    margin: '0 0 20px 0',
    width: '100%'
  }))

  return (
    <CustomizedBox
      sx={{ backgroundColor: '#FAFAFA' }}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Grid container spacing={2}>
        {searchColumns.map(
          (
            { accessor = '', Header, searchType, additionSearchProps, search = true, grid },
            index
          ) => {
            const name = convertParamKey(accessor as string)
            const controlProps = {
              name: name,
              label: Header as string,
              control,
              key: index
            }

            switch (
              searchType as
                | 'select'
                | 'text'
                | 'time-range-picker'
                | 'timepicker'
                | 'date-picker'
                | 'month-picker'
                | 'switch'
            ) {
              case 'select':
                return (
                  <Grid item xs={12} {...grid} key={index}>
                    <Select
                      sx={{ ...styleBgField }}
                      fullWidth
                      size="small"
                      placeholder={t('table.select') + ' ' + (Header as string)?.toLowerCase()}
                      {...controlProps}
                      {...additionSearchProps}
                    />
                  </Grid>
                )
              case 'time-range-picker':
                return (
                  <Grid item xs={12} {...grid} key={index}>
                    <DateRangePicker
                      sx={{ ...styleBgField }}
                      fullWidth
                      {...controlProps}
                      {...(additionSearchProps as DateRangePickerType<UnknownObj>)}
                      textFieldProps={{ size: 'small' }}
                    />
                  </Grid>
                )
              case 'date-picker':
                return (
                  <Grid item xs={12} {...grid} key={index}>
                    <DatePicker
                      sx={{ ...styleBgField }}
                      fullWidth
                      {...controlProps}
                      {...(additionSearchProps as DatePickerType<UnknownObj, UnknownObj>)}
                      defaultValue={null}
                      size="small"
                    />
                  </Grid>
                )
              case 'month-picker':
                return (
                  <Grid item xs={12} {...grid} key={index}>
                    <DatePicker
                      sx={{ ...styleBgField }}
                      fullWidth
                      views={['year', 'month']}
                      maxDate={dayAfterOneYear as any}
                      {...controlProps}
                      {...(additionSearchProps as DatePickerType<UnknownObj, UnknownObj>)}
                      defaultValue={isUrlMonth ? searchParams.get('month') : null}
                      size="small"
                    />
                  </Grid>
                )
              case 'switch':
                return (
                  <Grid item xs={12} {...grid} key={index}>
                    <SwitchLabel
                      label={t('labor_contract.contract_expiring_10_day')}
                      name="is_expiring"
                      control={control}
                      //@ts-ignore
                      checked={watch('is_expiring')}
                    />
                  </Grid>
                )
              default:
                return (
                  <Grid item xs={12} {...grid} key={index}>
                    <Input
                      sx={{ ...styleBgField }}
                      fullWidth
                      size="small"
                      placeholder={t('table.type') + ' ' + (Header as string)?.toLowerCase()}
                      {...controlProps}
                      {...additionSearchProps}
                    />
                  </Grid>
                )
            }
          }
        )}
      </Grid>
      <Box
        sx={{
          ...styleBoxAction
        }}
      >
        <Box
          sx={{
            ...styleButtonReset
          }}
        >
          <ButtonCommon error={true} onClick={onReset} variant="outlined">
            <RestartAltIcon sx={{ ...styleIcon }} />
            {t('table.reset_v2')}
          </ButtonCommon>
        </Box>

        <Box
          sx={{
            ...styleButtonSearch
          }}
        >
          <ButtonCommon disabled={loading} variant="contained" type="submit">
            <SearchSharpIcon sx={{ ...styleIcon }} />
            {t('table.search')}
          </ButtonCommon>
        </Box>
      </Box>
    </CustomizedBox>
  )
}

const FilterBar = memo(FilterBarComponent) as typeof FilterBarComponent

const styleButtonReset = {
  width: { xs: '150px', md: '120px' },
  height: '36px'
}
const styleIcon = {
  width: { xs: '12px', md: '16px' },
  height: { xs: '12px', md: '16px' }
}
const styleButtonSearch = {
  width: { xs: '150px', md: '120px' },
  height: '36px'
}

const styleBgField = {
  backgroundColor: '#fff',
  fontSize: '16px',
  boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
  borderRadius: '10px',
  height: 40
}

const styleBoxAction = {
  display: 'flex',
  justifyContent: { xs: 'space-between', sm: 'flex-end' },
  marginTop: 2,
  gap: 2
}

export { FilterBar }

