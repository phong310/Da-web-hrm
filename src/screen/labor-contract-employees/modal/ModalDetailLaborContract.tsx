import CloseIcon from '@mui/icons-material/Close'

import {
  AppBar,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  Grid,
  IconButton,
  Toolbar,
  Typography
} from '@mui/material'
// import { USER_URL } from 'constants'
// import { useAuth } from 'lib/hooks'
// import { AllowanceType, LaborContractType } from 'lib/types'
// import { formatDate, numberWithCommas } from 'lib/utils'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { StatusLaborContract } from '../Atom/StatusLaborContract'
import { AllowanceType, LaborContractType } from 'lib/types/labor-contract'
import { useAuth } from 'lib/hook/useAuth'
import { USER_URL } from 'constants/apiVersion'
import { formatDate } from 'lib/utils/format'
import { numberWithCommas } from 'lib/utils/format-number'
import { ActivityUser } from '../components/ActivityUser'
import { SalaryBonusUser } from '../components/SalaryBonusUser'
// import { ActivityUser } from '../components/ActivityUser'
// import { SalaryBonusUser } from '../components/SalaryBonusUser'

type PropType = DialogProps & {
  open: boolean
  handleClose?: () => void
  dataDetail?: LaborContractType
}

export type ResponseType<T> = {
  data: T[]
  allowances: AllowanceType[] | number[] | any
}

export const ModalDetailLaborContract: React.FC<PropType> = ({ open, handleClose, dataDetail }) => {
  const { t } = useTranslation()
  const { systemSetting } = useAuth()

  const [allowanceDetail, setAllowanceDetail] = useState<AllowanceType[]>()
  const [active, setActive] = useState<LaborContractType | any>()

  useQuery<ResponseType<LaborContractType | any>>(
    [`${USER_URL}/labor-contract/user/${dataDetail?.id}`],
    {
      onSuccess: (data) => {
        setAllowanceDetail(data.allowances)
        setActive(data)
      },
      enabled: dataDetail?.id ? true : false
    }
  )

  return (
    <>
      <Dialog open={open} fullWidth maxWidth="sm">
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1, ...styleTitleDialog }} variant="h6" component="div">
              {t('labor_contract.labor_contract_detail_breadcrumb')}
            </Typography>
            <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon sx={{ ...styleIconClose }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent sx={{ ...styleBoxContainer }}>
          <Box>
            <Grid>
              <Typography sx={{ flex: 1, ...styleTitle }} variant="subtitle1" component="div">
                {t('labor_contract.infor_labor_contract')}
              </Typography>
            </Grid>
            <Grid sx={{ ...styleChild }}>
              <Grid display={'flex'} justifyContent={'space-between'}>
                <Typography sx={{ flex: 1, ...styleBelow }} variant="body2" component="div">
                  {t('labor_contract.code')}
                </Typography>
                <Typography sx={{ ...styleKindOfLeave }} variant="body1" component="div">
                  {dataDetail?.code}
                </Typography>
              </Grid>
              <Grid display={'flex'} justifyContent={'space-between'}>
                <Typography sx={{ flex: 1, ...styleBelow }} variant="body2" component="div">
                  {t('labor_contract.type_labor_contract')}
                </Typography>
                <Typography sx={{ ...styleKindOfLeave }} variant="body1" component="div">
                  {dataDetail?.labor_contract_type.name}
                </Typography>
              </Grid>
              <Grid display={'flex'} justifyContent={'space-between'}>
                <Typography sx={{ flex: 1, ...styleBelow }} variant="body2" component="div">
                  {t('labor_contract.effective_date')}
                </Typography>
                <Typography sx={{ ...styleKindOfLeave }} variant="body1" component="div">
                  {dataDetail?.effective_date
                    ? formatDate(dataDetail.effective_date, systemSetting?.format_date)
                    : ''}
                </Typography>
              </Grid>
              <Grid display={'flex'} justifyContent={'space-between'}>
                <Typography sx={{ flex: 1, ...styleBelow }} variant="body2" component="div">
                  {t('labor_contract.expire_date')}
                </Typography>
                <Typography sx={{ ...styleKindOfLeave }} variant="body1" component="div">
                  {dataDetail?.effective_date
                    ? formatDate(dataDetail?.expire_date, systemSetting?.format_date)
                    : ''}
                </Typography>
              </Grid>
              <Grid display={'flex'} justifyContent={'space-between'}>
                <Typography sx={{ flex: 1, ...styleBelow }} variant="body2" component="div">
                  {t('labor_contract.sign_date')}
                </Typography>
                <Typography sx={{ ...styleKindOfLeave }} variant="body1" component="div">
                  {dataDetail?.effective_date
                    ? formatDate(dataDetail?.sign_date, systemSetting?.format_date)
                    : ''}
                </Typography>
              </Grid>
              <Grid display={'flex'} flexDirection={'column'}>
                <Typography sx={{ flex: 1, ...styleAllownance }} variant="body2" component="div">
                  {t('labor_contract.allowance')}
                </Typography>
                <Typography
                  sx={{ ...styleNote, textAlign: 'right' }}
                  variant="body1"
                  component="div"
                >
                  <Box sx={{ ...ChipWrapper }}>
                    {allowanceDetail?.map((item) => (
                      <Chip
                        key={item.id}
                        size="small"
                        label={`${item.name} (${numberWithCommas(item.amount_of_money)} vnđ/tháng)`}
                        sx={{ ...customChip }}
                      />
                    ))}
                  </Box>
                </Typography>
              </Grid>
              <Grid display={'flex'} justifyContent={'space-between'} alignItems={'self-start'}>
                <Typography sx={{ flex: 1, ...styleBelow }} variant="body2" component="div">
                  {t('labor_contract.status.name')}
                </Typography>
                <StatusLaborContract value={dataDetail?.status} />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, mb: 3 }}>
              <Divider sx={{ ...styleDivider }} />
            </Box>

            <SalaryBonusUser dataDetail={dataDetail} />

            <Box sx={{ mt: 2, mb: 3 }}>
              <Divider sx={{ ...styleDivider }} />
            </Box>

            <ActivityUser active={active} />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}
