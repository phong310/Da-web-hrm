import { Button, CircularProgress, Grid, styled } from '@mui/material'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
import { FormModal } from 'components/Form/Components/FormModal'
import { STATUS_FORM } from 'lib/types/applicationForm'
import { SIZE_BUTTON } from 'lib/utils/contants'
// import { FormModal } from 'components/Form'
// import { ButtonCommon } from 'components/Form/components/ButtonCommon'
// import { STATUS_FORM } from 'constants'
// import { SIZE_BUTTON } from 'lib/utils'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface IFooterApplicationProps {
  handleAction: (action: string) => void
  handleCancel: () => void
  isManagerEdit: boolean
  isEdit: boolean
  isCancel: boolean
  loading: boolean
  isSubmit: boolean
  isAprroverApprove: boolean
  isDisaleEdit: boolean
  status: number
}

const FooterApplication: React.FC<IFooterApplicationProps> = ({
  handleAction,
  handleCancel,
  isManagerEdit,
  isCancel,
  isEdit,
  isAprroverApprove,
  loading,
  isSubmit,
  isDisaleEdit,
  status
}) => {
  const { t } = useTranslation()

  const [openModalAccept, setOpenModalAccept] = useState<boolean>(false)
  const [openModalReject, setOpenModalReject] = useState<boolean>(false)
  const [openModalCancel, setOpenModalCancel] = useState<boolean>(false)

  const handleClose = () => {
    setOpenModalAccept(false)
    setOpenModalReject(false)
    setOpenModalCancel(false)
  }

  const [openModalRejectAfterAccept, setOpenModalRejectAfterAccept] = useState<boolean>(false)

  const grid_button = {
    sm: 3,
    xs: 6
  }
  const grid_button_manager = {
    sm: 4,
    xs: 6
  }
  return (
    <>
      {!isManagerEdit && !isEdit ? (
        <Grid container justifyContent="center" spacing={3}>
          <Grid item {...grid_button} sx={{ mt: 2 }}>
            <ButtonCommon
              type="submit"
              variant="contained"
              startIcon={isSubmit ? <CircularProgress color="inherit" size="16px" /> : ''}
              sx={{ whiteSpace: 'nowrap' }}
            >
              {t('submit')}
            </ButtonCommon>
          </Grid>
        </Grid>
      ) : isManagerEdit ? (
        status === STATUS_FORM.UNAPPROVED && loading ? undefined : status ===
            STATUS_FORM.UNAPPROVED && !loading ? (
          <>
            <Grid item xs={12} container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
              <Grid item {...grid_button_manager}>
                <ButtonCommon
                  error={true}
                  variant="outlined"
                  onClick={() => setOpenModalReject(true)}
                >
                  {t('reject')}
                </ButtonCommon>
              </Grid>
              {isAprroverApprove ? (
                <Grid item {...grid_button_manager}>
                  <ButtonCommon
                    variant="contained"
                    onClick={() => setOpenModalAccept(true)}
                    startIcon={isSubmit ? <CircularProgress color="inherit" size="16px" /> : ''}
                  >
                    {t('accept')}
                  </ButtonCommon>
                </Grid>
              ) : undefined}
            </Grid>
            <FormModal
              open={openModalAccept}
              handleClose={handleClose}
              onSubmit={() => {
                handleAction('accept')
              }}
              isCancel={isCancel}
              startIcon={isSubmit ? <CircularProgress color="inherit" size="16px" /> : ''}
              title={t('application_management.modal_title')}
              content={t('application_management.accept_content')}
            />
            <FormModal
              open={openModalReject}
              z
              handleClose={handleClose}
              onSubmit={() => {
                handleAction('reject')
              }}
              isCancel={isCancel}
              title={t('application_management.reject_title')}
              content={t('application_management.reject_content')}
            />
          </>
        ) : status === STATUS_FORM['APPROVED'] ? (
          <Grid item xs={12} container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
            <Grid item {...grid_button_manager}>
              <ButtonCommon
                error={true}
                variant="outlined"
                onClick={() => setOpenModalRejectAfterAccept(true)}
              >
                {t('reject')}
              </ButtonCommon>
            </Grid>

            <FormModal
              open={openModalRejectAfterAccept}
              handleClose={() => setOpenModalRejectAfterAccept(false)}
              onSubmit={() => {
                handleAction('reject-after-accept')
              }}
              isCancel={isCancel}
              startIcon={isSubmit ? <CircularProgress color="inherit" size="16px" /> : ''}
              title={t('application_management.modal_title')}
              content={t('application_management.reject_content')}
            />
          </Grid>
        ) : (
          <Grid item xs={12} container spacing={2} justifyContent="center" sx={{ mt: 2 }}></Grid>
        )
      ) : !isDisaleEdit ? (
        <Grid container spacing={2} justifyContent={{ xs: 'center' }} mt={0.5}>
          <Grid item {...grid_button}>
            <ButtonCommon variant="outlined" onClick={() => setOpenModalCancel(true)} error={true}>
              {t('cancel')}
            </ButtonCommon>
          </Grid>
          <Grid item {...grid_button}>
            <ButtonCommon
              sx={{ fontSize: SIZE_BUTTON.MAX }}
              variant="contained"
              type="submit"
              startIcon={isSubmit ? <CircularProgress color="inherit" size="16px" /> : ''}
            >
              {t('update')}
            </ButtonCommon>
          </Grid>
          <FormModal
            open={openModalCancel}
            handleClose={handleClose}
            isCancel={isCancel}
            onSubmit={() => {
              handleCancel()
            }}
            title={t('application_form.cancel_modal_title')}
            content={t('application_form.cancel_content')}
          />{' '}
        </Grid>
      ) : (
        <Grid container spacing={2} justifyContent={{ xs: 'center' }} mt={5}></Grid>
      )}
    </>
  )
}

export const ButtonNoWrap = styled(Button)({
  whiteSpace: 'nowrap'
})

export { FooterApplication }

