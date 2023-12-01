import { yupResolver } from '@hookform/resolvers/yup'
import { CircularProgress, Grid, Tooltip } from '@mui/material'
import { Box } from '@mui/system'
import { Select } from 'components/Form/Autocomplete/Select'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
import { Input } from 'components/Form/Input/Input'
import { RadioComponent } from 'components/Form/Input/RadioComponent'

import { PageTable } from 'components/Layouts/Page/PageTable'
import { DrawerAdmin } from 'components/Layouts/Drawer/DrawerAdmin'
import { V1 } from 'constants/apiVersion'
import { useApiResource } from 'lib/hook/useApiResource'
import i18n from 'lib/lang/translations/i18n'
import { BaseMaster } from 'lib/types/baseMaster'
import { Employee } from 'lib/types/employee'
import {
  MARITAL_STATUS_OPTIONS,
  SEX_OPTIONS,
  STATUS_EMPLOYEE_OPTIONS,
  TYPE_OPTIONS_ADMIN
} from 'lib/utils/contants'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
// import Branch from 'screen/AdminAddedOption/Branch'
// import Department from 'screen/AdminAddedOption/Department'
// import Position from 'screen/AdminAddedOption/Position'
// import Titles from 'screen/AdminAddedOption/Titles'
import * as yup from 'yup'
import { DatePicker } from 'components/Form/Input/DatePicker'

export const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

type BaseMasterResponse = {
  data: BaseMaster[]
}

