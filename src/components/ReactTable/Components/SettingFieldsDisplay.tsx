// @ts-nocheck
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SearchSharpIcon from '@mui/icons-material/SearchSharp'
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Tooltip,
  Typography,
  styled
} from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import { Key, memo, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Column } from 'react-table'
import adjust from '../../../assets/svgs/adjust.svg'
import check from '../../../assets/svgs/check.svg'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'

type SettingFieldsDisplayPros<T extends object> = {
  columns: any
  disabled?: boolean
  callBackColumnsDisplay: (columnsSeleted: Column) => void
}

type ItemFieldPros = {
  Header: string
  display: boolean
  disabled: boolean
}
function SettingFieldsDisplayComponent<T extends object>({
  columns,
  disabled = false,
  callBackColumnsDisplay
}: SettingFieldsDisplayPros<T>) {
  const { t } = useTranslation()
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [columnOptions, setColumnOptions] = useState<any>([])
  const [key, setKey] = useState<any>(Math.random())

  const handleChange = (item: ItemFieldPros, index: Key) => {
    const options = columnOptions
    if (!item.disabled) {
      if (options[index].display) {
        options[index].display = false
      } else {
        options[index].display = true
      }
    }

    const columns = options.filter((item: ItemFieldPros) => item.display)
    if (columns.length === 1) {
      columns[0].disabled = true
    } else {
      columns.forEach((column: ItemFieldPros) => {
        column.disabled = false
      })
    }
    setColumnOptions(options)
    setKey(Math.random())
  }

  useEffect(() => {
    setColumnOptions(columns)
    callBackColumnsDisplay(columns)
    setKey(Math.random())
  }, [])

  const openDialog = () => {
    setShowDialog(true)
  }

  const handleClose = () => {
    setShowDialog(false)
  }

  const handleSubmit = () => {
    callBackColumnsDisplay(columnOptions)
    setShowDialog(false)
  }

  const handleReset = () => {
    const defaultColumns = columns.map((column: Column) => ({
      ...column,
      display: true,
      disabled: false
    }))
    setColumnOptions(defaultColumns)
    setKey(Math.random())
  }

  const content = useMemo(
    () => (
      <Grid container key={key} spacing={3}>
        {columnOptions?.map((c: ItemFieldPros, index: Key) => (
          <Grid key={index} item sm={6} xs={12}>
            <Typography
              onClick={() => handleChange(c, index)}
              sx={{
                ...stylecolumnOptionsTyporaphy
              }}
            >
              <Checkbox
                sx={{
                  ...styleCheckbox
                }}
                checked={c.display ? true : false}
                inputProps={{ 'aria-label': 'controlled' }}
                disabled={c.disabled}
                checkedIcon={
                  <Box component={'img'} src={check} width={12} height={12} alt="checkbox" />
                }
              />
              {c.Header}
            </Typography>
          </Grid>
        ))}
      </Grid>
    ),
    [key]
  )

  return (
    <>
      {!disabled ? (
        <ButtonCommon onClick={openDialog} sx={{ minWidth: 30 }}>
          <Tooltip title={t('custom')} arrow placement="top">
            <Box sx={{ ...styleIconSvgs }}>
              <Box
                component={'img'}
                width={{ ...styleBoxImgItem }}
                height={{ ...styleBoxImgItem }}
                src={adjust}
                alt=""
              />
            </Box>
          </Tooltip>

          {/* {t('custom')} */}
        </ButtonCommon>
      ) : null}

      <Dialog
        open={showDialog}
        onClose={handleClose}
        fullWidth={true}
        PaperProps={{
          sx: {
            ...styleDialog
          }
        }}
      >
        <DialogTitle
          sx={{
            ...styleDialogTitle
          }}
        >
          {t('custom')}
        </DialogTitle>
        <DialogContent sx={{ ...styleDialogContent }}>
          <Typography>{content}</Typography>
        </DialogContent>
        <DialogActions
          sx={{
            ...styleDialogActions
          }}
        >
          <BoxButton>
            {' '}
            <ButtonCommon
              onClick={handleReset}
              sx={{
                ...styleButtonReset
              }}
              error={true}
              variant="outlined"
            >
              <RestartAltIcon sx={{ ...styleIcon }} />
              {t('reset')}
            </ButtonCommon>
          </BoxButton>

          <BoxButton>
            <ButtonCommon
              onClick={handleSubmit}
              sx={{
                ...styleButtonSubmit
              }}
              variant="contained"
              type="submit"
            >
              <SearchSharpIcon sx={{ ...styleIcon }} />
              {t('apply')}
            </ButtonCommon>
          </BoxButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

const SettingFieldsDisplay = memo(SettingFieldsDisplayComponent)

const BoxButton = styled(Box)(({ theme }) => ({
  width: '120px',
  height: '36px'
}))

export { SettingFieldsDisplay }

const styleBoxImgItem = {
  xs: '28px',
  lg: '24px'
}

const styleIconSvgs = {
  display: 'flex',
  alignItems: 'center'
}

const styleBoxImg = {
  xs: '12px',
  md: '14px'
}
const stylecolumnOptionsTyporaphy = {
  cursor: 'pointer',
  fontSize: '16px !important',
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: '20px',
  display: 'flex',
  alignItems: 'center'
}
const styleButtonCustom = {
  height: '40px',
  minWidth: '140px'
}
const styleCheckbox = {
  '&.Mui-checked': {
    color: '#E8F3FF',
    backgroundColor: '#E8F3FF'
  },
  '&.MuiCheckbox-root': {
    color: 'transparent',
    border: '1px solid #036FE3',
    borderRadius: '4px',
    width: '16px',
    height: '16px',
    padding: '0',
    '&:hover': {
      backgroundColor: '#E8F3FF'
    }
  },
  marginRight: '8px'
}

const styleIcon = {
  width: { xs: '12px', md: '16px' },
  height: { xs: '12px', md: '16px' }
}

const styleTyporaphy = {
  fontSize: { xs: '12px', md: '16px' },
  color: '#146BD2',
  fontWeight: 600,
  lineHeight: '22px'
}

const styleDialog = {
  borderRadius: '8px',
  width: 'auto',
  maxWidth: '600px',
  heigth: 'unset',
  minWidth: { xs: '300px', sm: '400px' }
}

const styleDialogTitle = {
  fontSize: { xs: '18px', md: '20px', lg: '24px' },
  fontWeight: 800,
  textTransform: 'uppercase',
  fontFamily: 'Lato',
  color: '#146BD2',
  lineHeight: '36px'
}

const styleDialogActions = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '10px 0 20px 0',
  gap: '4px',
  padding: 0
}

const styleButtonReset = {
  width: { xs: '120px', md: '120px' },
  height: { xs: '36px', md: '36px' },
  display: 'flex',
  gap: '3px',
  padding: 0
}

const styleTaporafyReset = {
  fontSize: { xs: '12px', md: '16px' },
  lineHeight: '20px',
  fontWeight: 500
}

const styleButtonSubmit = {
  width: { xs: '120px', md: '120px' },
  height: '36px',
  display: 'flex',
  gap: '3px',
  padding: 0
}

const styleTaporaphyApply = {
  fontSize: { xs: '12px', md: '16px' },
  lineHeight: '20px',
  fontWeight: 500
}

const styleDialogContent = {
  padding: '16px 24px'
}
