import AddIcon from '@mui/icons-material/Add'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, Hidden } from '@mui/material'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/system'
import { UnknownObj } from 'lib/types/utils'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Column } from 'react-table'
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
}

const CustomizedButton = styled(Button)`
  margin-left: 10px;
`

export default function Toolbarv2<T extends object>({
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
  ...props
}: ToolbarProps<T>) {
  const { t, i18n } = useTranslation()
  const [expandedFilter, setExpandedFlter] = React.useState(false)
  const [textInput, setTextInput] = React.useState<string>('')
  const handleExpandFilterClick = () => {
    setExpandedFlter(!expandedFilter)
  }
//   const onExport = async () => {
//     exportApi(`${exportUrl}?rows=all`, exportFileName)
//   }

//   const onDownloadTemplate = async () => {
//     if (templateUrl) {
//       exportApi(templateUrl, exportFileName || 'regions.xlsx')
//     }
//   }

  const handleTextInputChange = (event: InputEvent) => {
    //@ts-ignore
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

  return (
    <>
      {expandedFilter ? (
        <FilterBar
          searchColumns={searchColumns}
          handleChangeParams={handleChangeParams}
          loading={loading}
        />
      ) : null}
      <Grid
        container
        mb={2}
        spacing={{
          xs: 2,
          sm: 2
        }}
      >
        <Grid item md={4} xs={isShowSearchFast ? 12 : 4} display="flex" alignItems="center">
          {isShowSearchFast && (
            <>
              <TextField
                placeholder={`${t('table.search')}...`}
                variant="outlined"
                value={textInput}
                onKeyDown={keyPress}
                //@ts-ignore
                onChange={handleTextInputChange}
                size={'small'}
                sx={{
                  width: { xs: '100%', md: 'unset' },
                  '.MuiInputBase-root': {
                    backgroundColor: '#fff',
                    overflow: 'hidden'
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <Button
                      sx={{
                        minWidth: 'fit-content',
                        width: 'fit-content',
                        '& span': {
                          marginRight: 0
                        }
                      }}
                      startIcon={<SearchIcon />}
                      onClick={handleQuickSearch}
                    ></Button>
                  )
                }}
              />
            </>
          )}
          {onActionCreate ? (
            <Button
              variant="outlined"
              onClick={onActionCreate}
              sx={{ py: '7px', boxSizing: 'border-box', px: { md: '4px', lg: '15px' } }}
            >
              <AddIcon sx={{ ...IconButton }} />
              <Hidden mdDown>
                <Box sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {t('add')}
                </Box>
              </Hidden>
            </Button>
          ) : null}
          {filterCalender ?? null}
        </Grid>
        <Grid item container md={8} xs={isShowSearchFast ? 12 : 8} justifyContent={'flex-end'}>
          {searchColumns && searchColumns.length ? (
            <CustomizedButton
              variant={expandedFilter ? 'contained' : 'outlined'}
              onClick={handleExpandFilterClick}
            >
              {!expandedFilter ? (
                <KeyboardArrowUpIcon sx={{ ...IconButton }} />
              ) : (
                <KeyboardArrowDownIcon sx={{ ...IconButton }} />
              )}
              <Hidden mdDown>{t('filter')}</Hidden>
            </CustomizedButton>
          ) : null}
          <SettingFieldsDisplay
            columns={columns}
            disabled={isTableCalendar}
            callBackColumnsDisplay={callBackColumnsDisplay}
          />
          {headerOptions ? (
            <Box sx={{ width: { xs: '100%', md: 'unset' } }}>{headerOptions}</Box>
          ) : undefined}
        </Grid>
      </Grid>
    </>
  )
}

const IconButton = {
  fontSize: '20px',
  marginRight: {
    xs: 0,
    md: '4px',
    lg: 1
  }
}
