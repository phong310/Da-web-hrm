// @ts-nocheck
import CloseIcon from '@mui/icons-material/Close'
import {
  AppBar,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogProps,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
import React from 'react'
import { useTranslation } from 'react-i18next'

type PropType = DialogProps & {
  open?: boolean
  closeModal?: () => void
  excelData?: any
  handleImport?: () => void
  validationErrors?: any
  isLoading?: boolean
}

const ModalPreviewData: React.VFC<PropType> = ({
  open,
  closeModal,
  excelData,
  handleImport,
  validationErrors,
  isLoading
}) => {
  const { t } = useTranslation()
  return (
    <>
      <Dialog sx={{ ...styleDialog }} maxWidth="xl" open={open}>
        <AppBar sx={{ position: 'relative', boxShadow: 'none' }}>
          <Box sx={{ ...styleBoxDetail }}>
            <Typography sx={{ flex: 1, ...styleTitleDialog }} variant="h6" component="div">
              {t('employee.preview_data_sheets')}
            </Typography>
            <IconButton edge="end" onClick={closeModal} color="inherit" aria-label="close">
              <CloseIcon sx={{ ...styleIconClose }} />
            </IconButton>
          </Box>
        </AppBar>
        <DialogContent>
          {excelData ? (
            <Grid>
              <Grid container justifyContent="flex-end" gap={2} sx={{ mb: 2 }}>
                <ButtonCommon
                  sx={{ maxWidth: '150px' }}
                  type="submit"
                  variant="contained"
                  onClick={handleImport}
                  startIcon={isLoading ? <CircularProgress color="inherit" size="16px" /> : ''}
                >
                  {t('import')}
                </ButtonCommon>
              </Grid>
              <TableContainer>
                <Table sx={{ border: '1px solid #696969', borderCollapse: 'collapse' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ ...styleOderColumn }}>{t('order_number')}</TableCell>
                      {Object.keys(excelData[0]).map((key) => (
                        <TableCell
                          key={key}
                          sx={{
                            ...styleHeading,
                            minWidth:
                              key === 'sex'
                                ? 90
                                : key === 'card_number'
                                ? 100
                                : key === 'employee_code'
                                ? 120
                                : key === 'country' || key === 'ethnic' || key === 'role'
                                ? 120
                                : key === 'note' || key === 'address'
                                ? 300
                                : key === 'ID_no'
                                ? 140
                                : key === 'first_name' || key === 'last_name'
                                ? 120
                                : 180
                          }}
                        >
                          {t(`import_excel.${key}`)}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {excelData.map((individualExcelData: any, rowIndex: any) => (
                      <TableRow key={rowIndex} sx={{ border: 0 }}>
                        <TableCell sx={{ ...styleBody }}>{rowIndex + 1}</TableCell>
                        {Object.keys(individualExcelData).map((key, colIndex) =>
                          validationErrors.some(
                            (error: any) => error.column == key && Number(error.row) == rowIndex
                          ) ? (
                            <TableCell
                              key={key}
                              sx={{
                                ...styleError
                              }}
                            >
                              {individualExcelData[key]}
                              <br />
                              <i style={{ fontSize: '11px', color: 'red' }}>
                                {
                                  validationErrors.find(
                                    (data: any) =>
                                      data.column == key && Number(data.row) == rowIndex
                                  )?.message
                                }
                              </i>
                            </TableCell>
                          ) : (
                            <TableCell
                              key={key}
                              sx={{
                                ...styleBody
                              }}
                            >
                              {individualExcelData[key]}
                            </TableCell>
                          )
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          ) : (
            ''
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export { ModalPreviewData }

const styleBoxDetail = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingY: 1.5,
  paddingX: 2.5
}

const styleHeading = {
  border: '1px solid #696969',
  padding: '8px',
  backgroundColor: '#FFCC00',
  fontWeight: 'bold',
  textAlign: 'center',
  fontSize: '16px'
}

const styleBody = {
  border: '1px solid #696969',
  padding: '8px',
  fontSize: '16px'
}

const styleOderColumn = {
  border: '1px solid #696969',
  padding: '8px',
  backgroundColor: '#FFCC00',
  fontWeight: 'bold',
  minWidth: '40px',
  height: '40px',
  textAlign: 'center',
  fontSize: '16px'
}

const styleError = {
  border: '1px solid #696969',
  padding: '8px',
  fontSize: '16px',
  backgroundColor: 'rgba(255, 0, 0, 0.1)',
  cursor: 'pointer'
}

const styleTitleDialog = {
  fontSize: { xs: '14px', sm: '16px' }
}

const styleIconClose = {
  width: { xs: '20px', sm: '30px' }
}

const styleDialog = {
  '.MuiDialogContent-root': { padding: { xs: 1, sm: 2 } },
  '& .MuiDialog-container': {
    '& .MuiDialog-paper': {
      margin: '16px',
      minWidth: '800px'
    }
  }
}
