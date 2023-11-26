//@ts-nocheck
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { Button, Grid, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { request } from 'lib/request'
import React, { useMemo, useState } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { STEP } from './CompanyForm'
import { useAtom } from 'jotai'
import { setLocalStorageCleanup } from './file'
import { CompanyData } from 'lib/types/companyGroup'
import { companyAtom } from 'lib/atom/CompanyInfoAtom'
import { branchAndDepartment } from 'lib/atom/branchAndDepartmentAtom'
type CompanyDepartmentAndBranchProps = {
  companyId?: number
  handleComplete: (s: number) => void
  statusStep: string
}

type BranchAndDepartmentInput = {
  value: string
  key: number
}

type BranchAndDepartment = {
  id: number
  name: string
  company_id: number
}

type BranchAndDepartmentResponse = {
  branchs: BranchAndDepartment[]
  departments: BranchAndDepartment[]
}

const CompanyDepartmentAndBranch: React.VFC<CompanyDepartmentAndBranchProps> = ({
  companyId,
  handleComplete,
  statusStep
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [branchAndDepartmentAtom, setBranchAndDepartmentAtom] = useAtom(branchAndDepartment)

  const [branchs, setBranchs] = useState<Array<BranchAndDepartmentInput>>(
    branchAndDepartmentAtom.branchs.length > 0
      ? branchAndDepartmentAtom.branchs
      : [{ value: '', key: Math.random() }]
  )
  const [departments, setDepartments] = useState<Array<BranchAndDepartmentInput>>(
    branchAndDepartmentAtom.departments.length > 0
      ? branchAndDepartmentAtom.departments
      : [{ value: '', key: Math.random() }]
  )
  const [errors, setErrors] = useState({ branchs: {}, departments: {} })
  const [company_Atom] = useAtom<CompanyData>(companyAtom)
  const addBranch = () => {
    const branchsNew = [...branchs]
    branchsNew.push({ value: '', key: Math.random() })
    setBranchs(() => branchsNew)
  }

  const addDepartment = () => {
    const departmentNew = [...departments]
    departmentNew.push({ value: '', key: Math.random() })
    setDepartments(departmentNew)
  }

  const onChangeInput = (e: any, i: number, nameKey: string) => {
    const value = e.target.value
    if (nameKey == 'branchs') {
      const branchsNew = [...branchs]
      branchsNew[i].value = value
      setBranchs(branchsNew)
    } else {
      const departmentNew = [...departments]
      departmentNew[i].value = value
      setDepartments(() => departmentNew)
    }
  }

  const removeBranch = (index: number) => {
    const branchsNew = [...branchs]
    branchsNew.splice(index, 1)
    setBranchs(() => branchsNew)
  }

  const removeDepartment = (index: number) => {
    const departmentNew = [...departments]
    departmentNew.splice(index, 1)
    setDepartments(() => departmentNew)
  }

  const handleSubmit: SubmitHandler<any> = async (value) => {
    if (company_Atom?.is_create == 0) {
      toast.error(t('companies.please_complete_step_1'))
      return
    }
    let res
    setErrors({ branchs: {}, departments: {} })
    try {
      const formData = new FormData()

      departments.map((d) => {
        formData.append('departments[]', d.value)
      })

      branchs.map((b) => {
        formData.append('branchs[]', b.value)
      })

      res = await request.post(`/1.0/user/companies/department-branch`, formData)
      if (res.status == 200) {
        handleComplete(STEP[2])
        setBranchAndDepartmentAtom((prev) => ({
          ...prev,
          branchs: branchs,
          departments: departments
        }))
        setLocalStorageCleanup('branch_departments')
      }
    } catch (error:any) {
      toast.error(error.error)
      if (error.errors) {
        const e: any = { departments: {}, branchs: {} }
        for (const [key, value] of Object.entries(error.errors)) {
          const keyArray = key.split('.')
          e[keyArray[0]][keyArray[1]] = t(value as string)
        }
        setErrors(e)
      }
    }
  }

  const gridIcon = { md: 2, xs: 2 }
  const gridFull = { md: 10, xs: 12 }

  const branchView = useMemo(
    () => (
      <Grid item container md={12} spacing={2}>
        {branchs.map((branch, index) => (
          <React.Fragment key={index}>
            <Grid item {...gridFull}>
              <TextField
                fullWidth
                key={branch.key}
                onChange={(e) => onChangeInput(e, index, 'branchs')}
                name="branchs[]"
                value={branch.value}
                //@ts-ignore
                helperText={errors.branchs?.[index]}
                //@ts-ignore
                error={!!errors.branchs?.[index]}
                label={t('branch_obj.name')}
                variant="outlined"
              />
            </Grid>
            {branchs.length > 1 && (
              <Grid sx={{ ...styleGridClose }} item {...gridIcon}>
                <Button variant={'contained'} color={'error'} onClick={() => removeBranch(index)}>
                  <CloseIcon />
                </Button>
              </Grid>
            )}
          </React.Fragment>
        ))}
      </Grid>
    ),
    [branchs, errors]
  )

  const departmentView = useMemo(
    () => (
      <Grid item container md={12} spacing={2}>
        {departments.map((department, index) => (
          <React.Fragment key={index}>
            <Grid item {...gridFull}>
              <TextField
                fullWidth
                key={department.key}
                onChange={(e) => onChangeInput(e, index, 'departments')}
                name="departments[]"
                value={department.value}
                //@ts-ignore
                helperText={errors.departments?.[index]}
                //@ts-ignore
                error={!!errors.departments?.[index]}
                label={t('department_obj.name')}
                variant="outlined"
              />
            </Grid>
            {departments.length > 1 && (
              <Grid sx={{ ...styleGridClose }} item {...gridIcon}>
                <Button
                  variant={'contained'}
                  color={'error'}
                  onClick={() => removeDepartment(index)}
                >
                  <CloseIcon />
                </Button>
              </Grid>
            )}
          </React.Fragment>
        ))}
      </Grid>
    ),
    [departments, errors]
  )

  return (
    <>
      <Box component="form" noValidate autoComplete="off" sx={{ minHeight: '100vh' }}>
        <Grid container rowSpacing={1} columnSpacing={{ ...styleColumnSpacing }} mt={2}>
          <Grid item {...styleGridItem}>
            <Grid item {...gridFull}>
              <Typography sx={{ position: 'relative' }} marginBottom={1} variant={'h5'}>
                {t('branch_obj.create_page')}
                <span
                  style={{
                    ...styleRequired
                  }}
                >
                  *
                </span>
              </Typography>
            </Grid>
            {branchView}
            <Grid item marginTop={2} {...gridFull} textAlign={'end'}>
              <Button variant={'contained'} onClick={addBranch}>
                <AddIcon />
              </Button>
            </Grid>
          </Grid>
          <Grid item {...styleGridItem}>
            <Grid item {...gridFull}>
              <Typography marginBottom={1} sx={{ position: 'relative' }} variant={'h5'}>
                {t('department_obj.create_page')}
                <span
                  style={{
                    ...styleRequired
                  }}
                >
                  *
                </span>
              </Typography>
            </Grid>
            {departmentView}
            <Grid item marginTop={2} {...gridFull} textAlign={'end'}>
              <Button variant={'contained'} onClick={addDepartment}>
                <AddIcon />
              </Button>
            </Grid>
          </Grid>

          <Grid item {...styleGridItem}>
            <Button onClick={handleSubmit} size={'large'} variant="contained">
              {t('companies.steps.next')}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
const styleRequired: React.CSSProperties = {
  position: 'absolute',
  fontSize: '14px',
  bottom: 2,
  color: '#ff0000'
}
const styleGridItem = {
  xs: 12,
  md: 6
}

const styleColumnSpacing = {
  xs: 1,
  sm: 2,
  md: 3
}

const styleGridClose = {
  display: 'flex',
  alignItems: 'center'
}

export { CompanyDepartmentAndBranch }
