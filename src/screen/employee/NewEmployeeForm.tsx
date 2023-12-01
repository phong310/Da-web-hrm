import { yupResolver } from '@hookform/resolvers/yup'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummaryProps,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
  Tooltip,
  Typography
} from '@mui/material'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/system'
import { Select } from 'components/Form/Autocomplete/Select'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
import { DatePicker } from 'components/Form/Input/DatePicker'
import { Input } from 'components/Form/Input/Input'
import { RadioComponent } from 'components/Form/Input/RadioComponent'
import { PageTable } from 'components/Layouts/Page/PageTable'
import { RoundPaper } from 'components/Layouts/Page/RoundPaper'
import { DrawerAdmin } from 'components/Layouts/Drawer/DrawerAdmin'
import i18n from 'lib/lang/translations/i18n'
import {
  ADDRESS_TYPE_OPTIONS,
  IDENTITY_TYPE_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  SEX_OPTIONS,
  TYPE_OPTIONS_ADMIN
} from 'lib/utils/contants'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
// import Branch from 'screen/AdminAddedOption/Branch'
// import Department from 'screen/AdminAddedOption/Department'
// import Position from 'screen/AdminAddedOption/Position'
// import Titles from 'screen/AdminAddedOption/Titles'
import * as yup from 'yup'
import { V1 } from 'constants/apiVersion'
import { useApiResource } from 'lib/hook/useApiResource'
import { formatISODate } from 'lib/utils/format'
import { NewEmployeeType } from 'lib/types/newEmployee'
import { BaseMaster, RegionData } from 'lib/types/baseMaster'
type BaseMasterResponse = {
  data: BaseMaster[]
}

type RegionResponse = {
  data: RegionData[]
}

type RoleType = {
  id: number
  name: string
  is_disabled: boolean
}

const validateEmployee = yup.object({
  first_name: yup
    .string()
    .trim()
    .required(i18n.t('validate.first_name'))
    .max(50, i18n.t('validate.max_length')),
  last_name: yup
    .string()
    .trim()
    .required(i18n.t('validate.last_name'))
    .max(50, i18n.t('validate.max_length')),
  // job_id: yup.string().trim().required(i18n.t('validate.job_id')),
  title_id: yup.string().trim().required(i18n.t('validate.title_id')),
  birthday: yup.string().trim().required(i18n.t('validate.birthday')),
  marital_status: yup.number().required(i18n.t('validate.marital_status')),
  sex: yup.string().trim().required(i18n.t('validate.sex')),
  email: yup
    .string()
    .trim()
    .required(i18n.t('validate.email'))
    .email(i18n.t('validate.is_email'))
    .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, {
      message: i18n.t('validate.email_invalid'),
      excludeEmptyString: true
    }),
  phone: yup
    .string()
    .required(i18n.t('validate.phone'))
    .test('no-leading-zero', i18n.t('validate.no-leading-zero'), (_, context) => {
      return (
        !!(context as unknown as { originalValue: string }).originalValue &&
        (context as unknown as { originalValue: string }).originalValue.startsWith('0')
      )
    })
    .test(
      'len',
      i18n.t('validate.limit_number_phone'),
      (val) => !val || (!!val && val.toString().length === 10)
    )
    .typeError(i18n.t('validate.is_phone')),
  country_id: yup.string().trim().required(i18n.t('validate.country_id')),
  employee_code: yup.string().trim().required(i18n.t('validate.employee_code')),
  date_start_work: yup.string().trim().required(i18n.t('validate.date_start_work')),
  position_id: yup.string().trim().required(i18n.t('validate.position_id')),
  department_id: yup.string().trim().required(i18n.t('validate.department_id')),
  branch_id: yup.string().trim().required(i18n.t('validate.branch_id')),
  status: yup.string().trim().required(i18n.t('validate.status')),
  addressType: yup.number().required(i18n.t('validate.addressType')),
  user_email: yup
    .string()
    .trim()
    .required(i18n.t('validate.email'))
    .email(i18n.t('validate.is_email'))
    .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, {
      message: i18n.t('validate.email_invalid'),
      excludeEmptyString: true
    }),
  user_name: yup.string().trim().required(i18n.t('validate.user_name')),
  role_id: yup.string().trim().required(i18n.t('validate.role')),
  password: yup
    .string()
    .trim()
    .required(i18n.t('validate.password'))
    .min(6, i18n.t('validate.password_min')),
  card_number: yup
    .number()
    .positive(i18n.t('validate.card_number_positive'))
    .transform((value, originalValue) => {
      if (originalValue === '') {
        return null
      }
      return value
    })
    .nullable()
})

