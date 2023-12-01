import { CircularProgress, Grid } from '@mui/material'
import { Box } from '@mui/system'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
import { Input } from 'components/Form/Input/Input'
import { Page } from 'components/Layouts/Page/Page'
import { PageTable } from 'components/Layouts/Page/PageTable'
import { RoundPaper } from 'components/Layouts/Page/RoundPaper'
import { V1 } from 'constants/apiVersion'
import { useApiResource } from 'lib/hook/useApiResource'
import { Address, Addresses, AddressesObj } from 'lib/types/address'
import { ADDRESS_TYPE } from 'lib/utils/contants'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { EmployeeTabs } from './EmployeeTabs'

const EmployeeAddress: React.VFC = () => {
  const params = useParams()
  const { t } = useTranslation()

  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false)

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
  const { createOrUpdateApi } = useApiResource<AddressesObj>(`${V1}/user/address/employee`)

  const { control, handleSubmit, setValue, setError } = useForm<AddressesObj>({
    defaultValues: {
      RESIDENT: {
        province: '',
        district: '',
        ward: '',
        address: '',
        type: ADDRESS_TYPE['RESIDENT'],
        personal_information_id: -1
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

  useQuery<Addresses>([`${V1}/user/address/employee/${params.id}`], {
    onSuccess: (data: any) => {
      data.forEach((d: Address) => {
        if (d.type == ADDRESS_TYPE['RESIDENT']) {
          setValue('RESIDENT', d)
        } else {
          setValue('DOMICILE', d)
        }
      })
    },
    enabled: !!isEdit
  })

  const onSubmit: SubmitHandler<AddressesObj> = async (value) => {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    try {
      const customValue = { ...value, id: params.id }
      const res = await createOrUpdateApi(customValue)
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

  const grid = { xs: 12 }

  const height = '74px'

  return (
    <PageTable>
      <RoundPaper>
        <Box sx={{ paddingTop: '16px' }}>
          <EmployeeTabs />
          <Page isDisableBreadcrumb={true} elevation={0} title={t('address.name')}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
              <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
                {addresses.map((address, idx) => {
                  const type = address.type == ADDRESS_TYPE['RESIDENT'] ? 'RESIDENT' : 'DOMICILE'
                  const title = address.type == ADDRESS_TYPE['RESIDENT'] ? 'resident' : 'domicile'

                  return (
                    <Grid
                      container
                      item
                      md={5.9}
                      xs={12}
                      key={idx}
                      sx={{
                        ...StyleGroupAddress
                      }}
                      rowSpacing={{ xs: 2, sm: 3 }}
                    >
                      <Grid container item md={12} spacing={2}>
                        <Grid item md={12} xs={12}>
                          <div
                            style={{
                              ...styleTilteAddress
                            }}
                          >
                            <strong style={{ textTransform: 'uppercase' }}>
                              {t(`address.${title}`)}
                            </strong>
                          </div>
                        </Grid>
                        <Grid item {...grid}>
                          <Box height={height}>
                            <Input
                              fullWidth
                              name={`${type}.province`}
                              label={t('address.province')}
                              placeholder={t('address.province')}
                              control={control}
                            />
                          </Box>
                        </Grid>
                        <Grid item {...grid}>
                          <Box height={height}>
                            <Input
                              fullWidth
                              name={`${type}.district`}
                              label={t('address.district')}
                              placeholder={t('address.district')}
                              control={control}
                            />
                          </Box>
                        </Grid>
                        <Grid item {...grid}>
                          <Box height={height}>
                            <Input
                              fullWidth
                              label={t('address.ward')}
                              placeholder={t('address.ward')}
                              name={`${type}.ward`}
                              control={control}
                            />
                          </Box>
                        </Grid>
                        <Grid item {...grid}>
                          <Box height={height}>
                            <Input
                              fullWidth
                              label={t('address.name')}
                              placeholder={t('address.name')}
                              name={`${type}.address`}
                              control={control}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                  )
                })}
              </Grid>

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
const styleTilteAddress = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}
const StyleGroupAddress = {
  border: '1px solid #cbcbcb',
  borderRadius: 4,
  p: { xs: '0 16px 16px 16px', md: '0 24px 24px 24px' },
  mt: { xs: 1 }
}

export { EmployeeAddress }

