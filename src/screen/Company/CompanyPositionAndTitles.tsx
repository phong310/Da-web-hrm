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
import { branchAndDepartment } from 'lib/atom/branchAndDepartmentAtom'
import { companyAtom } from 'lib/atom/CompanyInfoAtom'
import { positionAndTitle } from 'lib/atom/positionAndTitles'
type CompanyDepartmentAndBranchProps = {
  companyId?: number
  handleComplete: (s: number) => void
  statusStep: string
}

type PositionAndTitleInput = {
  value: string
  key: number
}

type PositionAndTitleResponse = {
  position: PositionAndTitleInput[]
  titles: PositionAndTitleInput[]
}

const CompanyPositionAndTitles: React.VFC<CompanyDepartmentAndBranchProps> = ({
  companyId,
  handleComplete,
  statusStep
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [positionAndTitleAtom, setpositionAndTitle] = useAtom(positionAndTitle)
  const [branchAndDepartmentAtom, setBranchAndDepartmentAtom] = useAtom(branchAndDepartment)
  const [positions, setPositions] = useState<Array<PositionAndTitleInput>>(
    positionAndTitleAtom.positions.length > 0
      ? positionAndTitleAtom.positions
      : [{ value: '', key: Math.random() }]
  )
  const [titles, setTitle] = useState<Array<PositionAndTitleInput>>(
    positionAndTitleAtom.titles.length > 0
      ? positionAndTitleAtom.titles
      : [{ value: '', key: Math.random() }]
  )
  const [errors, setErrors] = useState({ positions: {}, titles: {} })
  const [company_Atom] = useAtom<CompanyData>(companyAtom)
  const addPosition = () => {
    const positionsNew = [...positions]
    positionsNew.push({ value: '', key: Math.random() })
    setPositions(() => positionsNew)
  }

  const addTitle = () => {
    const titlesNew = [...titles]
    titlesNew.push({ value: '', key: Math.random() })
    setTitle(titlesNew)
  }

  const onChangeInput = (e: any, i: number, nameKey: string) => {
    const value = e.target.value
    if (nameKey == 'positions') {
      const positionsNew = [...positions]
      positionsNew[i].value = value
      setPositions(positionsNew)
    } else {
      const titlesNew = [...titles]
      titlesNew[i].value = value
      setTitle(() => titlesNew)
    }
  }

  const removePosition = (index: number) => {
    const positionsNew = [...positions]
    positionsNew.splice(index, 1)
    setPositions(() => positionsNew)
  }

  const removeTitle = (index: number) => {
    const titlesNew = [...titles]
    titlesNew.splice(index, 1)
    setTitle(() => titlesNew)
  }

  const handleSubmit: SubmitHandler<any> = async (value) => {
    if (company_Atom?.is_create == 0) {
      toast.error(t('companies.please_complete_step_1'))
      return
    }
    if (
      branchAndDepartmentAtom?.branchs.length == 0 ||
      branchAndDepartmentAtom?.departments.length == 0
    ) {
      toast.error(t('companies.please_complete_step_2'))
      return
    }
    let res
    setErrors({ positions: {}, titles: {} })
    try {
      const formData = new FormData()

      positions.map((d) => {
        formData.append('positions[]', d.value)
      })

      titles.map((b) => {
        formData.append('titles[]', b.value)
      })

      res = await request.post(`/1.0/user/companies/check-position-titles`, formData)
      if (res.status == 200) {
        handleComplete(STEP[3])
        setpositionAndTitle((prev) => ({
          ...prev,
          positions: positions,
          titles: titles
        }))
        setLocalStorageCleanup('positions_titles')
      }
    } catch (error:any) {
      toast.error(error.error)
      if (error.errors) {
        const e: any = { positions: {}, titles: {} }
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
        {positions.map((position, index) => (
          <React.Fragment key={index}>
            <Grid item {...gridFull}>
              <TextField
                fullWidth
                key={position.key}
                onChange={(e) => onChangeInput(e, index, 'positions')}
                name="positions[]"
                value={position.value}
                //@ts-ignore
                helperText={errors.positions?.[index]}
                //@ts-ignore
                error={!!errors.positions?.[index]}
                label={t('positions_obj.name')}
                variant="outlined"
              />
            </Grid>
            {positions.length > 1 && (
              <Grid sx={{ ...styleGridClose }} item {...gridIcon}>
                <Button variant={'contained'} color={'error'} onClick={() => removePosition(index)}>
                  <CloseIcon />
                </Button>
              </Grid>
            )}
          </React.Fragment>
        ))}
      </Grid>
    ),
    [positions, errors]
  )

  const titleView = useMemo(
    () => (
      <Grid item container md={12} spacing={2}>
        {titles.map((title, index) => (
          <React.Fragment key={index}>
            <Grid item {...gridFull}>
              <TextField
                fullWidth
                key={title.key}
                onChange={(e) => onChangeInput(e, index, 'titles')}
                name="titles[]"
                value={title.value}
                //@ts-ignore
                helperText={errors.titles?.[index]}
                //@ts-ignore
                error={!!errors.titles?.[index]}
                label={t('titles_obj.name')}
                variant="outlined"
              />
            </Grid>
            {titles.length > 1 && (
              <Grid sx={{ ...styleGridClose }} item {...gridIcon}>
                <Button variant={'contained'} color={'error'} onClick={() => removeTitle(index)}>
                  <CloseIcon />
                </Button>
              </Grid>
            )}
          </React.Fragment>
        ))}
      </Grid>
    ),
    [titles, errors]
  )

  return (
    <>
      <Box component="form" noValidate autoComplete="off" sx={{ minHeight: '100vh' }}>
        <Grid container rowSpacing={1} columnSpacing={{ ...styleColumnSpacing }} mt={2}>
          <Grid item {...styleGridItem}>
            <Grid item {...gridFull}>
              <Typography sx={{ position: 'relative' }} marginBottom={1} variant={'h5'}>
                {t('positions_obj.create_page')}
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
              <Button variant={'contained'} onClick={addPosition}>
                <AddIcon />
              </Button>
            </Grid>
          </Grid>
          <Grid item {...styleGridItem}>
            <Grid item {...gridFull}>
              <Typography marginBottom={1} sx={{ position: 'relative' }} variant={'h5'}>
                {t('titles_obj.create_page')}
                <span
                  style={{
                    ...styleRequired
                  }}
                >
                  *
                </span>
              </Typography>
            </Grid>
            {titleView}
            <Grid item marginTop={2} {...gridFull} textAlign={'end'}>
              <Button variant={'contained'} onClick={addTitle}>
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

export { CompanyPositionAndTitles }