const NewEmployeeForm: React.VFC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [countryList, setCountryList] = useState<BaseMaster[]>([])
  const [positionList, setPositionList] = useState<BaseMaster[]>([])
  const [departmentList, setDepartmentList] = useState<BaseMaster[]>([])
  const [branchList, setBranchList] = useState<BaseMaster[]>([])
  const [titles, setTitles] = useState<BaseMaster[]>([])
  const [roleList, setRoleList] = useState<RoleType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [openAdminOptions, setOpenAdminOptions] = useState<boolean>(false)
  const [typeOptions, setTypeOptions] = useState<string>(TYPE_OPTIONS_ADMIN['DEPARTMENT'])
  const { createOrUpdateApi } = useApiResource<NewEmployeeType>(`${V1}/user/employee`)
  const { control, handleSubmit, setValue, setError, watch } = useForm<NewEmployeeType>({
    mode: 'all',
    defaultValues: {
      first_name: '',
      last_name: '',
      nickname: '',
      birthday: '',
      marital_status: 1,
      sex: 1,
      role_id: '',
      email: '',
      note: '',
      country_id: '',
      ethnic: '',
      employee_code: '',
      official_employee_date: '',
      date_start_work: '',
      position_id: '',
      department_id: '',
      branch_id: '',
      status: 1,
      issued_date: '',
      ID_no: '',
      issued_by: '',
      ID_expire: '',
      iDenType: 0,
      province: '',
      district: '',
      ward: '',
      address: '',
      addressType: 0,
      school_name: '',
      description: '',
      from_date: '',
      to_date: '',
      account_number: '',
      account_name: '',
      bank_type: '',
      bank_branch: '',
      bank_name: '',
      name: '',
      is_first_time_login: 0,
      user_email: '',
      password: 'admin@123',
      user_name: ''
    },
    //@ts-ignore
    resolver: yupResolver(validateEmployee)
  })
  useQuery<BaseMasterResponse>([`${V1}/admin/country?per_page=100`], {
    onSuccess: (data) => {
      setCountryList(data.data)
    },
    enabled: true
  })

  const { refetch: refetchPostion } = useQuery<BaseMasterResponse>(
    [`${V1}/admin/position?per_page=100`],
    {
      onSuccess: (data) => {
        setPositionList(data.data)
      },
      enabled: true
    }
  )

  const { refetch: refetchDepartment } = useQuery<BaseMasterResponse>(
    [`${V1}/admin/department?per_page=100`],
    {
      onSuccess: (data) => {
        setDepartmentList(data.data)
      },
      enabled: true
    }
  )

  const { refetch: refetchBranch } = useQuery<BaseMasterResponse>(
    [`${V1}/admin/branch?per_page=100`],
    {
      onSuccess: (data) => {
        setBranchList(data.data)
      },
      enabled: true
    }
  )

  useQuery<{ data: RoleType[] }>([`${V1}/user/role?per_page=100`], {
    onSuccess: (data) => {
      setRoleList(data.data)
    },
    enabled: true
  })

  const onCancel = () => {
    navigate(-1)
  }
  const [checked, setChecked] = React.useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (checked) {
      setValue('user_email', '')
      setValue('user_name', '')
    } else {
      setValue('user_email', watch('email'))
      setValue('user_name', watch('user_email').split('@')[0])
    }
    setChecked(event.target.checked)
  }

  const onSubmit: SubmitHandler<NewEmployeeType> = async (value) => {
    value.user_name = watch('user_email').split('@')[0]
    if (isLoading) {
      return
    }
    setIsLoading(true)
    try {
      const res = await createOrUpdateApi(value)
      if (res.status == 200) {
        const message = res.data.message
        navigate(-1)
        toast.success(message)
        setIsLoading(false)
      }
    } catch (error:any) {
      // toast.error(error.error)
      setIsLoading(false)
      if (error.errors) {
        Object.entries(error.errors).forEach(([key, value]: any) => {
          setError(key, { message: t(value) })
        })
      }
    }
  }

  const grid = { xs: 12, sm: 6, md: 4, lg: 4 }

  const { refetch: refetchTitles } = useQuery<{ data: BaseMaster[] }>([`${V1}/admin/title`], {
    onSuccess: (data) => {
      setTitles(data.data)
    },
    enabled: true
  })

  const [expandedPanel, setExpandedPanel] = useState<string | false>(false)
  const handleChangeExpanded =
    (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpandedPanel(newExpanded ? panel : false)
    }

  const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon style={{ color: 'red' }} sx={{ fontSize: '1rem' }} />}
      {...props}
    />
  ))(({ theme }) => ({
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(90deg)'
    }
  }))

  const handleAddOptions = (type: string) => {
    setTypeOptions(type)
    setOpenAdminOptions(!openAdminOptions)
  }
  const handleChangeOptions = () => {
    setOpenAdminOptions(!openAdminOptions)
    if (typeOptions == TYPE_OPTIONS_ADMIN['DEPARTMENT']) {
      refetchDepartment()
    } else if (typeOptions == TYPE_OPTIONS_ADMIN['BRANCH']) {
      refetchBranch()
    } else if (typeOptions == TYPE_OPTIONS_ADMIN['POSITION']) {
      refetchPostion()
    } else {
      refetchTitles()
    }
  }

  const getTitleByTypeOptions = (typeOptions: string) => {
    switch (typeOptions) {
      case TYPE_OPTIONS_ADMIN['DEPARTMENT']:
        return t('department_admin.create_page')
      case TYPE_OPTIONS_ADMIN['POSITION']:
        return t('position_admin.create_page')
      case TYPE_OPTIONS_ADMIN['TITLES']:
        return t('titles_admin.create_page')
      default:
        return t('branch_admin.create_page')
    }
  }

