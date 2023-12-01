import { Button, CircularProgress, Grid, styled } from '@mui/material'
import { Box } from '@mui/system'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
import { DatePicker } from 'components/Form/Input/DatePicker'
import { Input } from 'components/Form/Input/Input'
import { Page } from 'components/Layouts/Page/Page'
import { PageTable } from 'components/Layouts/Page/PageTable'
import { RoundPaper } from 'components/Layouts/Page/RoundPaper'
import { V1 } from 'constants/apiVersion'
import { useApiResource } from 'lib/hook/useApiResource'
import { IdentificationCard, IdentificationCards, IdentificationCardsObj } from 'lib/types/identificationCard'
import { IDENTITY_TYPE } from 'lib/utils/contants'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { styleHeightInput } from './EmployeeForm'
import { EmployeeTabs } from './EmployeeTabs'

const EmployeeIdenCard: React.VFC = () => {
  const params = useParams()
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [identificationCards, setIdentificationCards] = useState<IdentificationCard[]>([
    {
      id: -1,
      ID_no: '',
      issued_date: '',
      issued_by: '',
      ID_expire: '',
      type: IDENTITY_TYPE['CMT'],
      personal_information_id: -1
    },
    {
      id: -1,
      ID_no: '',
      issued_date: '',
      issued_by: '',
      ID_expire: '',
      type: IDENTITY_TYPE['TCC'],
      personal_information_id: -1
    }
  ])
  const isEdit = !!params.id
  const { createOrUpdateApi } = useApiResource<IdentificationCardsObj>(
    `${V1}/user/identification-card/employee`
  )

  const { control, handleSubmit, setValue, getValues, setError } = useForm<IdentificationCardsObj>({
    defaultValues: {
      CMT: {
        ID_no: '',
        issued_date: '',
        issued_by: '',
        ID_expire: '',
        type: IDENTITY_TYPE['CMT'],
        personal_information_id: -1
      },
      TCC: {
        ID_no: '',
        issued_date: '',
        issued_by: '',
        ID_expire: '',
        type: IDENTITY_TYPE['TCC'],
        personal_information_id: -1
      }
    }
    // resolver: yupResolver(validateIdNo)
  })

  useQuery<IdentificationCards>([`${V1}/user/identification-card/employee/${params.id}`], {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any) => {
      data.forEach((d: IdentificationCard) => {
        if (d.type == IDENTITY_TYPE['CMT']) {
          setValue('CMT', d)
        } else {
          setValue('TCC', d)
        }
      })

      // setIdentificationCards(data)
    },
    enabled: !!isEdit
  })

  const onSubmit: SubmitHandler<IdentificationCardsObj> = async (value) => {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    try {
      const customValue = { ...value, id: params.id }

      const res = await createOrUpdateApi(customValue)
      // const res = await createOrUpdateApi(value)
      if (res.status == 200) {
        const message = res.data.message
        toast.success(message)
        setIsLoading(false)
      }
    } catch (error:any) {
      if (error.errors) {
        setIsLoading(false)
        for (const [key, value] of Object.entries(error.errors)) {
          setError(key as keyof IdentificationCardsObj, { message: t(value as string) })
        }
      }
    }
  }

  const grid = { xs: 12, md: 6 }

  return (
    <PageTable isDisableBreadcrumb={false}>
      <RoundPaper>
        <Box sx={{ paddingTop: '16px' }}>
          <EmployeeTabs />
          <Page elevation={0} title={t('identity_paper.name')} isDisableBreadcrumb={true}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
              <Box
                sx={{
                  mt: { xs: 0, sm: 2 },
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: { xs: 'column', md: 'row' }
                }}
                gap={2}
              >
                {identificationCards.map((card, index) => {
                  const type = card.type == IDENTITY_TYPE['CMT'] ? 'CMT' : 'TCC'

                  if (type === 'CMT') {
                    return (
                      <Box
                        key={index}
                        sx={{
                          ...styleGroupIndentification
                        }}
                      >
                        <strong>{t('identity_paper.title_id_no')}</strong>
                        <Grid container rowSpacing={2} columnSpacing={2}>
                          <Grid container rowSpacing={2} columnSpacing={2} item md={12} spacing={2}>
                            <Grid item {...grid}>
                              <Input
                                fullWidth
                                name={`${type}.ID_no`}
                                label={t('identity_paper.id_no')}
                                control={control}
                                placeholder={t('identity_paper.id_no')}
                                sx={{ ...styleHeightInput }}
                                type="number"
                                inputProps={{
                                  inputMode: 'numeric',
                                  pattern: '[0-9]*'
                                }}
                              />
                            </Grid>
                            <Grid item {...grid}>
                              <Input
                                fullWidth
                                name={`${type}.issued_by`}
                                label={t('identity_paper.issued_by')}
                                placeholder={t('identity_paper.issued_by')}
                                control={control}
                                sx={{ ...styleHeightInput }}
                              />
                            </Grid>
                          </Grid>
                          <Grid container rowSpacing={2} columnSpacing={2} item md={12} spacing={2}>
                            <Grid item {...grid}>
                              <DatePicker
                                fullWidth
                                label={t('identity_paper.issued_date')}
                                name={`${type}.issued_date`}
                                control={control}
                              />
                            </Grid>
                            <Grid item {...grid}>
                              <DatePicker
                                fullWidth
                                name={`${type}.ID_expire`}
                                label={t('identity_paper.id_expire')}
                                control={control}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>
                    )
                  }
                })}
              </Box>
              <Grid
                container
                rowSpacing={2}
                justifyContent="flex-end"
                gap={2}
                style={{ marginTop: 20 }}
                xs={12}
              >
                <Grid xs={4} sm={3} md={2.5} lg={1.5} xl={1.2}>
                  <Box>
                    <ButtonCommon
                      startIcon={isLoading ? <CircularProgress color="inherit" size="16px" /> : ''}
                      type="submit"
                      variant="contained"
                    >
                      {t('submit')}
                    </ButtonCommon>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Page>
        </Box>
      </RoundPaper>
    </PageTable>
  )
}
const styleGroupIndentification = {
  width: { xs: '100%', md: '50%' },
  border: '1px solid #cbcbcb',
  borderRadius: 4,
  p: { xs: 2, md: 3 },
  mt: { xs: 1 },
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  flexWrap: 'wrap'
}

export const ButtonUpdateStatus = styled(Button)(({ theme }) => ({
  fontSize: '16px'
}))
export { EmployeeIdenCard }

