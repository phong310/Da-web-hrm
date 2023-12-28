import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Grid, Stack, styled, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import AvtDefault from 'assets/images/no-image.jpg'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { InferType, object, string } from 'yup'
import { infoEmployee, parseSex, parseUserInfoData, phoneNumber } from '../profile/infoData'
import { useAuth } from 'lib/hook/useAuth'
import { atom, useAtom } from 'jotai'
import { EmployeeType, UserType } from 'lib/types/user'
import { useApiResource } from 'lib/hook/useApiResource'
import { RoundPaper } from 'components/Layouts/Page/RoundPaper'
import { grey } from 'styles/colors'
import { Input } from 'components/Form/Input/Input'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
import { V1 } from 'constants/apiVersion'

export type InfoDataType = {
  key: string
  value: string | number | null
  name: string
  id: number
}

export type InfoPropsType = {
  // infoData: InfoDataType[]
}
export const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

export const avatarProfile = atom<File | null>(null)
export const updateName = atom('')

export const TableProfileInfo: React.VFC<InfoPropsType> = () => {
  const theme = useTheme()
  const table = useMediaQuery(theme.breakpoints.down('md'))
  const { user, systemSetting } = useAuth()
  const { t } = useTranslation()
  // @ts-ignore
  const [tableInfo, setTableInfo] = useState<InfoDataType[]>([])
  // @ts-ignore
  const [infoDetailEmployee, setInfoDetailEmployee] = useState<InfoDataType[]>([])
  const [update, setUpdate] = useState(false)
  // @ts-ignore
  const [files, setFiles] = useState<File>()
  // @ts-ignore
  const [avatar, setAvatar] = useAtom(avatarProfile)
  // @ts-ignore
  const [name, setName] = useAtom(updateName)
  const navigate = useNavigate()
  const location = useLocation()

  type profileType = InferType<typeof profileSchema>
  const profileSchema = object({
    first_name: string().required(t('validate.require')).trim().max(30, t('validate.max')),
    last_name: string().required(t('validate.require')).max(30, t('validate.max')).trim(),
    sex: string().required(t('validate.require')).max(20, t('validate.max')),
    birthday: string().required(t('validate.require')).trim(),
    nickname: string().trim().nullable(),
    email: string().required(t('validate.require')).max(30, t('validate.max')).trim(),
    phone: string()
      .required(t('validate.require'))
      .matches(phoneRegExp, t('validate.phone_number'))
      .trim()
      .max(30, t('validate.max')),

    employee_code: string().required(t('validate.require')).max(30, t('validate.max')).trim(),
    official_employee_date: string().trim().nullable(),
    date_start_work: string().required(t('validate.require')).trim(),
    position: string().required(t('validate.require')).max(100, t('validate.max')).trim(),
    country: string().required(t('validate.require')).max(100, t('validate.max')).trim(),
    title: string().required(t('validate.require')).max(100, t('validate.max')).trim(),
    department: string().required(t('validate.require')).max(100, t('validate.max')).trim(),
    branch: string().required(t('validate.require')).max(100, t('validate.max')).trim()
  })
  const {
    control,
    reset,
    handleSubmit,
    // @ts-ignore
    formState: { errors }
  } = useForm<profileType>({
    resolver: yupResolver(profileSchema),
    mode: 'onChange'
  })
  const { data, refetch } = useQuery<UserType>([`${V1}/user/me`], {
    keepPreviousData: true
  })

  useEffect(() => {
    const _d = data?.employee as unknown as EmployeeType | null
    data && setTableInfo(parseUserInfoData(t, _d, systemSetting) as InfoDataType[])
    data &&
      reset({
        first_name: _d?.personal_information.first_name,
        last_name: _d?.personal_information.last_name,
        sex: parseSex(_d?.personal_information.sex),
        birthday: _d?.personal_information.birthday,
        nickname: _d?.personal_information.nickname || '',
        email: _d?.personal_information.email,
        phone: phoneNumber(_d?.personal_information.phone),
        employee_code: _d?.employee_code,
        official_employee_date: _d?.official_employee_date,
        date_start_work: _d?.date_start_work,
        position: _d?.position?.name,
        country: _d?.personal_information.country?.name,
        title: _d?.personal_information.title?.name,
        department: _d?.department?.name,
        branch: _d?.branch?.name
      })
  }, [data, systemSetting, t, reset, update])

  useEffect(() => {
    const _uEmployee = user?.employee as unknown as EmployeeType | null
    user && setInfoDetailEmployee(infoEmployee(t, _uEmployee, systemSetting) as InfoDataType[])
  }, [user, systemSetting, t])

  const { createOrUpdateApi } = useApiResource<EmployeeType>('/1.0/user/employee/me/info')

  const onSubmit = async (_d: profileType) => {
    const formData = new FormData()
    if (files) {
      formData.append('avatar', files)
    }
    formData.append('first_name', String(_d.first_name))
    formData.append('last_name', String(_d.last_name))
    formData.append('nickname', String(_d.nickname))
    formData.append('email', String(_d.email))
    formData.append('phone', String(_d.phone))
    const res = await createOrUpdateApi(formData)
    if (res.status == 200) {
      setName(_d.first_name + ' ' + _d.last_name)
      if (files) {
        setFiles(files)
        setAvatar(files)
      }
      toast.success(res.data.message)
      setUpdate(false)
      navigate('/general/profile')
      refetch()
    }
  }

  useEffect(() => {
    if (location.pathname === '/general/profile') {
      setUpdate(false)
    }
    if (location.pathname === '/general/profile/edit') {
      setUpdate(true)
    }
  }, [location])
  const grid = { xs: 12, md: 6 }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <Grid
            container
            sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}
          >
            <RoundPaper sx={{ flex: 1 }}>
              <Grid item xs={12} mb={2}>
                <Stack direction={'column'} spacing={3}>
                  <Stack justifyContent="center" pt={2}>
                    <Button
                      component="label"
                      sx={{
                        p: 0,
                        '&:hover': {
                          backgroundColor: 'initial'
                        }
                      }}
                    >
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={(e) => {
                          const listFile = e.target.files as FileList
                          const file = listFile[0]
                          setFiles(file)
                        }}
                      />
                      {files ? (
                        <AvtImg
                          sx={{
                            borderRadius: '50%',
                            width: '150px',
                            height: '150px',
                            flexShrink: '0',
                            '&:hover': {
                              cursor: 'pointer'
                            }
                          }}
                          alt="description"
                          src={URL.createObjectURL(files)}
                        />
                      ) : (
                        <Stack
                          width={table ? 'unset' : '200px'}
                          direction={table ? 'row' : 'column'}
                          justifyContent="center"
                          mt={table ? 1 : 'unset'}
                        >
                          <AvtImg
                            src={
                              user?.employee.personal_information.thumbnail_url
                                ? user?.employee.personal_information.thumbnail_url
                                : AvtDefault
                            }
                            alt="imageUpload"
                            sx={{
                              borderRadius: '50%',
                              width: '150px',
                              height: '150px',
                              margin: '0 auto'
                            }}
                          />
                        </Stack>
                      )}
                    </Button>
                  </Stack>
                  <Stack justifyContent={'center'} spacing={1}>
                    <Stack textAlign={'center'}>
                      <Typography color={grey[600]}>
                        <>
                          {t('validate.image_size')} <br /> {t('validate.image_type')}
                        </>
                      </Typography>
                    </Stack>
                    <Stack direction={'row'} justifyContent={'center'}>
                      <Button
                        variant="contained"
                        component="label"
                        sx={{
                          p: '8px 16px',
                          '&:hover': {
                            backgroundColor: 'none'
                          },
                          textTransform: 'none',
                          height: 50
                        }}
                      >
                        <input
                          hidden
                          accept="image/*"
                          type="file"
                          onChange={(e) => {
                            const listFile = e.target.files as FileList
                            const file = listFile[0]
                            setFiles(file)
                          }}
                        />
                        <Typography variant="subtitle2">{t('validate.upload_image')}</Typography>
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              </Grid>
            </RoundPaper>
            <Grid item xs={12} md={8}>
              <RoundPaper>
                <Grid item xs={12}>
                  <TextTitle sx={{ px: '20px' }}>{t('information.user_info')}</TextTitle>
                </Grid>
                <Grid
                  item
                  xs={12}
                  rowSpacing={3}
                  columnSpacing={2}
                  container
                  sx={{ px: '20px', mb: 4 }}
                >
                  <Grid item {...grid}>
                    <Input
                      fullWidth
                      label={t('information.first_name')}
                      placeholder={t('employee.first_name')}
                      control={control}
                      name="first_name"
                      required
                    />
                  </Grid>
                  <Grid item {...grid}>
                    <Input
                      fullWidth
                      label={t('information.last_name')}
                      placeholder={t('employee.last_name')}
                      control={control}
                      name="last_name"
                      required
                    />
                  </Grid>
                  <Grid item {...grid}>
                    <Input
                      fullWidth
                      label={t('information.sex')}
                      control={control}
                      name="sex"
                      disabled
                    />
                  </Grid>
                  <Grid item {...grid}>
                    <Input
                      fullWidth
                      label={t('information.birthday')}
                      control={control}
                      name="birthday"
                      disabled
                    />
                  </Grid>
                  <Grid item {...grid}>
                    <Input
                      fullWidth
                      label={t('information.nickname')}
                      placeholder={t('employee.nick_name')}
                      control={control}
                      name="nickname"
                    />
                  </Grid>
                  <Grid item {...grid}>
                    <Input
                      fullWidth
                      label={t('account.email')}
                      placeholder={t('employee.email')}
                      control={control}
                      name="email"
                      disabled
                      required
                    />
                  </Grid>
                  <Grid item {...grid}>
                    <Input
                      fullWidth
                      label={t('companies.phone_number')}
                      placeholder={t('employee.phone_number')}
                      control={control}
                      required
                      name="phone"
                    />
                  </Grid>
                  <Grid item {...grid}>
                    <Input
                      fullWidth
                      label={t('information.country')}
                      control={control}
                      name="country"
                      disabled
                    />
                  </Grid>
                </Grid>
              </RoundPaper>
              <RoundPaper sx={{ mt: 2 }}>
                <Grid item xs={12}>
                  <TextTitle sx={{ px: '20px' }}>{t('information.employee')}</TextTitle>
                </Grid>
                <Grid
                  item
                  xs={12}
                  rowSpacing={3}
                  columnSpacing={2}
                  container
                  sx={{ display: 'flex', px: '20px', mb: 4 }}
                >
                  <Grid item {...grid}>
                    <Input
                      fullWidth
                      label={t('information.employee_code')}
                      placeholder={t('employee.employee_code')}
                      control={control}
                      name="employee_code"
                      disabled
                    />
                  </Grid>
                  <Grid item {...grid}>
                    <Input
                      fullWidth
                      label={t('information.position')}
                      control={control}
                      name="position"
                      disabled
                    />
                  </Grid>
                  <Grid item {...grid}>
                    <Input
                      fullWidth
                      label={t('information.date_start_work')}
                      control={control}
                      name="date_start_work"
                      disabled
                    />
                  </Grid>
                  <Grid item {...grid}>
                    <Input
                      fullWidth
                      label={t('information.official_employee_date')}
                      control={control}
                      name="official_employee_date"
                      disabled
                    />
                  </Grid>
                  <Grid item {...grid}>
                    <Input
                      fullWidth
                      label={t('employee.branch')}
                      control={control}
                      name="branch"
                      disabled
                    />
                  </Grid>
                  <Grid item {...grid}>
                    <Input
                      fullWidth
                      label={t('employee.department')}
                      control={control}
                      name="department"
                      disabled
                    />
                  </Grid>
                  <Grid item {...grid}>
                    <Input
                      fullWidth
                      label={t('employee.title')}
                      control={control}
                      name="title"
                      disabled
                    />
                  </Grid>
                </Grid>
                <Stack direction={'row'} m={2} justifyContent={'end'} spacing={1}>
                  <Grid container justifyContent="flex-end" gap={2} style={{ marginTop: 20 }}>
                    <ButtonCommon sx={{ maxWidth: '150px' }} type="submit" variant="contained">
                      {t('update')}
                    </ButtonCommon>
                  </Grid>
                </Stack>
              </RoundPaper>
            </Grid>
          </Grid>
        </Box>
      </form>
    </>
  )
}

export const TextTitle = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 600,
  padding: theme.spacing(3)
}))

const AvtImg = styled('img')(({ theme }) => ({
  height: theme.spacing(3),
  lineHeight: theme.spacing(2)
}))