//   const renderComponentByTypeOptions = (typeOptions: string, handleChangeOptions: () => void) => {
//     switch (typeOptions) {
//       case TYPE_OPTIONS_ADMIN['DEPARTMENT']:
//         return <Department onSuccessAddOptions={handleChangeOptions} />
//       case TYPE_OPTIONS_ADMIN['POSITION']:
//         return <Position onSuccessAddOptions={handleChangeOptions} />
//       case TYPE_OPTIONS_ADMIN['TITLES']:
//         return <Titles onSuccessAddOptions={handleChangeOptions} />
//       default:
//         return <Branch onSuccessAddOptions={handleChangeOptions} />
//     }
//   }

  return (
    <>
      <PageTable title={t('employee.create')}>
        <RoundPaper>
          <Box
            sx={{ padding: '16px' }}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            autoComplete="off"
          >
            <h4>{t('general_information')}</h4>
            <Grid container rowSpacing={2} columnSpacing={2}>
              <Grid container rowSpacing={2} columnSpacing={2} item md={12} spacing={2}>
                <Grid item {...grid}>
                  <Input
                    fullWidth
                    type="text"
                    label={t('employee.first_name')}
                    placeholder={t('employee.enter_name')}
                    name="first_name"
                    control={control}
                    required
                  />
                </Grid>
                <Grid item {...grid}>
                  <Input
                    fullWidth
                    type="text"
                    label={t('employee.last_name')}
                    placeholder={t('employee.enter_last_name')}
                    name="last_name"
                    control={control}
                    required
                  />
                </Grid>
                <Grid item {...grid}>
                  <RadioComponent
                    fullWidth
                    name="sex"
                    label={t('employee.sex.name')}
                    control={control}
                    options={SEX_OPTIONS}
                    required
                  />
                </Grid>
              </Grid>
              <Grid container rowSpacing={2} columnSpacing={2} item md={12} spacing={2}>
                <Grid item {...grid}>
                  <DatePicker
                    fullWidth
                    label={t('employee.birth_day')}
                    name="birthday"
                    control={control}
                    required
                    readOnly={false}
                  />
                </Grid>
                <Grid item {...grid}>
                  <Input
                    fullWidth
                    type="text"
                    label={t('information.nickname')}
                    placeholder={t('employee.nick_name')}
                    name="nickname"
                    control={control}
                  />
                </Grid>
                <Grid item {...grid}>
                  <RadioComponent
                    fullWidth
                    name="marital_status"
                    label={t('employee.marital_status.name')}
                    control={control}
                    options={MARITAL_STATUS_OPTIONS}
                  />
                </Grid>
              </Grid>

              <Grid container rowSpacing={2} columnSpacing={2} item md={12} spacing={2}>
                <Grid item {...grid}>
                  <Input
                    fullWidth
                    type="text"
                    label={t('information.email')}
                    placeholder={t('employee.email')}
                    name="email"
                    control={control}
                    required
                  />
                </Grid>
                <Grid item {...grid}>
                  <Input
                    fullWidth
                    type="number"
                    label={t('information.phone')}
                    placeholder={t('employee.phone_number')}
                    name="phone"
                    control={control}
                    required
                  />
                </Grid>
              </Grid>
            </Grid>

            <h4>{t('employee_information')}</h4>
            <Grid container rowSpacing={2} columnSpacing={2}>
              <Grid container rowSpacing={2} columnSpacing={2} item md={12} spacing={2}>
                <Grid item {...grid}>
                  <Input
                    fullWidth
                    type="number"
                    label={t('information.number_card')}
                    placeholder={t('employee.card_number')}
                    name="card_number"
                    typeof=""
                    control={control}
                  />
                </Grid>
                <Grid item {...grid}>
                  <Input
                    fullWidth
                    type="text"
                    label={t('employee.employee_code')}
                    placeholder={t('employee.enter_no')}
                    name="employee_code"
                    control={control}
                    // value={fillEmployeeCode}
                    required
                    // readOnly
                    // disabled
                  />
                </Grid>
              </Grid>

              <Grid container rowSpacing={2} columnSpacing={2} item md={12} spacing={2}>
                <Grid item {...grid}>
                  <Select
                    isAddOption
                    onAddOptions={() => handleAddOptions(TYPE_OPTIONS_ADMIN['BRANCH'])}
                    fullWidth
                    label={t('employee.branch')}
                    placeholder={t('employee.branch_select')}
                    name="branch_id"
                    control={control}
                    options={branchList?.map((branch) => ({
                      ...branch,
                      value: branch.id,
                      label: branch.name
                    }))}
                    required
                  />
                </Grid>
                <Grid item {...grid}>
                  <Select
                    fullWidth
                    isAddOption
                    onAddOptions={() => handleAddOptions(TYPE_OPTIONS_ADMIN['DEPARTMENT'])}
                    label={t('employee.department')}
                    placeholder={t('employee.department_select')}
                    name="department_id"
                    control={control}
                    options={departmentList?.map((d) => ({
                      ...d,
                      value: d.id,
                      label: d.name
                    }))}
                    required
                  />
                </Grid>
                <Tooltip title={t('validate.msq_title')} arrow placement="top">
                  <Grid item {...grid}>
                    <Select
                      fullWidth
                      isAddOption
                      onAddOptions={() => handleAddOptions(TYPE_OPTIONS_ADMIN['POSITION'])}
                      name="position_id"
                      label={t('employee.position')}
                      placeholder={t('employee.position')}
                      control={control}
                      options={positionList?.map((pos) => ({
                        ...pos,
                        value: pos.id,
                        label: pos.name
                      }))}
                      required
                    />
                  </Grid>
                </Tooltip>
              </Grid>
              <Grid container rowSpacing={2} columnSpacing={2} item md={12} spacing={2}>
                <Grid item {...grid}>
                  <Select
                    fullWidth
                    isAddOption
                    onAddOptions={() => handleAddOptions(TYPE_OPTIONS_ADMIN['TITLES'])}
                    label={t('employee.title')}
                    placeholder={t('employee.title_enter')}
                    name="title_id"
                    control={control}
                    options={titles?.map((job) => ({
                      ...job,
                      value: job.id,
                      label: job.name
                    }))}
                    required
                  />
                </Grid>
              </Grid>
              <Grid container rowSpacing={2} columnSpacing={2} item md={12} spacing={2}>
                <Grid item {...grid}>
                  <Select
                    fullWidth
                    required
                    name="country_id"
                    label={t('employee.country')}
                    placeholder={t('employee.country')}
                    options={countryList?.map((c) => ({
                      ...c,
                      value: c.id,
                      label: c.name
                    }))}
                    control={control}
                  />
                </Grid>
                <Grid item {...grid}>
                  <Input
                    fullWidth
                    type="text"
                    label={t('employee.ethnic')}
                    placeholder={t('employee.enter_ethnic')}
                    name="ethnic"
                    control={control}
                  />
                </Grid>
              </Grid>
              <Grid container rowSpacing={2} columnSpacing={2} item md={12} spacing={2}>
                <Grid item {...grid}>
                  <DatePicker
                    fullWidth
                    label={t('employee.date_start_work')}
                    name="date_start_work"
                    control={control}
                    maxDate={new Date(watch('official_employee_date'))}
                    required
                    readOnly={false}
                  />
                </Grid>
                <Grid item {...grid}>
                  <DatePicker
                    fullWidth
                    label={t('employee.official_employee_date')}
                    name="official_employee_date"
                    hasOnClear
                    control={control}
                    minDate={new Date(watch('date_start_work'))}
                    readOnly={false}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} md={8}>
                <Input
                  fullWidth
                  type="text"
                  label={t('note')}
                  placeholder={t('employee.employee_note')}
                  name="note"
                  control={control}
                  sx={{ height: 100 }}
                />
              </Grid>
            </Grid>
            <h4>{t('user_information.name')}</h4>
            <Grid container rowSpacing={2} columnSpacing={2}>
              <Grid container rowSpacing={2} columnSpacing={2} item md={12} spacing={2}>
                <Grid item {...grid}>
                  <Input
                    fullWidth
                    type="text"
                    name="user_email"
                    onBlur={() => setValue('user_name', watch('user_email').split('@')[0])}
                    label={t('user_information.user_email')}
                    placeholder={t('employee.enter_user_email')}
                    control={control}
                    required
                    helperText={
                      <FormGroup>
                        <FormControlLabel
                          control={<Switch checked={checked} onChange={handleChange} />}
                          label={
                            <Typography
                              sx={{
                                fontSize: 13,
                                opacity: checked ? 1 : 0.7,
                                fontWeight: checked ? 900 : 500
                              }}
                            >
                              {t('user_information.async_email')}
                            </Typography>
                          }
                        />
                      </FormGroup>
                    }
                  />
                </Grid>
                <Grid item {...grid}>
                  <Input
                    fullWidth
                    type="text"
                    name={`user_name`}
                    required
                    placeholder={t('employee.enter_account')}
                    label={t('user_information.user_name')}
                    control={control}
                  />
                </Grid>
              </Grid>
              <Grid item container md={12} columnSpacing={2}>
                <Grid item {...grid}>
                  <Select
                    fullWidth
                    name="role_id"
                    label={t('employee.role')}
                    placeholder={t('employee.enter_role')}
                    control={control}
                    options={roleList?.map((role: RoleType) => ({
                      ...role,
                      value: role.id,
                      label: role.is_disabled ? t(`role.${role.name}`) : role.name
                    }))}
                    required
                  />
                </Grid>
                <Grid item {...grid}>
                  <Input
                    fullWidth
                    type="text"
                    disabled
                    name={`password`}
                    label={t('user_information.password')}
                    placeholder={t('user_information.password')}
                    control={control}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Accordion
              sx={{
                ...styleAccordion
              }}
              expanded={expandedPanel === 'addInfo'}
              onChange={handleChangeExpanded('addInfo')}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon style={{ color: '#146BD2' }} />}
                sx={{
                  ...styleAccordionSummary
                }}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                {expandedPanel ? (
                  <h4 style={{ color: '#146BD2', margin: 0 }}>{t('Thu gọn')}</h4>
                ) : (
                  <h4 style={{ color: '#146BD2', margin: 0 }}>{t('Mở rộng')}</h4>
                )}
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  ...styleAccordionDetails
                }}
              >
                <h4>{t('address.name')}</h4>
                <Grid container rowSpacing={2} columnSpacing={2}>
                  <Grid container rowSpacing={2} columnSpacing={2} item md={12} spacing={2}>
                    <Grid item md={12}>
                      <RadioComponent
                        fullWidth
                        label={t('employee.address_type')}
                        name={`addressType`}
                        control={control}
                        options={ADDRESS_TYPE_OPTIONS}
                      />
                    </Grid>
                  </Grid>
                  <Grid container rowSpacing={2} columnSpacing={2} item md={12} spacing={2}>
                    <Grid item {...grid}>
                      <Input
                        fullWidth
                        type="text"
                        label={t('address.province')}
                        placeholder={t('employee.enter_province')}
                        name="province"
                        control={control}
                      />
                    </Grid>
                    <Grid item {...grid}>
                      <Input
                        fullWidth
                        type="text"
                        label={t('address.district')}
                        placeholder={t('employee.enter_district')}
                        name="district"
                        control={control}
                      />
                    </Grid>
                    <Grid item {...grid}>
                      <Input
                        fullWidth
                        type="text"
                        label={t('address.ward')}
                        placeholder={t('employee.enter_ward')}
                        name="ward"
                        control={control}
                      />
                    </Grid>
                  </Grid>
                  <Grid container rowSpacing={2} columnSpacing={2} item md={12} spacing={2}>
                    <Grid item xs={12} md={8}>
                      <Input
                        fullWidth
                        type="text"
                        label={t('address.name')}
                        placeholder={t('employee.enter_address')}
                        name={`address`}
                        control={control}
                        sx={{ height: 100 }}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <h4>{t('identity_paper.name')}</h4>
                <Grid container rowSpacing={2} columnSpacing={2}>
                  <Grid container rowSpacing={2} columnSpacing={2} item md={12} spacing={2}>
                    <Grid item md={12}>
                      <RadioComponent
                        label={t('employee.paper_type')}
                        fullWidth
                        name={`iDenType`}
                        control={control}
                        options={IDENTITY_TYPE_OPTIONS}
                      />
                    </Grid>
                  </Grid>
                  <Grid container rowSpacing={2} columnSpacing={2} item md={12} spacing={2}>
                    <Grid item {...grid}>
                      <Input
                        fullWidth
                        type="number"
                        name={`ID_no`}
                        label={t('identity_paper.id_no')}
                        placeholder={t('employee.enter_id_no')}
                        control={control}
                      />
                    </Grid>
                    <Grid item {...grid}>
                      <Input
                        fullWidth
                        type="text"
                        name={`issued_by`}
                        label={t('identity_paper.issued_by')}
                        placeholder={t('employee.enter_issued_by')}
                        control={control}
                      />
                    </Grid>
                  </Grid>
                  <Grid container rowSpacing={2} columnSpacing={2} item md={12} spacing={2}>
                    <Grid item {...grid}>
                      <DatePicker
                        fullWidth
                        label={t('identity_paper.issued_date')}
                        name={`issued_date`}
                        hasOnClear
                        control={control}
                        //@ts-ignore
                        maxDate={
                          watch('ID_expire') === formatISODate(new Date(Date.now()))
                            ? new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
                            : Date.now()
                        }
                        readOnly={false}
                        // required
                      />
                    </Grid>
                    <Grid item {...grid}>
                      <DatePicker
                        fullWidth
                        name={`ID_expire`}
                        hasOnClear
                        label={t('identity_paper.id_expire')}
                        control={control}
                        //@ts-ignore
                        minDate={
                          watch('issued_date') === formatISODate(new Date(Date.now()))
                            ? new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
                            : Date.now()
                        }
                        readOnly={false}
                        // required
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Grid
              container
              rowSpacing={2}
              justifyContent="flex-end"
              gap={2}
              style={{ marginTop: 20 }}
              xs={12}
            >
              <Grid xs={4} sm={3} md={2.5} lg={1.5} xl={1.2}>
                <ButtonCommon onClick={onCancel} variant="outlined" error={true}>
                  {t('cancel')}
                </ButtonCommon>
              </Grid>

              <Grid xs={4} sm={3} md={2.5} lg={1.5} xl={1.2}>
                <ButtonCommon
                  type="submit"
                  variant="contained"
                  startIcon={isLoading ? <CircularProgress color="inherit" size="16px" /> : ''}
                >
                  {t('add', { ns: 'translation' })}
                </ButtonCommon>
              </Grid>
            </Grid>
          </Box>
        </RoundPaper>
      </PageTable>
      <DrawerAdmin
        title={getTitleByTypeOptions(typeOptions)}
        open={openAdminOptions}
        handleOpen={() => setOpenAdminOptions(!openAdminOptions)}
      >
        {/* {renderComponentByTypeOptions(typeOptions, handleChangeOptions)} */}
      </DrawerAdmin>
    </>
  )
}

const styleAccordion = {
  margin: 0,
  '&.MuiPaper-root': {
    boxShadow: 'none',
    borderRadius: 0,
    margin: 0
  },
  '&.MuiPaper-root:before': {
    height: 0,
    margin: 0
  },
  '&.MuiAccordion-root': {
    borderRadius: 0,
    margin: 0,
    '&.MuiAccordion-rounded': {
      borderRadius: 0,
      margin: 0
    },
    '&.MuiAccordion-gutters': {
      padding: 0,
      margin: 0
    },
    '&.css-9y1cs0-MuiPaper-root-MuiAccordion-root:before': {
      height: '10px',
      margin: 0
    }
  }
}

const styleAccordionSummary = {
  border: 'none',
  boxShadow: 'none',
  padding: 0,
  width: '150px',
  color: 'red'
}

const styleAccordionDetails = {
  border: 'none',
  boxShadow: 'none',
  padding: 0
}

export { NewEmployeeForm }
