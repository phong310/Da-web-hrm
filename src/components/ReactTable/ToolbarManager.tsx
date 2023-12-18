import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, Typography } from '@mui/material'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/system'
import React, { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Column } from 'react-table'

import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
import { useAtom } from 'jotai'
import { searchParamsAtom } from 'lib/atom/searchAtom'
import { UnknownObj } from 'lib/types/utils'
import add from '../../assets/svgs/add.svg'
import stroke from '../../assets/svgs/stroke.svg'
import { SettingFieldsDisplay } from './Components/SettingFieldsDisplay'
import { FilterBar } from './FilterBar'

type ToolbarProps<T extends object> = {
  onActionCreate?: () => void
  loading: boolean
  onActionFilter?: () => void
  importUrl?: string
  exportUrl?: string
  exportFileName?: string
  templateUrl?: string
  isTableCalendar?: boolean
  isShowSearchFast?: boolean
  columns: Column
  quickSearchField?: any
  headerOptions?: React.ReactElement
  handleChangeParams: (params: UnknownObj) => void
  callBackColumnsDisplay: (colums: Column) => void
  searchColumns?: any
  filterCalender?: any
  leftHeader?: React.ReactNode
  title?: string | React.ReactNode
  isShowExpandFilter?: boolean
}

const CustomizedButton = styled(Button)``

export default function ToolbarManager<T extends object>({
  onActionCreate,
  searchColumns,
  callBackColumnsDisplay,
  handleChangeParams,
  importUrl,
  exportUrl,
  leftHeader,
  columns,
  headerOptions,
  isTableCalendar,
  templateUrl,
  exportFileName,
  quickSearchField,
  isShowSearchFast,
  filterCalender,
  loading,
  title,
  ...props
}: ToolbarProps<T>) {
  const { t, i18n } = useTranslation()
  const [expandedFilter, setExpandedFlter] = React.useState(false)
  const [textInput, setTextInput] = React.useState<string>('')
  const [searchParams, setSearchParams] = useAtom(searchParamsAtom)
  const handleExpandFilterClick = () => {
    setExpandedFlter(!expandedFilter)
  }

  const handleTextInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTextInput(event.target.value)
  }

  const handleQuickSearch = () => {
    if (quickSearchField) {
      const newParams = { ...searchParams, [quickSearchField.accessor]: textInput }
      setSearchParams(newParams)
      handleChangeParams(newParams)
    }
  }

  const keyPress = (e: any) => {
    if (e.keyCode == 13 && quickSearchField) {
      const newParams = { ...searchParams, [quickSearchField.accessor]: e.target.value }
      setSearchParams(newParams)
      handleChangeParams(newParams)
    }
  }

  return (
    <Box>
      <Box
        sx={{
          ...styleBg
        }}
      >
        <Box
          sx={{
            ...styleBoxTitle
          }}
        >
          <Box
            sx={{
              '@media (min-width: 600px) and (max-width: 1366px)': {
                display: 'none'
              }
            }}
          >
            <Typography sx={{ ...styleTitle }}>{title}</Typography>
            {filterCalender ?? null}
          </Box>
          <Box sx={{ ...styleBoxContainer }}>
            <Box sx={{ ...styleOptionsSettings }}>
              <Box sx={{ width: { xs: '100%', lg: 'unset' } }}>
                {isShowSearchFast && (
                  <TextField
                    placeholder={`${t('table.search_placeholder')}...`}
                    variant="outlined"
                    value={textInput}
                    onKeyDown={keyPress}
                    onChange={handleTextInputChange}
                    size={'small'}
                    sx={{
                      ...styleOptions
                    }}
                    InputProps={{
                      endAdornment: (
                        <Button
                          sx={{
                            ...styleBtnSearch
                          }}
                          startIcon={<SearchIcon />}
                          onClick={handleQuickSearch}
                        ></Button>
                      )
                    }}
                  />
                )}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', height: 0 }}>
                <Box sx={{ ...styleBoxSearch }}>
                  {searchColumns && searchColumns.length ? (
                    <Box sx={{ ...styleBtnFilter }}>
                      <ButtonCommon
                        variant={expandedFilter ? 'outlined' : 'outlined'}
                        onClick={handleExpandFilterClick}
                        sx={{ heigth: '40px', minWidth: { sm: '140px' } }}
                        error={true}
                      >
                        {!expandedFilter ? (
                          <Box sx={{ ...styleIconSvgs }}>
                            <img src={stroke} alt="" />
                            {/* <Box
                              component={'img'}
                              width={{ ...styleWidthBoxImg }}
                              height={{ ...styleHeightBoxImg }}
                              src={stroke}
                              alt=""
                            /> */}
                          </Box>
                        ) : (
                          <Box sx={{ ...styleIconSvgs }}>
                            <img src={stroke} alt="" />
                            {/* <Box
                              component={'img'}
                              width={{ ...styleWidthBoxImg }}
                              height={{ ...styleHeightBoxImg }}
                              src={stroke}
                              alt=""
                            /> */}
                          </Box>
                        )}
                        {expandedFilter ? t('back') : t('filter')}
                      </ButtonCommon>
                    </Box>
                  ) : null}
                </Box>
                <Box>
                  <SettingFieldsDisplay
                    columns={columns}
                    disabled={isTableCalendar}
                    callBackColumnsDisplay={callBackColumnsDisplay}
                  />
                </Box>
                <Box sx={{ ...styleDatePicker }}>{leftHeader}</Box>
                {onActionCreate ? (
                  <Box sx={{ ...styleBtnFilter }}>
                    <ButtonCommon
                      sx={{ height: '100%', width: '100%' }}
                      onClick={onActionCreate}
                      variant="contained"
                    >
                      <Box sx={{ ...styleIconSvgs }}>
                        <img src={add} alt="" />
                        {/* <Box
                          component={'img'}
                          width={{ ...styleWidthBoxImg }}
                          height={{ ...styleHeightBoxImg }}
                          src={add}
                          alt=""
                        /> */}
                      </Box>
                      <Typography
                        sx={{   
                          ...styleTyporaphyAdd
                        }}
                      >
                        {t('add')}
                      </Typography>
                    </ButtonCommon>
                  </Box>
                ) : null}
                {filterCalender ?? null}
              </Box>
            </Box>

            {headerOptions ? <Box sx={{ ...styleOptions }}>{headerOptions}</Box> : undefined}
          </Box>
        </Box>
        {expandedFilter ? (
          <Box sx={{ ...styleBoxFilter }}>
            <FilterBar
              searchColumns={searchColumns}
              handleChangeParams={handleChangeParams}
              loading={loading}
              onClickExpandFil={handleExpandFilterClick}
            />
          </Box>
        ) : null}
      </Box>
    </Box>
  )
}

