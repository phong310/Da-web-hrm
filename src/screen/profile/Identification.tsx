import { Grid, Stack } from '@mui/material'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
import { DatePicker } from 'components/Form/Input/DatePicker'
import { Input } from 'components/Form/Input/Input'
import { RoundPaper } from 'components/Layouts/Page/RoundPaper'
import { V1 } from 'constants/apiVersion'
import { useApiResource } from 'lib/hook/useApiResource'
import { IdentificationCard, IdentificationCards, IdentificationCardsObj } from 'lib/types/identificationCard'
import { IDENTITY_TYPE } from 'lib/utils/contants'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { InfoPropsType, TextTitle } from './TableProfileInfo'

export type TypeIndentification = {
  ID_no: string
  issued_by: string
  issued_date: string
  ID_expire: string
}

export const Identification: React.VFC<InfoPropsType> = () => {
  const params = useParams()
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()

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
  const { createOrUpdateApi } = useApiResource<IdentificationCardsObj>(
    `/1.0/user/me/update-identification`
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
  })

  useQuery<IdentificationCards>([`${V1}/user/me/identification`], {
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
    }
  })

  const onSubmit: SubmitHandler<IdentificationCardsObj> = async (value) => {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    try {
      // const customValue = { ...value, id: params.id }

      const res = await createOrUpdateApi(value)
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
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RoundPaper>
          <Stack>
            <TextTitle>CMT/CCCD</TextTitle>
            <Stack pl={4}>
              {identificationCards.map((card, index) => {
                const type = card.type == IDENTITY_TYPE['CMT'] ? 'CMT' : 'TCC'
                if (type === 'CMT') {
                  return (
                    <Grid container columnSpacing={2} rowSpacing={3} key={index}>
                      <Grid item container sm={12} columnSpacing={2} rowSpacing={3} mr={4}>
                        <Grid item {...grid}>
                          <Input
                            fullWidth
                            label={t('identity_paper.id_no')}
                            placeholder={t('identity_paper.id_no')}
                            control={control}
                            type="number"
                            name={`${type}.ID_no`}
                          />
                        </Grid>
                        <Grid item {...grid}>
                          <Input
                            fullWidth
                            label={t('identity_paper.issued_by')}
                            placeholder={t('identity_paper.issued_by')}
                            control={control}
                            name={`${type}.issued_by`}
                          />
                        </Grid>
                      </Grid>
                      <Grid item container sm={12} columnSpacing={2} rowSpacing={3} mr={4}>
                        <Grid item {...grid}>
                          <DatePicker
                            label={t('identity_paper.issued_date')}
                            name={`${type}.issued_date`}
                            // maxDate={new Date(new Date().valueOf() - 10000 * 60 * 60 * 24)}
                            control={control}
                            fullWidth
                          />
                        </Grid>
                        <Grid item {...grid}>
                          <DatePicker
                            label={t('identity_paper.id_expire')}
                            name={`${type}.ID_expire`}
                            // maxDate={new Date(new Date().valueOf() + 10000000 * 60 * 60 * 24)}
                            // minDate={new Date(new Date().valueOf() - 1000 * 60 * 60 * 24)}
                            control={control}
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  )
                }
              })}
            </Stack>
            <Stack direction={'row'} m={4} justifyContent={'end'} spacing={1}>
              <Grid container justifyContent="flex-end" gap={2} style={{ marginTop: 20 }}>
                <ButtonCommon sx={{ maxWidth: '150px' }} type="submit" variant="contained">
                  {t('update')}
                </ButtonCommon>
              </Grid>
            </Stack>
          </Stack>
        </RoundPaper>
      </form>
    </>
  )
}