const styleBoxContainer = {
  maxHeight: ' 750px',
  overflowY: 'auto',
  overflowX: 'auto',
  '::-webkit-scrollbar': { width: 4, height: 8 },
  '::-webkit-scrollbar-thumb': {
    backgroundColor: '#BBBBBB'
  }
}
const ChipWrapper = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  width: { xs: 280, sm: 420, md: 536 },
  padding: '8px'
}

const styleDivider = {
  margin: '0 -24px',
  width: 'calc(100% + 48px)'
}

const customChip = {
  borderRadius: '999px'
}

const styleTitleDialog = {
  fontSize: { xs: '14px', sm: '18px' }
}

const styleIconClose = {
  width: { xs: '20px', sm: '30px' }
}

const styleTitle = {
  color: '#146BD2',
  fontSize: { xs: '13px', sm: '18px' },
  fontStyle: 'normal',
  fontWeight: '600',
  lineHeight: '26px',
  mb: 2,
  pt: 1
}

const styleBelow = {
  fontSize: { xs: '14px', sm: '16px' },
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '22px',
  mb: 3,
  color: '#111'
}

const styleAllownance = {
  fontSize: { xs: '14px', sm: '16px' },
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '22px',
  color: '#111',
  mb: 1
}

const styleNote = {
  fontSize: { xs: '12px', sm: '14px' },
  fontStyle: 'normal',
  fontWeight: '600',
  lineHeight: '22px',
  // width: { xs: '100px', sm: '300px' },
  mb: 3,
  display: 'flex',
  justifyContent: 'center'
}

const styleKindOfLeave = {
  fontSize: { xs: '13px', sm: '16px' },
  fontStyle: 'normal',
  fontWeight: '600',
  lineHeight: '22px',
  textAlign: 'right',
  width: { xs: '58%', sm: '70%' },
  mb: 3
}

const styleChild = {
  ml: 2
}
