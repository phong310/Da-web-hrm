import { Grid, Stack } from '@mui/material'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
import { Input } from 'components/Form/Input/Input'
import { RoundPaper } from 'components/Layouts/Page/RoundPaper'
import { V1 } from 'constants/apiVersion'
import { useApiResource } from 'lib/hook/useApiResource'
import { useAuth } from 'lib/hook/useAuth'
import { Address, Addresses, AddressesObj } from 'lib/types/address'
import { ADDRESS_TYPE } from 'lib/utils/contants'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { InfoPropsType, TextTitle } from './TableProfileInfo'


const AddressProfile: React.VFC<InfoPropsType> = () => {
  const params = useParams()
  const { t } = useTranslation()
  const { user } = useAuth()

  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const employee_id = user?.employee.id
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 0,
      province: '',
      district: '',
      ward: '',
      address: '',
      type: ADDRESS_TYPE['RESIDENT'],
      personal_information_id: -1
    },
    {
      id: 0,
      province: '',
      district: '',
      ward: '',
      address: '',
      type: ADDRESS_TYPE['DOMICILE'],
      personal_information_id: -1
    }
  ])

  const isEdit = !!params.id
  const { createOrUpdateApi } = useApiResource<AddressesObj>(
    `${V1}/user/me/update-address/${employee_id}`
  )

  const { control, handleSubmit, setValue, setError } = useForm<AddressesObj>({
    defaultValues: {
      RESIDENT: {
        province: '',
        district: '',
        ward: '',
        address: '',
        type: ADDRESS_TYPE['RESIDENT'],
        personal_information_id: -1,
      },
      DOMICILE: {
        province: '',
        district: '',
        ward: '',
        address: '',
        type: ADDRESS_TYPE['DOMICILE'],
        personal_information_id: -1
      }
    }
  })

  useQuery<Addresses>([`${V1}/user/me/address`], {
    onSuccess: (data: any) => {
      data.forEach((d: Address) => {
        if (d.type == ADDRESS_TYPE['RESIDENT']) {
          setValue('RESIDENT', d)
        } else {
          setValue('DOMICILE', d)
        }
      })
    },
    enabled: true
  })

  const onSubmit: SubmitHandler<AddressesObj> = async (value) => {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    try {
      // const customValue = { ...value, id: params.id }
      const res = await createOrUpdateApi(value)
      if (res.status == 200) {
        const message = res.data.message
        toast.success(message)
        setIsLoading(false)
      }
    } catch (error:any) {
      setIsLoading(false)
      if (error.errors) {
        for (const [key, value] of Object.entries(error.errors)) {
          setError(key as keyof AddressesObj, { message: t(value as string) })
        }
      }
    }
  }

  const grid = { xs: 12, sm: 6 }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {addresses.map((address, idx) => {
          const type = address.type == ADDRESS_TYPE['RESIDENT'] ? 'RESIDENT' : 'DOMICILE'
          const title = address.type == ADDRESS_TYPE['RESIDENT'] ? 'resident' : 'domicile'

          return (
            <Grid container direction={'column'} sx={{ mb: 2 }} spacing={2} key={idx}>
              <Grid item xs={12} sm={6}>
                <RoundPaper>
                  <TextTitle> {t(`address.${title}`)}</TextTitle>
                  <Grid container sx={{ px: '20px', mb: 4 }} columnSpacing={2} rowSpacing={3}>
                    <Grid item container sm={12} columnSpacing={2} rowSpacing={3}>
                      <Grid item {...grid}>
                        <Input
                          fullWidth
                          name={`${type}.province`}
                          label={t('address.province')}
                          placeholder={t('address.province')}
                          control={control}
                        />
                      </Grid>
                      <Grid item {...grid}>
                        <Input
                          fullWidth
                          name={`${type}.district`}
                          label={t('address.district')}
                          placeholder={t('address.district')}
                          control={control}
                        />
                      </Grid>
                    </Grid>
                    <Grid item container sm={12} columnSpacing={2} rowSpacing={3}>
                      <Grid item {...grid}>
                        <Input
                          fullWidth
                          label={t('address.ward')}
                          placeholder={t('address.ward')}
                          name={`${type}.ward`}
                          control={control}
                        />
                      </Grid>
                      <Grid item {...grid}>
                        <Input
                          fullWidth
                          label={t('address.name')}
                          placeholder={t('address.name')}
                          name={`${type}.address`}
                          control={control}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </RoundPaper>
              </Grid>
            </Grid>
          )
        })}
        <Stack direction={'row'} m={2} justifyContent={'end'} spacing={1}>
          <Grid container justifyContent="flex-end" gap={2} style={{ marginTop: 20 }}>
            <ButtonCommon sx={{ maxWidth: '150px' }} type="submit" variant="contained">
              {t('update')}
            </ButtonCommon>
          </Grid>
        </Stack>
      </form>
    </>
  )
}

export default AddressProfile