const styleBg = {
  backgroundColor: '#fff'
}

const styleBtnAdd = {
  width: { xs: '110px', md: '130px', lg: '143px' },
  height: { xs: '36px', md: '40px', lg: '42px' },
  display: 'flex',
  gap: 1,
  alignItems: 'center',
  justifyContent: 'center'
}

const styleOptionsSettings = {
  display: { xs: 'block', sm: 'flex' },
  alignItems: 'center',
  // justifyContent: 'space-between',
  margin: { xs: '12px 0', md: 0 },
  '@media (min-width: 900px) and (max-width: 1366px)': {
    margin: '12px 0'
  }
}
const styleTyporaphyAdd = {
  fontSize: { xs: '14px', sm: '16px' },
  color: '#fff',
  lineHeight: '22px'
}
const styleWidthBoxImg = {
  xs: '12px',
  md: '14px',
  lg: '16px'
}
const styleDatePicker = {
  display: { xs: 'block', sm: 'none' },
  width: 'unset',
  ml: { xs: 1, md: 2 }

  // '@media (min-width: 600px) and (max-width: 1366px)': {
  //   display: 'block'
  // }
}
const styleBoxSearch = {
  display: 'flex',
  justifyContent: 'flex-end',
  mr: { xs: 1, sm: 2 }
}
const styleHeightBoxImg = {
  xs: '12px',
  md: '14px',
  lg: '16px'
}
const styleTitle = {
  display: { xs: 'none', sm: 'block' },
  fontSize: { xs: '16px', sm: '18px', md: '20px', lg: '24px' },
  fontFamily: 'Lato',
  color: 'rgb(20, 107, 210)',
  fontWeight: '800',
  textTransform: 'uppercase',
  lineHeight: '36px'
}
const styleBoxTitle = {
  display: { sm: 'flex' },
  padding: '16px',
  alignItems: 'center',
  justifyContent: { xs: 'center', sm: 'space-between' }
}

const styleBoxFilter = {
  padding: 2
}
const styleBoxContainer = {
  display: { sm: 'flex' },
  // width: { sm: '100%' },
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: { xs: '10px', md: '16px' },
  '@media (min-width: 600px) and (max-width: 1366px)': {
    width: '100%'
  }
}

const styleIconSvgs = {
  display: 'flex',
  alignItems: 'center'
}

const styleOptions = {
  width: { xs: '100%', md: 'unset' },
  '@media (min-width: 600px) and (max-width: 1366px)': {
    width: '100%'
  }
}

const styleBtnSearch = {
  minWidth: 'fit-content',
  width: 'fit-content',
  '& span': {
    marginRight: 0
  }
}

const styleBtnFilter = {
  ml: { sm: 2 },
  width: { xs: '110px', md: '130px', lg: '143px' },
  height: { xs: '36px', sm: '40px' },
  '@media (min-width: 300px) and (max-width: 600px)': {
    display: 'block',
    width: '100%'
  }
}