const validateAdminUser = yup.object({
  employee_code: yup.string().trim().required(i18n.t('validate.employee_code')),
  status: yup.string().trim().required(i18n.t('validate.status')),
  position_id: yup.string().trim().required(i18n.t('validate.position_id')),
  department_id: yup.string().trim().required(i18n.t('validate.department_id')),
  branch_id: yup.string().trim().required(i18n.t('validate.branch_id')),
  date_start_work: yup.string().trim().required(i18n.t('validate.date_start_work')),
  information: yup
    .object({
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
      birthday: yup.string().trim().required(i18n.t('validate.birthday')),
      // job_id: yup.string().trim().required(i18n.t('validate.job_id')),
      title_id: yup.string().trim().required(i18n.t('validate.title_id')),
      country_id: yup.string().trim().required(i18n.t('validate.country_id')),
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
        .trim()
        .matches(phoneRegExp, i18n.t('validate.phone_number'))
        .required(i18n.t('validate.phone')),
      nickname: yup.string().trim().nullable(),
      note: yup.string().trim().nullable()
    })
    .required(),
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

const EmployeeForm: React.VFC = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { t } = useTranslation()
  const [jobList, setJobList] = useState<BaseMaster[]>([])
  const [countryList, setCountryList] = useState<BaseMaster[]>([])
  const [positionList, setPositionList] = useState<BaseMaster[]>([])
  const [departmentList, setDepartmentList] = useState<BaseMaster[]>([])
  const [branchList, setBranchList] = useState<BaseMaster[]>([])
  const [educationLevelList, setEducationLevelList] = useState<BaseMaster[]>([])
  const [titles, setTitles] = useState<BaseMaster[]>([])
  const [typeOptions, setTypeOptions] = useState<string>(TYPE_OPTIONS_ADMIN['DEPARTMENT'])
  const isEdit = !!params.id
  const { createOrUpdateApi } = useApiResource<Employee>(`${V1}/user/employee`)
  const [openAdminOptions, setOpenAdminOptions] = useState<boolean>(false)
  const { control, handleSubmit, setValue, getValues, setError } = useForm<Employee>({
    defaultValues: {
      id: Number(params?.id),
      position_id: 0,
      department_id: 0,
      branch_id: 0,
      information: {
        first_name: '',
        last_name: '',
        email: '',
        title_id: 0,
        phone: '',
        nickname: '',
        ethnic: '',
        sex: 0,
        birthday: '',
        marital_status: 0,
        note: ''
      },
      personal_information_id: 0,
      card_number: '',
      employee_code: '',
      official_employee_date: '',
      date_start_work: '',
      status: '',
      department: {
        name: ''
      },
      branch: {
        name: ''
      },
      position: {
        name: ''
      },
      user: {
        name: '',
        user_name: '',
        email: '',
        is_first_time_login: 0
      },
      setting_id: 0
    },
    //@ts-ignore
    resolver: yupResolver(validateAdminUser)
  })

  // useQuery<BaseMasterResponse>([`${V1}/user/job?per_page=100`], {
  //   onSuccess: (data) => {
  //     setJobList(data.data)
  //   },
  //   enabled: !!isEdit
  // })

  useQuery<BaseMasterResponse>([`${V1}/user/country?per_page=100`], {
    onSuccess: (data) => {
      setCountryList(data.data)
    },
    enabled: !!isEdit
  })

  const { refetch: refetchPostion } = useQuery<BaseMasterResponse>(
    [`${V1}/user/position?per_page=100`],
    {
      onSuccess: (data) => {
        setPositionList(data.data)
      },
      enabled: !!isEdit
    }
  )

  const { refetch: refetchDepartment } = useQuery<BaseMasterResponse>(
    [`${V1}/user/department?per_page=100`],
    {
      onSuccess: (data) => {
        setDepartmentList(data.data)
      },
      enabled: !!isEdit
    }
  )

  const { refetch: refetchBranch } = useQuery<BaseMasterResponse>(
    [`${V1}/user/branch?per_page=100`],
    {
      onSuccess: (data) => {
        setBranchList(data.data)
      },
      enabled: !!isEdit
    }
  )

  useQuery<BaseMasterResponse>([`${V1}/user/education-level?per_page=100`], {
    onSuccess: (data) => {
      setEducationLevelList(data.data)
    },
    enabled: !!isEdit
  })

  useQuery<Employee>([`${V1}/user/employee/${params.id}`], {
    onSuccess: (data) => {
      setValue('information', data.information)
      setValue('personal_information_id', data.personal_information_id)
      setValue('position_id', data.position_id)
      setValue('department_id', data.department_id)
      setValue('branch_id', data.branch_id)
      setValue('card_number', data.card_number)
      setValue('employee_code', data.employee_code)
      setValue('official_employee_date', data.official_employee_date)
      setValue('date_start_work', data.date_start_work)
      setValue('status', data.status)
      setValue('user', data.user)
      setValue('setting_id', 0)
    },
    enabled: !!isEdit
  })

  const onCancel = () => {
    navigate('/employees/manager')
  }

  const onSubmit: SubmitHandler<Employee> = async (value) => {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    try {
      const res = await createOrUpdateApi(value)
      if (res.status == 200) {
        setIsLoading(false)
        toast.success(t('toast.update_success_employee'))
        navigate('/employees/manager')
      }
    } catch (error:any) {
      setIsLoading(false)
      if (error.errors) {
        Object.entries(error.errors).forEach(([key, value]: any) => {
          setError(key, { message: t(value) })
        })
      }
    }
  }

  const { refetch: refetchTitles } = useQuery<{ data: BaseMaster[] }>([`${V1}/admin/title`], {
    onSuccess: (data) => {
      setTitles(data.data)
    },
    enabled: true
  })

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

  const grid = { xs: 12, sm: 6, md: 4, lg: 4 }

  return (
    <>
      <PageTable
        title={t('employee_information')}
        isDisableBreadcrumb={true}
        elevation={0}
        sxCustom={{ paddingLeft: '0px !important', maxWidth: '100%' }}
      >
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
          <h4>{t('general_information')}</h4>
          <Grid container rowSpacing={{ xs: 2, sm: 3 }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid container item md={12} spacing={2}>
              <Grid item {...grid}>
                <Input
                  fullWidth
                  label={t('employee.first_name')}
                  placeholder={t('employee.enter_name')}
                  name="information.first_name"
                  control={control}
                  required
                  sx={{ ...styleHeightInput }}
                />
              </Grid>
              <Grid item {...grid}>
                <Input
                  fullWidth
                  label={t('employee.last_name')}
                  placeholder={t('employee.enter_last_name')}
                  name="information.last_name"
                  control={control}
                  required
                  sx={{ ...styleHeightInput }}
                />
              </Grid>
              <Grid item {...grid}>
                <RadioComponent
                  fullWidth
                  name="information.sex"
                  label={t('employee.sex.name')}
                  control={control}
                  options={SEX_OPTIONS}
                />
              </Grid>
            </Grid>
            <Grid container item md={12} spacing={2}>
              <Grid item {...grid}>
                <DatePicker
                  fullWidth
                  label={t('employee.birth_day')}
                  name="information.birthday"
                  control={control}
                  required
                  readOnly={false}
                />
              </Grid>
              <Grid item {...grid}>
                <Input
                  fullWidth
                  label={t('information.nickname')}
                  placeholder={t('employee.nick_name')}
                  name="information.nickname"
                  control={control}
                  sx={{ ...styleHeightInput }}
                />
              </Grid>
              <Grid item {...grid}>
                <RadioComponent
                  fullWidth
                  name="information.marital_status"
                  label={t('employee.marital_status.name')}
                  control={control}
                  options={MARITAL_STATUS_OPTIONS}
                />
              </Grid>
            </Grid>

            <Grid container item md={12} spacing={2}>
              <Grid item {...grid}>
                <Input
                  fullWidth
                  label={t('information.email')}
                  placeholder={t('employee.email')}
                  name="information.email"
                  control={control}
                  sx={{ ...styleHeightInput }}
                  required
                />
              </Grid>
              <Grid item {...grid}>
                <Input
                  fullWidth
                  label={t('information.phone')}
                  placeholder={t('employee.phone_number')}
                  name="information.phone"
                  control={control}
                  sx={{ ...styleHeightInput }}
                  required
                />
              </Grid>
            </Grid>
          </Grid>

          <h4>{t('employee_information')}</h4>
          <Grid container rowSpacing={{ xs: 2, sm: 3 }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid container item md={12} spacing={2}>
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
                  label={t('employee.employee_code')}
                  placeholder={t('employee.enter_no')}
                  name="employee_code"
                  control={control}
                  required
                  sx={{ ...styleHeightInput }}
                />
              </Grid>
            </Grid>
            <Grid container item md={12} spacing={2}>
              <Grid item {...grid}>
                <Select
                  isAddOption
                  onAddOptions={() => handleAddOptions(TYPE_OPTIONS_ADMIN['BRANCH'])}
                  fullWidth
                  label={t('employee.branch')}
                  name="branch_id"
                  placeholder={t('employee.branch_select')}
                  control={control}
                  options={branchList.map((branch) => ({
                    ...branch,
                    value: branch.id,
                    label: branch.name
                  }))}
                  required
                />
              </Grid>
              <Grid item {...grid}>
                <Select
                  isAddOption
                  onAddOptions={() => handleAddOptions(TYPE_OPTIONS_ADMIN['TITLES'])}
                  fullWidth
                  label={t('employee.title')}
                  name="information.title_id"
                  placeholder={t('employee.title_enter')}
                  control={control}
                  options={titles.map((title) => ({
                    ...title,
                    value: title.id,
                    label: title.name
                  }))}
                  required
                />
              </Grid>
            </Grid>
            <Grid container item md={12} spacing={2}>
              <Grid item {...grid}>
                <Select
                  fullWidth
                  isAddOption
                  onAddOptions={() => handleAddOptions(TYPE_OPTIONS_ADMIN['DEPARTMENT'])}
                  label={t('employee.department')}
                  placeholder={t('employee.department_select')}
                  name="department_id"
                  control={control}
                  options={departmentList.map((d) => ({
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
                    options={positionList.map((pos) => ({
                      ...pos,
                      value: pos.id,
                      label: pos.name
                    }))}
                    required
                  />
                </Grid>
              </Tooltip>
            </Grid>
            <Grid container item md={12} spacing={2}></Grid>
            <Grid container item md={12} spacing={2}>
              <Grid item {...grid}>
                <Select
                  required
                  fullWidth
                  name="information.country_id"
                  placeholder={t('employee.country')}
                  label={t('employee.country')}
                  options={countryList.map((c) => ({
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
                  label={t('employee.ethnic')}
                  placeholder={t('employee.enter_ethnic')}
                  name="information.ethnic"
                  control={control}
                  sx={{ ...styleHeightInput }}
                />
              </Grid>
            </Grid>
            <Grid container item md={12} spacing={2}>
              <Grid item {...grid}>
                <DatePicker
                  fullWidth
                  label={t('employee.official_employee_date')}
                  name="official_employee_date"
                  control={control}
                  readOnly={false}
                />
              </Grid>
              <Grid item {...grid}>
                <DatePicker
                  fullWidth
                  label={t('employee.date_start_work')}
                  name="date_start_work"
                  control={control}
                  required
                  readOnly={false}
                />
              </Grid>
              <Grid item {...grid}>
                <Select
                  fullWidth
                  label={t('status')}
                  placeholder={t('status')}
                  name="status"
                  control={control}
                  options={STATUS_EMPLOYEE_OPTIONS}
                  required
                />
              </Grid>
            </Grid>

            <Grid item xs={12} md={8}>
              <Input
                fullWidth
                label={t('note')}
                placeholder={t('note')}
                name="information.note"
                control={control}
                sx={{ height: 100 }}
              />
            </Grid>
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
                  {t('submit', { ns: 'translation' })}
                </ButtonCommon>
              </Box>
            </Grid>
          </Grid>
        </Box>
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
export const styleHeightInput = {
  height: { xs: 38, sm: 40 }
}

export { EmployeeForm }
