import { Grid } from '@mui/material'
import { Select, SelectOption } from 'components/Form/Autocomplete/Select'
import { USER_URL } from 'constants/apiVersion'
import { BaseMaster } from 'lib/types/baseMaster'
import { LaborContractType } from 'lib/types/labor-contract'
import { EmployeeType } from 'lib/types/user'
import { STATUS_EMPLOYEE } from 'lib/utils/contants'
import { useEffect, useState } from 'react'
import {
    Control,
    FieldPath,
    UseFormClearErrors,
    UseFormResetField,
    UseFormSetValue,
    useWatch
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Heading, grid_full, grid_half } from './components'
import { EmployeeSummary } from './EmployeeSummary'
import { useDebounce } from 'lib/hook/useDebounce'

  // @ts-ignore
type BaseMasterResponse = {
  data: BaseMaster[]
}

type EmployeeInfoFormProps = {
  control: Control<LaborContractType, object>
  setValue: UseFormSetValue<LaborContractType>
  resetField: UseFormResetField<LaborContractType>
  clearErrors: UseFormClearErrors<LaborContractType>
}

export const EmployeeInfoForm: React.FC<EmployeeInfoFormProps> = ({
  control,
  setValue,
  resetField,
  clearErrors
}) => {
  const { t } = useTranslation()
  const params = useParams()
  const [employeeOption, setEmployeeOption] = useState<SelectOption[]>([])
  const [employeeList, setEmployeeOptionList] = useState<EmployeeType[]>([])
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeType>()
  const [employeeInput, setEmployeeInput] = useState<string>('')
  const [checkIdLaborContract, setCheckIdLaborContrac] = useState<any>([])
  const debouncedEmployeeInput = useDebounce(employeeInput, 500)

  useQuery<LaborContractType | any>([`${USER_URL}/labor-contract`], {
    onSuccess: ({ data }) => {
      const filterData = data.filter((item: any) => item.status === 0)
      setCheckIdLaborContrac(filterData)
    }
  })

  useQuery<EmployeeType[]>(
    [
      `${USER_URL}/employee/get-list-by-company`,
      {
        employee_name: debouncedEmployeeInput,
        per_page: 20
      }
    ],
    {
      onSuccess: (data) => {
        const filteredData = data.filter((item: any) => item.status === STATUS_EMPLOYEE.WORKING)

        setEmployeeOptionList(filteredData)
        setEmployeeOption(
          filteredData.map((item) => ({
            label: `${item.personal_information.full_name}`,
            value: item.id,
            status: item.status
          }))
        )
      },
      enabled: true
    }
  )

  const employeeId = useWatch({
    control,
    name: 'employee_id'
  })

  const handleResetFields = () => {
    resetField('code')
  }

  const { data: countLaborContract } = useQuery(
    [`${USER_URL}/labor-contract/count-by-employee/${employeeId}`],
    {
      enabled: !!employeeId
    }
  )

  const { data: hasLaborContractActive = false } = useQuery(
    [`${USER_URL}/labor-contract/has-labor-contract-active/${employeeId}`],
    {
      enabled: !!employeeId
    }
  )

  useEffect(() => {
    const postPoneId = checkIdLaborContract.find((item: any) => item.employee_id === employeeId)
    if (hasLaborContractActive && !params.id) {
      toast.error(t('labor_contract.employee_has_labor_contract_active'))
      setEmployeeInfo(undefined)
      setValue('code', '')
      handleResetFields()
    } else if (postPoneId && !params.id) {
      toast.error(t('labor_contract.employee_has_labor_contract_postpone'))
      setEmployeeInfo(undefined)
      setValue('code', '')
      handleResetFields()
    } else {
      const employee = employeeList.find((item) => item.id === employeeId)
      if (employee) {
        setEmployeeInfo(employee)
        const fieldClearErrors = [] as FieldPath<LaborContractType>[]
        clearErrors(fieldClearErrors)
      }
    }
  }, [hasLaborContractActive])

  useEffect(() => {
    if (!params.id && employeeId) {
      countLaborContract != null &&
        setValue(
          'code',
          employeeInfo?.employee_code !== undefined
            ? `MHD_NV${employeeInfo?.employee_code}_${Number(countLaborContract) + 1}`
            : '',
          {
            shouldValidate: true
          }
        )
    }
  }, [countLaborContract, employeeId, employeeInfo?.employee_code, params.id])

  useEffect(() => {
    if (params.id && employeeId) {
      const employee = employeeList.find((item) => item.id === employeeId)
      if (employee) {
        setEmployeeInfo(employee)
      }
    }
  }, [employeeId, employeeList, params.id])

  const grid = { xs: 12, sm: 6, md: 4, lg: 4 }

  return (
    <>
      <Grid container rowSpacing={{ xs: 2, sm: 3 }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {!params.id && (
          <>
            <Grid container item md={12} spacing={2}>
              <Grid item {...grid}>
                <Select
                  label={t('labor_contract.employee')}
                  name="employee_id"
                  setInputState={setEmployeeInput}
                  options={employeeOption}
                  placeholder={t('labor_contract.employee')}
                  control={control}
                  fullWidth
                  required
                  disabled={!!params.id}
                />
              </Grid>
            </Grid>
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
          </>
        )}
      </Grid>
    </>
  )
}
