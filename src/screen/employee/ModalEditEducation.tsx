import { Box, Modal, Typography } from '@mui/material'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { blueV2 } from 'styles/colors'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: '90%',
    sm: '40%'
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

export function ModalEditEdcucation({
  open,
  isCancel,
  handleClose,
  content,
  onSubmit,
  title
}: any) {
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
          <Box sx={{ p: 4 }}>{content}</Box>
        </Box>
      </Modal>
    </div>
  )
}
