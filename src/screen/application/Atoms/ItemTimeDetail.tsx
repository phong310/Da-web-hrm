import styled from '@emotion/styled'
import { Box, Typography } from '@mui/material'
import { blue } from '@mui/material/colors'
import { useAtomValue } from 'jotai'
// import { systemSettingAtom } from 'lib/atom'
// import {
//   CompensatoryLeaveFormType,
//   LeaveFormType,
//   OvertimeFormType,
//   RequestChangeTimesheetFormType
// } from 'lib/types'
// import { STATUSCHECK, convertDatetimeTZWithoutSecond } from 'lib/utils'
// import { Green, Red, Yellow } from 'styles/v2'
import ForwardOutlinedIcon from '@mui/icons-material/ForwardOutlined'
import { CompensatoryLeaveFormType, LeaveFormType, OvertimeFormType } from 'lib/types/applicationForm'
import { systemSettingAtom } from 'lib/atom/authAtom'
import { convertDatetimeTZWithoutSecond } from 'lib/utils/format'
import { STATUSCHECK } from 'lib/utils/contants'
import { Green, Red, Yellow } from 'styles/colors'
type DateTimeRangeProps = {
  dataDetails: OvertimeFormType | LeaveFormType | CompensatoryLeaveFormType | undefined
}

const ItemTimeDetail: React.VFC<DateTimeRangeProps> = ({ dataDetails }) => {
  const systemSetting: any = useAtomValue(systemSettingAtom)
  return (
    <Box sx={{ ...styleTimeGroup }}>
      <ItemTilteTable status={dataDetails?.status as number}>
        <Typography variant="subtitle1" sx={{ ...styleTime }} component="div">
          {convertDatetimeTZWithoutSecond(
            dataDetails?.start_time,
            systemSetting.time_zone,
            systemSetting.format_date
          )}
        </Typography>
      </ItemTilteTable>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ForwardOutlinedIcon sx={{ color: getBgTimeColor(dataDetails?.status as number) }} />
      </Box>
      <ItemTilteTable status={dataDetails?.status as number}>
        <Typography
          variant="subtitle1"
          sx={{ ...styleTime, color: getBgTimeColor(dataDetails?.status as number) }}
          component="div"
        >
          {convertDatetimeTZWithoutSecond(
            dataDetails?.end_time,
            systemSetting.time_zone,
            systemSetting.format_date
          )}
        </Typography>
      </ItemTilteTable>
    </Box>
  )
}
const ItemTilteTable = styled(Box)<{
  status: number
  // @ts-ignore
}>(({ status, theme }) => {
  return {
    display: 'flex',
    width: '265px',
    border: `1px solid ${getBgTimeColor(status)}`,
    color: getBgTimeColor(status),
    padding: '8px',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '4px',
    background: '#fff',
    borderRadius: '8px'
  }
})
const styleTimeGroup = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  mb: 4
}
const getBgTimeColor = (status: number) => {
  if (status === STATUSCHECK.APPROVALREQUIREMENTS) return blue[600]
  if (status === STATUSCHECK.APPROVED) return Green[600]
  if (status === STATUSCHECK.REFUSE) return Red[400]
  if (status === STATUSCHECK.CANCEL) return Yellow[600]
}
const styleTime = {
  with: '300px',
  fontSize: { xs: '12px', sm: '16px' },
  fontStyle: 'normal',
  fontWeight: '600',
  lineHeight: '26px'
}
export default ItemTimeDetail
