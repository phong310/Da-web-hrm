import { Box, CircularProgress, Grid, Modal, Typography } from '@mui/material'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { SIZE_BUTTON } from 'lib/utils/contants'
import { blueV2 } from 'styles/colors'
import { ButtonCommon } from './ButtonCommon'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: '90%',
    sm: 'auto'
  },
  minWidth: { sm: '400px' },
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '16px',
  overflow: 'hidden'
}

const titleCancleStyle = {
  paddingLeft: 4,
  paddingRight: 4,
  paddingTop: 2,
  paddingBottom: 2,
  fontSize: 18,
  color: '#fff',
  lineHeight: '26px'
}

export function FormModal({ open, isCancel, handleClose, content, onSubmit, title }: any) {
  const { t } = useTranslation()

  const handleBackdropClick = (e: any) => {
    e.stopPropagation()
  }
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        BackdropProps={{
          //@ts-ignore
          onClick: (event: React.MouseEvent<HTMLDivElement>, reason: string) => {
            if (reason === 'backdropClick') {
              handleBackdropClick(event)
            }
          }
        }}
      >
        <Box sx={style}>
          <Box sx={{ backgroundColor: blueV2[200] }}>
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              sx={{
                ...titleCancleStyle
              }}
            >
              {title}
            </Typography>
          </Box>
          <Box sx={{ p: 4 }}>
            <Typography
              sx={{ fontSize: '16px' }}
              variant="h6"
              component="h2"
              id="modal-modal-description"
            >
              {content}
            </Typography>
            <Grid
              container
              spacing={3}
              sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Grid item xs={6} alignItems="center">
                <ButtonCommon variant="outlined" error={true} onClick={handleClose}>
                  {t('cancel')}
                </ButtonCommon>
              </Grid>
              <Grid item xs={6} alignItems="center">
                <ButtonCommon
                  variant="contained"
                  type="submit"
                  onClick={onSubmit}
                  sx={{ fontSize: SIZE_BUTTON.MAX }}
                  startIcon={isCancel ? <CircularProgress color="inherit" size="16px" /> : ''}
                >
                  {t('submit')}
                </ButtonCommon>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}
