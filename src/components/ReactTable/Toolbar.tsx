// @ts-nocheck
import LogoutIcon from '@mui/icons-material/Logout'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Grid,
  SelectChangeEvent,
  Typography
} from '@mui/material'
import TextField from '@mui/material/TextField'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Column } from 'react-table'
// // import { FilterBar } from '../components/v2/FilterBar'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
import { FormModal } from 'components/Form/Components/FormModal'
import { Permissions } from 'constants/permissions'
import { exportApi } from 'lib/api/exportApi'
import { useAuth } from 'lib/hook/useAuth'
import { UnknownObj } from 'lib/types/utils'
import { useSearchParams } from 'react-router-dom'
import add from "../../assets/svgs/add.svg"
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
  title?: string | React.ReactNode
  isShowExpandFilter?: boolean
  selectedSalary?: number[]
  salary_sheet_id?: any
  approver?: any
  handleCheckedSalary?: () => void
  handleReviewSalary?: () => void
  handleSalariClosing?: () => void
  isSalaryLoading?: boolean
  isSalaryReview?: boolean
  openModalChecked?: boolean
  openModalSalaryClosing?: boolean
  handleModal?: (action: string) => void
}


export default function Toolbar<T extends object>({
  onActionCreate,
  searchColumns,
  callBackColumnsDisplay,
  handleChangeParams,
  importUrl,
  exportUrl,
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
  selectedSalary,
  salary_sheet_id,
  approver,
  handleCheckedSalary,
  handleReviewSalary,
  handleSalariClosing,
  isSalaryLoading,
  isSalaryReview,
  openModalChecked,
  openModalSalaryClosing,
  handleModal,
  ...props
}: ToolbarProps<T>) {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [expandedFilter, setExpandedFlter] = React.useState(false)
  const [isUrlExpiring, setIsUrlExpiring] = useState<boolean>(false)
  const [isUrlMonth, setIsUrlMonth] = useState<boolean>(false)

  const [textInput, setTextInput] = React.useState<string>()

  const [status, setStatus] = useState('')
  const { permissions, user } = useAuth()
  const isManagerEdit =
    permissions?.includes(Permissions.salariesManage) && user?.employee_id === approver?.id
      ? true
      : false
  const handleExpandFilterClick = () => {
    setExpandedFlter(!expandedFilter)
  }
  const onExport = async () => {
    exportApi(`${exportUrl}?rows=all`, exportFileName)
  }

  const onDownloadTemplate = async () => {
    if (templateUrl) {
      exportApi(templateUrl, exportFileName || 'regions.xlsx')
    }
  }

  const handleTextInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTextInput(event.target.value)
  }

  const handleQuickSearch = () => {
    if (quickSearchField) {
      handleChangeParams({ [quickSearchField.accessor]: textInput })
    }
  }

  const keyPress = (e: any) => {
    if (e.keyCode == 13 && quickSearchField) {
      handleChangeParams({ [quickSearchField.accessor]: e.target.value })
    }
  }

  const handleChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string)
  }

  useEffect(() => {
    if (searchParams.get('is_expiring') === 'true' || searchParams.get('month')) {
      setExpandedFlter(true)
      setIsUrlExpiring(true)
      setIsUrlMonth(true)
    }
  }, [searchParams.get('is_expiring'), searchParams.get('month')])

  return (
    <Grid container sx={{ padding: 2 }}>
      <Grid item xs={12} container>
        <Grid item sx={{ display: { xs: 'none', lg: 'block' } }} lg={4}>
          <Typography
            sx={{
              ...styleTyporaphyTitle
            }}
          >
            {title}
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          lg={8}
          container
          sx={{
            display: { xs: 'block', md: 'flex' },
            justifyContent: {
              xs: 'unset',
              md: 'flex-end'
            }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 1, sm: 2 },
              flexDirection: { xs: 'column', md: 'row' }
            }}
          >
            {isShowSearchFast && (
              <Box sx={{ width: { sm: '100%', lg: '240px' } }}>
                <TextField
                  placeholder={`${t('table.search')}...`}
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
                      <ButtonCommon
                        sx={{
                          ...styleBtnSearch
                        }}
                        startIcon={<SearchIcon />}
                        onClick={handleQuickSearch}
                      ></ButtonCommon>
                    )
                  }}
                />
              </Box>
            )}
            <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 } }}>
              {searchColumns && searchColumns.length ? (
                <ButtonCommon
                  error={true}
                  sx={{ heigth: '40px', minWidth: { sm: '140px' } }}
                  variant={expandedFilter ? 'outlined' : 'outlined'}
                  onClick={handleExpandFilterClick}
                >
                  {!expandedFilter ? (
                    <Box sx={{ ...styleIconSvgs }}>
                      <Box
                        component={'img'}
                        width={{ ...styleWidthBoxImg }}
                        height={{ ...styleHeightBoxImg }}
                        src={stroke}
                        alt=""
                      />
                    </Box>
                  ) : (
                    <Box sx={{ ...styleIconSvgs }}>
                      <Box
                        component={'img'}
                        width={{ ...styleWidthBoxImg }}
                        height={{ ...styleHeightBoxImg }}
                        src={stroke}
                        alt=""
                      />
                    </Box>
                  )}
                  {expandedFilter ? t('back') : t('filter')}
                </ButtonCommon>
              ) : null}
              {exportUrl ? (
                <ButtonCommon variant="outlined" startIcon={<LogoutIcon />} onClick={onExport}>
                  {t('export')}
                </ButtonCommon>
              ) : null}
              {/* {importUrl ? (
                <>
                  <ImportData importUrl={importUrl} />
                </>
              ) : null} */}
              {headerOptions ? <Box sx={{ ...styleOptions }}>{headerOptions}</Box> : undefined}
              <SettingFieldsDisplay
                columns={columns}
                disabled={isTableCalendar}
                callBackColumnsDisplay={callBackColumnsDisplay}
              />
              {onActionCreate ? (
                <ButtonCommon
                  onClick={onActionCreate}
                  variant="contained"
                  sx={{
                    height: '40px',
                    minWidth: { sm: '140px' }
                  }}
                >
                  <Box sx={{ ...styleIconSvgs }}>
                    <Box
                      component={'img'}
                      width={{ ...styleWidthBoxImg }}
                      height={{ ...styleHeightBoxImg }}
                      src={add}
                      alt=""
                    />
                  </Box>
                  <Typography
                    sx={{
                      ...styleTyporaphyAdd
                    }}
                  >
                    {t('add')}
                  </Typography>
                </ButtonCommon>
              ) : null}
              {filterCalender ?? null}
              {/* <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}> */}
              {selectedSalary && selectedSalary.length > 0 && (
                <>
                  {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}> */}
                  {isManagerEdit ? (
                    <ButtonCommon
                      variant="contained"
                      sx={{
                        height: '40px',
                        minWidth: { sm: '140px' }
                      }}
                      onClick={() => handleModal && handleModal('salary_closing')}
                    >
                      {t('salary.salary_closing')}
                    </ButtonCommon>
                  ) : (
                    <ButtonCommon
                      variant="contained"
                      sx={{
                        height: '40px',
                        minWidth: { sm: '140px' }
                      }}
                      onClick={() => handleModal && handleModal('checked')}
                    >
                      {t('salary.checked')}
                    </ButtonCommon>
                  )}
                  {/* </Box> */}
                </>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
      <FormModal
        open={openModalChecked && !isManagerEdit}
        handleClose={() => handleModal && handleModal('checked')}
        onSubmit={handleCheckedSalary}
        isCancel={isSalaryLoading}
        title={t('salary.checked_salary')}
        content={t('salary.sure_salary_emp')}
      />
      <FormModal
        open={isManagerEdit && openModalSalaryClosing}
        handleClose={() => handleModal && handleModal('salary_closing')}
        onSubmit={handleSalariClosing}
        isCancel={isSalaryLoading}
        title={t('salary.confirm_salary')}
        content={t('salary.sure_finalize_payroll')}
      />
      {expandedFilter ? (
        <Box sx={{ ...styleBoxFilter }}>
          <FilterBar
            searchColumns={searchColumns}
            handleChangeParams={handleChangeParams}
            loading={loading}
            onClickExpandFil={handleExpandFilterClick}
            setIsUrlExpiring={setIsUrlExpiring}
            isUrlExpiring={isUrlExpiring}
            setIsUrlMonth={setIsUrlMonth}
            isUrlMonth={isUrlMonth}
          />
        </Box>
      ) : null}
    </Grid>
  )
}

const styleWidthBoxImg = {
  xs: '12px',
  md: '14px',
  lg: '16px'
}

const styleHeightBoxImg = {
  xs: '12px',
  md: '14px',
  lg: '16px'
}

const styleBoxFilter = {
  padding: 2,
  width: '100%'
}

const styleIconSvgs = {
  display: 'flex',
  alignItems: 'center'
}

const styleOptions = {
  width: { xs: '100%', md: 'unset' },
  '@media only screen and (min-width : 1024px) and (max-width : 1366px)': {
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

const styleTyporaphyAdd = {
  fontSize: { xs: '14px', sm: '16px' },
  color: '#fff',
  lineHeight: '22px'
}

const styleTyporaphyTitle = {
  display: { xs: 'none', md: 'block', lg: 'block' },
  fontSize: { xs: '16px', md: '20px', lg: '24px' },
  fontWeight: 800,
  textTransform: 'uppercase',
  fontFamily: 'Lato',
  color: '#146BD2',
  lineHeight: '36px',
  '@media only screen and (min-width : 1024px) and (max-width : 1366px)': {
    display: 'none'
  }
}
