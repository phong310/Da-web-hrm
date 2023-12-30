// @ts-nocheck
import { IconButton, Menu, MenuItem } from '@mui/material'
import Divider from '@mui/material/Divider'
import chervon_down from '../../../assets/svgs/chevron-down.svg'
import export_new from '../../../assets/svgs/export_new.svg'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
import { MouseEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ImportData } from './ImportData'

type propType = {
  onExpor?: () => void
  importUrl?: string | any
  onDownloadTemplate?: () => void
  handleRefreshDataImport?: () => any
}

export const OptionExportImportData: React.VFC<propType> = ({
  onExpor,
  onDownloadTemplate,
  importUrl,
  handleRefreshDataImport
}) => {
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{
          ...styleIconButton
        }}
      >
        <ButtonCommon
          variant="outlined"
          error={true}
          sx={{ height: '40px', minWidth: '140px' }}
          startIcon={<img src={chervon_down} />}
        >
          {t('select_opiton')}
        </ButtonCommon>
      </IconButton>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{ ...styleMenu }}
        PaperProps={{
          sx: {
            ...styleContainerMenu
          }
        }}
      >
        <MenuItem sx={{ width: 200, pr: 10 }}>
          <ButtonCommon startIcon={<img src={export_new} />} onClick={onExpor}>
            {t('export')}
          </ButtonCommon>
        </MenuItem>

        <Divider />

        <MenuItem sx={{ width: 200, pr: t('import') === 'Import' ? 10 : 12.2 }}>
          <ImportData
            handleRefreshDataImport={handleRefreshDataImport}
            importUrl={importUrl}
            onDownloadTemplate={onDownloadTemplate}
          />
        </MenuItem>
      </Menu>
    </>
  )
}

const styleContainerMenu = {
  borderRadius: '12px',
  display: 'flex',
  width: 200,
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '4px'
}

const styleMenu = {
  mt: { xs: '10px', md: 'unset' }
}

const styleIconButton = {
  padding: '0',
  margin: '0',
  '&:hover': {
    boxShadow: 'none',
    backgroundColor: '#ffffff'
  }
}
