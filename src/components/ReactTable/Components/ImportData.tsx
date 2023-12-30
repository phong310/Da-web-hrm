// @ts-nocheck
import FileUploadIcon from '@mui/icons-material/FileUpload'
import {
    Alert,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    Snackbar
} from '@mui/material'
import { styled } from '@mui/system'
import export_new from 'assets/svgs/export_new.svg'
import import_new from '../../../assets/svgs/import_new.svg'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
import { uploadApi } from 'lib/api/upload'
import { Message } from 'lib/types/notification'
import { TEMPLATE_HEADINGS } from 'lib/utils/contants'
import { memo, useState } from 'react'
import Dropzone from 'react-dropzone'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'
import { ModalPreviewData } from './ModalPreviewData'

type ImportDataProps<T extends object> = {
  importUrl: string
  handleRefreshDataImport?: () => void
  onDownloadTemplate?: () => void
}

type ExcelData = Record<string, any>

const CustomizedButton = styled(Button)`
  margin-left: 10px;
`
function ImportDataComponent<T extends object>({
  importUrl,
  handleRefreshDataImport,
  onDownloadTemplate
}: ImportDataProps<T>) {
  const { t } = useTranslation()
  const [message, setMessage] = useState<Message>({
    type: 'success',
    content: ''
  })

  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [openPreview, setOpenPreview] = useState<boolean>(false)
  const [excelData, setExcelData] = useState<ExcelData[] | null>(null)
  const [validationErrors, setValidationErrors] = useState<any>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [file, setFile] = useState<any>(null)

  const openDialog = () => {
    setShowDialog(true)
  }

  const handleClose = () => {
    setShowDialog(false)
    setFile(null)
  }

  const closePreviewData = () => {
    setOpenPreview(false)
    setValidationErrors([])
  }
  const handlePreview = () => {
    setOpenPreview(true)
  }

  const handleImport = async () => {
    setIsLoading(true)
    try {
      if (file) {
        const res = await uploadApi(file, {
          url: importUrl
        })
        if (res.status === 200) {
          setFile(null)
          setShowDialog(false)
          setOpenPreview(false)
          toast.success('Import success')
          handleRefreshDataImport && handleRefreshDataImport()
          setIsLoading(false)
        }
      }
    } catch (error:any) {
      setIsLoading(false)
      const data: any = []
      if (error) {
        for (const [key, value] of Object.entries(error.errors)) {
          const row = key.split('.', 1)
          const item = key.split('.')[1]
          const arrayitem = {
            row: row[0],
            column: item,
            // @ts-ignore
            message: value && (value[0] as string)
          }
          data.push(arrayitem)
        }
      }
      setValidationErrors(data)
    }
  }

  const handleDrop = (acceptedFiles: any) => {
    const regex = /(.xls|.xlsx|.csv)$/

    if (acceptedFiles && acceptedFiles.length) {
      const _file = acceptedFiles[0]
      if (regex.test(_file.name)) {
        setFile(_file)
        const reader = new FileReader()
        reader.readAsArrayBuffer(_file)
        reader.onload = (e) => {
          const data = e.target?.result as ArrayBuffer
          const workbook = XLSX.read(data, { type: 'buffer' })
          const worksheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[worksheetName]
          // @ts-ignore
          const headers: Array = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0]
          const ErrorHeader = TEMPLATE_HEADINGS.some((header) => headers.includes(header))

          if (ErrorHeader) {
            if (worksheet['!ref']) {
              const previewData = XLSX.utils.sheet_to_json(worksheet, {
                defval: null,
                blankrows: false
              }) as ExcelData[]

              if (previewData.length > 0) {
                setExcelData(previewData.slice(0, 200))
              } else {
                toast.error(t('valid_file_null'))
                setFile(null)
              }
            }
          } else {
            toast.error(t('import_excel.error_header'))
            setFile(null)
          }
        }
      } else {
        setMessage({
          type: 'error',
          content: t('valid_only_file')
        })
      }
    }
  }

  return (
    <>
      {importUrl ? (
        <ButtonCommon onClick={openDialog} startIcon={<img src={import_new} />}>
          {t('import')}
        </ButtonCommon>
      ) : null}
      <Snackbar
        open={!!message.content && message.content.length > 0}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={3000}
        onClose={(e) =>
          setMessage({
            type: 'info'
          })
        }
      >
        <Alert severity={message.type}>{message.content}</Alert>
      </Snackbar>

      <Dialog open={showDialog} onClose={handleClose} fullWidth={true} maxWidth={'md'}>
        <DialogTitle>
          <ButtonCommon
            sx={{ maxWidth: 146, ml: t('download_template') === 'Download template' ? 2 : 0 }}
            startIcon={<img src={export_new} />}
            onClick={onDownloadTemplate}
          >
            {t('download_template')}
          </ButtonCommon>
        </DialogTitle>
        <DialogContent>
          <Dropzone maxFiles={1} onDrop={handleDrop}>
            {({ getRootProps, getInputProps, isDragActive }) => {
              return (
                <div
                  {...getRootProps({
                    className: `dropzone ${isDragActive ? 'active' : ''}`
                  })}
                  style={{
                    textAlign: 'center',
                    border: '2px solid #eee',
                    borderRadius: '15px',
                    backgroundColor: '#FAFAFA',
                    padding: '20px'
                  }}
                >
                  <p style={{ ...styleFont }}>{t('drag_and_drop')}</p>
                  <input {...getInputProps()} />
                  <p>{t('Or')}</p>
                  <Button variant="outlined" startIcon={<FileUploadIcon />} sx={{ ...styleFont }}>
                    {t('select_file')}
                  </Button>
                  <p>
                    {file && file.name ? (
                      <span style={{ ...styleTitleFile }}>{file.name}</span>
                    ) : (
                      <i style={{ ...styleTitleValid }}>{t('condition_valid_file')}</i>
                    )}
                  </p>
                </div>
              )
            }}
          </Dropzone>
          <Grid sx={{ ...styleAction }}>
            <Button onClick={handleClose} variant="outlined" sx={{ ...styleFont }}>
              {t('cancel')}
            </Button>
            <Button
              onClick={handlePreview}
              variant="contained"
              disabled={!file}
              sx={{ ...styleFont }}
            >
              {t('import_excel.preview_data')}
            </Button>
          </Grid>
        </DialogContent>
        <ModalPreviewData
          open={openPreview}
          closeModal={closePreviewData}
          excelData={excelData}
          handleImport={handleImport}
          validationErrors={validationErrors}
          isLoading={isLoading}
        />
      </Dialog>
    </>
  )
}

const ImportData = memo(ImportDataComponent) as typeof ImportDataComponent

const styleFont = {
  fontSize: 16
}

const styleTitleValid = {
  color: '#757575',
  fontSize: 14
}

const styleTitleFile = {
  color: '#146BD2'
}

const styleAction = {
  display: 'flex',
  justifyContent: 'flex-end',
  mt: 2,
  gap: 1
}

export { ImportData }

