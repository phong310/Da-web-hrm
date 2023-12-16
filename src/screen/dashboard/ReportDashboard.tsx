/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Grid, styled, Typography } from '@mui/material'
import { CardOuter } from 'components/Card/CardOuter'
import { MinimalCard } from 'components/Card/MinimalCard'
import TitleCard from 'components/ReactTable/Components/TitleCard'
import { minutesToHourObject } from 'lib/utils/utils'
import { useTranslation } from 'react-i18next'
import { Base } from 'styles/colors'

type IProps = {
  titleReport: string
  titleList: string[] | any[]
  isTimeStatisticBox?: boolean
  data: any
  month?: string
  background?: string
  colorText: string
  isPermisstion?: boolean
}

function ReportDashboard({
  titleReport,
  titleList,
  month,
  data,
  isTimeStatisticBox = false,
  isPermisstion = false,
  background,
  colorText
}: IProps) {
  const { t } = useTranslation()

  return (
    <Grid item xs={12} mb={{ xs: 3, md: 4 }}>
      <CardOuter>
        <Box>
          <TitleCard color={colorText}>
            <TextTitleStyle>{titleReport}</TextTitleStyle>
          </TitleCard>
        </Box>

        <Grid container sx={{ width: '100%' }} spacing={{ xs: 0, md: 2.5 }}>
          {titleList.map((item: any, index: number) => (
            <Grid
              key={index}
              item
              xs={6}
              sm={3}
              md={6}
              lg={3}
              marginTop={2.25}
              pr={{ xs: 2, md: 0 }}
            >
              <BoxOuter>
                <MinimalCard
                  title={
                    isTimeStatisticBox
                      ? t(`dashboard.${item}`)
                      : isPermisstion
                      ? t(`application_management.${item.titleSuffix}`)
                      : t(`dashboard.${item.titleSuffix}`)
                  }
                  content={isTimeStatisticBox ? minutesToHourObject(data[item]) : data[item.key]}
                  isTimeStatisticBox={isTimeStatisticBox}
                  userApiPrefix={
                    isTimeStatisticBox || isPermisstion ? undefined : item.userApiPrefix
                  }
                  adminApiPrefix={isPermisstion ? item.adminApiPrefix : undefined}
                  month={month}
                  background={background}
                  colorText={colorText}
                />
              </BoxOuter>
            </Grid>
          ))}
        </Grid>
      </CardOuter>
    </Grid>
  )
}

export default ReportDashboard

const BoxOuter = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    padding: 0
  }
}))

const TextTitleStyle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: 20,
  lineHeight: '28px',
  color: Base.black,
  [theme.breakpoints.down('sm')]: {
    fontSize: 16,
    lineHeight: '22px'
  }
}))
