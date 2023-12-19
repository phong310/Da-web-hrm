import { Box, CircularProgress, Grid, Typography } from '@mui/material'
import { FormModal } from 'components/Form/Components/FormModal'
import { Pagev2 } from 'components/Layouts/Page/Pagev2'
import { RoundPaper } from 'components/Layouts/Page/RoundPaper'
import { ADMIN_URL, USER_URL } from 'constants/apiVersion'
import { useApiResource } from 'lib/hook/useApiResource'
import { LaborContractType, LaborContract_Employee, SalaryTaxCoefficientSettingsType } from 'lib/types/labor-contract'
import { HOULR_SALARY_STATUS, STATUS_LABOR_CONTRACT } from 'lib/utils/contants'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Heading, grid_full, grid_half } from './components'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
import { EmployeeSummary } from './EmployeeSummary'
import { EmployeeInfoForm } from './EmployeeInfoForm'
import { LaborContractForm } from './LaborContractForm'
import { TerminationContractForm } from './TerminationContractForm'
import { SalaryBonusForm } from './SalaryBonusForm'
import { InsuranceForm } from './InsuranceForm'

type SettingSalariesResponse = {
  data: SalaryTaxCoefficientSettingsType[]
}

export const LaborContract = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const params = useParams()
  const location = useLocation()
  const [employeeInfo, setEmployeeInfo] = useState<LaborContract_Employee | undefined>()
  const [isCheckValid, setIsCheckValid] = useState<boolean>(false)
  const [isSuranceSalaryAdmin, setIsSuranceSalary] = useState<number | any>()
  const [isSystemInsuranceSalary, setIsSystemInsuranceSalary] = useState<boolean>(false)
  const [isCheckInsurance, setIsCheckInsurance] = useState<boolean>(true)
  const [checkInsuranceForm, setCheckInsuranceForm] = useState<boolean>(false)
  const [isCheckDisabled, setIsCheckDisabled] = useState<boolean>(false)
  const [isExtendingContract, setIsExtendingContract] = useState<boolean>(false)
  const [openConfirm, setOpenConfirm] = useState<boolean>(false)

  const { createOrUpdateApi } = useApiResource<LaborContractType>(`${USER_URL}/labor-contract`)

  const {
    control,
    setValue,
    resetField,
    handleSubmit,
    setError,
    watch,
    clearErrors,
    formState: { isSubmitting }
  } = useForm<LaborContractType>({
    defaultValues: {
      id: 0,
      employee_id: undefined,
      branch_id: undefined,
      position_id: undefined,
      code: '',
      labor_contract_type_id: undefined,
      allowances: undefined,
      sign_date: '',
      effective_date: '',
      expire_date: '',
      status: 1,
      basic_salary: 0,
      insurance_salary: '',
      termination_date: '',
      reason_contract_termination: '',
      is_health_insurance: true,
      is_unemployment_insurance: true,
      is_social_insurance: true,
      is_syndicate: false,
      hourly_salary: 0,
      is_system_insurance_salary: 0
    }
  })

  useQuery<SettingSalariesResponse>(
    [`${ADMIN_URL}/salary-tax-coefficient-settings/get-by-company`],
    {
      onSuccess: ({ data }) => {
        const value = data[0]
        setIsSuranceSalary(value.insurance_salary)
      }
    }
  )

  const { isLoading } = useQuery<LaborContractType>([`${USER_URL}/labor-contract/${params.id}`], {
    onSuccess: (data) => {
      setValue('id', data.id)
      setValue('employee_id', data.employee_id)
      setValue('code', data.code)
      setValue('labor_contract_type_id', data.labor_contract_type_id)
      setValue('allowances', data.allowances)
      setValue('sign_date', data.sign_date)
      setValue('effective_date', data.effective_date)
      setValue('expire_date', data.expire_date)
      setValue('status', data.status)
      setValue('basic_salary', data.basic_salary)
      setValue('insurance_salary', data.insurance_salary)
      setValue('termination_date', data.termination_date)
      setValue('reason_contract_termination', data.reason_contract_termination)
      setValue('is_health_insurance', !!data.is_health_insurance)
      setValue('is_syndicate', !!data.is_syndicate)
      setValue('is_unemployment_insurance', !!data.is_unemployment_insurance)
      setValue('is_social_insurance', !!data.is_social_insurance)
      setValue('hourly_salary', data.hourly_salary)
      setValue('is_system_insurance_salary', data.is_system_insurance_salary)

      setEmployeeInfo(data.employee)

      if (
        data.status === STATUS_LABOR_CONTRACT['TERMINATE'] ||
        data.status === STATUS_LABOR_CONTRACT['EXPIRTION']
      ) {
        setIsCheckDisabled(true)
      } else {
        setIsCheckDisabled(false)
      }
    },
    enabled: !!params.id
  })

  const onSubmit: SubmitHandler<LaborContractType> = async (value) => {
    const data = value
    if (isCheckValid) {
      data.basic_salary = HOULR_SALARY_STATUS.TYPE_ZERO
      //@ts-ignore
      data.insurance_salary = watch('insurance_salary')
    }

    if (watch('hourly_salary') === HOULR_SALARY_STATUS.TYPE_ZERO) {
      //@ts-ignore
      data.hourly_salary = setValue('hourly_salary', data.hourly_salary)
    }

    if (!isCheckValid) {
      if (!data.basic_salary) {
        //@ts-ignore
        data.basic_salary = setValue('basic_salary', data.basic_salary)
      }
      data.hourly_salary = HOULR_SALARY_STATUS.TYPE_ZERO
    }

    if (isCheckInsurance && checkInsuranceForm) {
      if (isSystemInsuranceSalary) {
        data.is_system_insurance_salary = isSuranceSalaryAdmin
      } else {
        //@ts-ignore
        // data.insurance_salary = data.insurance_salary
        data.is_system_insurance_salary = HOULR_SALARY_STATUS.TYPE_ZERO
      }
    } else {
      data.insurance_salary = HOULR_SALARY_STATUS.TYPE_ZERO
      data.is_system_insurance_salary = HOULR_SALARY_STATUS.TYPE_ZERO
    }
    data.is_social_insurance = checkInsuranceForm

    try {
      const res = await createOrUpdateApi(data)
      if (res.status == 200) {
        toast(res.data.message)
        navigate(`/employees/labor-contract/list-contract`)
      }
    } catch (error:any) {
      if (error.errors) {
        for (const [key, value] of Object.entries(error.errors)) {
          setError(key as keyof LaborContractType, { message: value as string })
        }
      }
    }
  }

  const [isExtendLaborContract, setIsExtendLabor] = useState<boolean>(false)
  const handleExtendLaborContract = () => {
    setIsCheckDisabled(false)
    setValue('id', 0)
    // setValue('employee_id', '')
    // setValue('labor_contract_type_id', 0)
    // setValue('allowances', [])
    setValue('code', '')
    setValue('sign_date', '')
    setValue('effective_date', '')
    setValue('expire_date', '')
    setValue('status', STATUS_LABOR_CONTRACT['ACTIVE'])
    setValue('basic_salary', 0)
    setValue('insurance_salary', 0)
    setValue('termination_date', '')
    setValue('reason_contract_termination', '')
    setValue('is_health_insurance', true)
    setValue('is_syndicate', true)
    setValue('is_unemployment_insurance', true)
    setValue('is_social_insurance', false)
    setValue('hourly_salary', 0)
    // setEmployeeInfo(undefined)
    setIsExtendingContract(true)
    setOpenConfirm(false)
    navigate('/employees/labor-contract/list-contract/create')
    setIsExtendLabor(false)
  }

  useEffect(() => {
    if (watch('status') !== STATUS_LABOR_CONTRACT['TERMINATE']) {
      resetField('termination_date'), resetField('reason_contract_termination')
    }
  }, [watch('status')])

  return (
    <Pagev2>
      <Typography
        sx={{
          ...styleTyporaphyTitle
        }}
      >
        {params?.id
          ? t('labor_contract.labor_contract_detail_breadcrumb')
          : t('labor_contract.create_labor_contract_breadcrumb')}
      </Typography>
      {isLoading ? (
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <RoundPaper>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            autoComplete="off"
            sx={{ padding: '18px' }}
          >
            <Grid container>
              {employeeInfo ? (
                <Grid container item {...grid_half}>
                  <Grid container item {...grid_full}>
                    <Heading>{t('employee_information')}</Heading>
                  </Grid>

                  <EmployeeSummary
                    employeeInfo={employeeInfo?.personal_information}
                    employeeCode={employeeInfo?.employee_code}
                    employeePosition={employeeInfo?.position?.name}
                    employeeBranch={employeeInfo?.branch?.name}
                    employeeDepartment={employeeInfo?.department?.name}
                  />
                </Grid>
              ) : (
                <EmployeeInfoForm
                  control={control}
                  setValue={setValue}
                  resetField={resetField}
                  clearErrors={clearErrors}
                />
              )}

              <LaborContractForm
                control={control}
                setValue={setValue}
                watch={watch}
                isCheckDisabled={isCheckDisabled}
              />
              {watch('status') === STATUS_LABOR_CONTRACT['TERMINATE'] ? (
                <TerminationContractForm control={control} isCheckDisabled={isCheckDisabled} />
              ) : null}
              <SalaryBonusForm
                control={control}
                setValue={setValue}
                setIsValid={setIsCheckValid}
                setIsSystemInsuranceSalary={setIsSystemInsuranceSalary}
                // lương bảo hiểm
                isSuranceSalaryAdmin={isSuranceSalaryAdmin}
                isCheckInsurance={isCheckInsurance}
                setIsCheckInsurance={setIsCheckInsurance}
                isCheckDisabled={isCheckDisabled}
                checkInsuranceForm={checkInsuranceForm}
              />

              <InsuranceForm
                control={control}
                isCheckInsurance={checkInsuranceForm}
                setIsCheckInsurance={setCheckInsuranceForm}
                isCheckDisabled={isCheckDisabled}
              />
              {!isCheckDisabled && !isExtendingContract ? (
                <Grid
                  container
                  rowSpacing={2}
                  justifyContent="flex-end"
                  gap={2}
                  style={{ marginTop: 20 }}
                  xs={12}
                >
                  <Grid item xs={4} sm={3} md={2.5} lg={1.5} xl={1.2} sx={{ ...spaceButton }}>
                    <ButtonCommon error={true} variant="outlined" onClick={() => navigate(-1)}>
                      {t('cancel')}
                    </ButtonCommon>
                  </Grid>

                  <Grid item xs={4} sm={3} md={2.5} lg={1.5} xl={1.2} sx={{ ...spaceButton }}>
                    <ButtonCommon
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                      startIcon={isSubmitting && <CircularProgress color="inherit" size={12} />}
                    >
                      {!params.id ? t('create') : t('update')}
                    </ButtonCommon>
                  </Grid>
                </Grid>
              ) : watch('status') === STATUS_LABOR_CONTRACT['EXPIRTION'] ? (
                <Grid item container spacing={2} justifyContent="flex-end" mt={2}>
                  <Grid item xs={12} md={3} xl={1.5}>
                    <ButtonCommon
                      variant="contained"
                      color="error"
                      onClick={() => setOpenConfirm(true)}
                      disabled={isSubmitting}
                      startIcon={isSubmitting && <CircularProgress color="inherit" size={12} />}
                    >
                      {t('labor_contract.status.extend')}
                    </ButtonCommon>
                  </Grid>
                </Grid>
              ) : (
                ''
              )}
              {isExtendingContract && !isCheckDisabled ? (
                <Grid item container spacing={2} justifyContent="flex-end" mt={2}>
                  <Grid item sm={1.25} xs={12}>
                    <ButtonCommon
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                      startIcon={isSubmitting && <CircularProgress color="inherit" size={12} />}
                    >
                      {t('create')}
                    </ButtonCommon>
                  </Grid>
                </Grid>
              ) : (
                ''
              )}
            </Grid>
          </Box>
        </RoundPaper>
      )}
      <FormModal
        open={openConfirm}
        handleClose={() => setOpenConfirm(false)}
        onSubmit={handleExtendLaborContract}
        isCancel={isExtendLaborContract}
        title={t('labor_contract.status.extend')}
        content={t('labor_contract.status.confirm_extend')}
      />
    </Pagev2>
  )
}

const spaceButton = {
  mr: { xs: 0, sm: 3, md: 0 }
}
const styleTyporaphyTitle = {
  fontSize: { xs: '18px', md: '20px', lg: '24px' },
  mb: 1,
  fontWeight: 800,
  textTransform: 'uppercase',
  fontFamily: 'Lato',
  color: '#146BD2',
  lineHeight: '36px'
}
