import { Grid, Typography } from '@mui/material'
import { Box, styled } from '@mui/material'
import { useTranslation } from 'react-i18next'
import NoData from 'assets/svgs/Frame.svg'
import { RoundPaper } from 'components/Layouts/Page/RoundPaper'
import { minutesToDays } from 'lib/utils/format'

export interface WorkingTimeInMonthProps {
  coefficientSalary: (string | number)[]
  totalOvertime: any
}

const OverTimeInMonth = ({ coefficientSalary, totalOvertime }: WorkingTimeInMonthProps) => {
  const { t } = useTranslation()

  return (
    <Grid item xs={12} md={12}>
      <RoundPaper
        sx={{
          ...styleRoundPaper
        }}
      >
        <Box sx={{ ...styleBoxOT }}>
          <Box sx={{ ...titletile }}></Box>
          <Typography variant="h6" sx={{ ...styleStatisticTitle }}>
            {t('timesheet.overtime_in_month.title')}
          </Typography>
        </Box>
        <Box>
          {coefficientSalary.length ? (
            <Grid container spacing="20px" alignItems="stretch">
              {coefficientSalary.map((item: any, index) => (
                <Grid key={index} item xs={6} sm={6} md={6} lg={3}>
                  <Box sx={{ ...styleBoxItem }}>
                    <Typography variant="h6" sx={{ ...styleStatisticItem }}>{`OT ${
                      item * 100
                    }%`}</Typography>
                    <Typography variant="h2" sx={{ ...textAlignCenter }}>
                      {minutesToDays(totalOvertime[item] || 0)}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ ...styleBoxEmpty }}>
              <Typography variant="h6" sx={{ ...styleStatisticItem }}>
                <Box
                  sx={{ ...styleImgSvgs }}
                  component={'img'}
                  src={NoData}
                  alt="logo"
                  height={138}
                />
              </Typography>
            </Box>
          )}
        </Box>
      </RoundPaper>
    </Grid>
  )
}

export { OverTimeInMonth }

const styleRoundPaper = {
  borderRadius: '16px',
  marginTop: 2,
  padding: '20px 20px',
  minHeight: '254px'
}

const titletile = {
  width: '6px',
  height: '30px',
  backgroundColor: '#FEC619',
  borderRadius: '5px'
}

const styleBoxOT = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginBottom: '20px'
}

const styleBoxEmpty = {
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100%'
}

const styleStatisticTitle = {
  fontSize: { xs: '16px', md: '20px' },
  fontWeight: '700',
  lineHeight: '28px',
  letterSpacing: '0.05em'
}
const styleStatisticItem = {
  fontSize: { xs: '12px', md: '16px' },
  lineHeight: '22px'
}
const textAlignCenter = {
  fontSize: { xs: '16px', md: '30px' },
  fontWeight: '700',
  lineHeight: '36px',
  letterSpacing: '0.05em'
}

const styleImgSvgs = {
  width: { xs: 58, md: 108 },
  height: { xs: 88, md: 138 }
}

const styleBoxItem = {
  width: '100%',
  display: 'inline-flex',
  borderRadius: '10px',
  flexDirection: 'column',
  backgroundColor: '#fff9e8',
  justifyContent: 'center',
  textAlign: 'center',
  alignItems: 'center',
  gap: '10px',
  height: '153px',
  padding: { xs: '32px 16px', md: '43px 13px' }
}
