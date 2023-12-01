import { Box, CircularProgress, Grid } from '@mui/material'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
import { DatePicker } from 'components/Form/Input/DatePicker'
import { Input } from 'components/Form/Input/Input'
import ReactTableWithToolBar from 'components/ReactTable/ReactTableWithToolBar/ReactTableWithToolBar'
import { V1 } from 'constants/apiVersion'
import { useAtomValue } from 'jotai'
import { systemSettingAtom } from 'lib/atom/authAtom'
import { useApiResource } from 'lib/hook/useApiResource'
import { Education, Educations, EducationsObj } from 'lib/types/education'
import { convertDatetimeTZV2, convertFormatDate } from 'lib/utils/format'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router'
import { Row } from 'react-table'
import { toast } from 'react-toastify'
import { ModalAddEducation } from './ModalAddEducation'
import { ModalEditEdcucation } from './ModalEditEducation'

const ListEmployeeEducation: React.VFC = () => {
  const params = useParams()
  const { deleteApi } = useApiResource<Education>(`${V1}/user/education/employee/${params.id}`)
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [openModal, setOpenModal] = useState(false)
  const [educationActive, setEducationActive] = useState<number>(-1)
  const [educations, setEducations] = useState<Education[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [openAdd, setOpenAdd] = useState<boolean>(false)
  const [reRender, setReRender] = useState(0)
  const [isSubmit, setIsSubmit] = useState<boolean>(false)
  const isEdit = !!params.id

  const systemSetting: any = useAtomValue(systemSettingAtom)

  const { createOrUpdateApi } = useApiResource<EducationsObj>(`${V1}/user/education/employee`)

  const { control, setValue, getValues, setError, reset } = useForm<EducationsObj>({
    defaultValues: {
      educations: [{}]
    }
  })

  const forceReRender = (value: number) => {
    setReRender((prev) => prev + value)
  }

  const { refetch } = useQuery<Educations>([`${V1}/user/education/employee/${params.id}`], {
    onSuccess: (data: any) => {
      setValue('educations', data.data)
      setEducations(data)
      setLoading(!loading)
    },
    enabled: !!isEdit
  })

  const onRowClick = ({ original }: Row<Education>) => {
    // navigate('edit/' + original.id)
    const edus = getValues().educations

    edus.find((e, index) => {
      if (e.id === original.id) {
        setEducationActive(index)
      }

      return e.id === original.id
    })

    setOpenModal(true)
  }

  const onCreate = () => {
    // navigate('new')
    setOpenAdd(true)
  }

  const handleClose = () => {
    setOpenModal(false)
    reset({}, { keepValues: true })
  }

  const clsOpenAdd = () => {
    setOpenAdd(false)
  }

  const grid = { xs: 12, md: 6 }
  const gridOneLine = { xs: 12 }

  const [contentModal, setContentModal] = useState<any>(null)

  const onSubmit = async () => {
    try {
      setIsSubmit(true)
      const customValue = { ...getValues(), id: params.id }

      const res = await createOrUpdateApi(customValue)
      if (res.status == 200) {
        const message = res.data.message
        toast.success(message)
        setLoading(!loading)
        forceReRender(2)
        setIsSubmit(false)
      }
      handleClose()
    } catch (error: any) {
      toast.error(error.error)

      if (error.errors) {
        for (const [key, value] of Object.entries(error.errors)) {
          setError(key as keyof EducationsObj, { message: value as string })
        }
      }
    }
  }

  const EmployeeEducationFields = {
    listFields: [
      {
        Header: t('education.school_name'),
        accessor: 'school_name',
        display: true
      },
      {
        Header: t('description'),
        accessor: 'description',
        display: true
      },
      {
        Header: t('from'),
        accessor: 'from_date',
        Cell: ({ row }: any) => {
          return <span>{row.original.from_date}</span>
        },
        display: true
      },
      {
        Header: t('to'),
        accessor: 'to_date',
        Cell: ({ row }: any) => {
          return (
            <span>
              {row.original.to_date}
            </span>
          )
        },
        display: true
      }
    ],
    searchFields: [
      {
        Header: t('education.school_name'),
        accessor: 'school_name',
        type: 'text',
        grid: { xs: 12, sm: 6, md: 6 },
        display: true
      }
    ],
    quickSearchField: {
      Header: t('employee.school_name'),
      accessor: 'school_name',
      type: 'text',
      grid: { xs: 12, sm: 6, md: 6 },
      display: true
    }
  }

  useEffect(() => {
    if (openModal) {
      refetch()
    }
  }, [openModal])

  useEffect(() => {
    setContentModal(
      <Box>
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item {...gridOneLine}>
            <Input
              fullWidth
              label={t('education.school_name')}
              placeholder={t('education.school_name')}
              name={`educations.${educationActive}.school_name`}
              control={control}
              required
            />
          </Grid>

          <Grid item {...grid}>
            <DatePicker
              fullWidth
              label={t('from')}
              name={`educations.${educationActive}.from_date`}
              control={control}
              required
            />
          </Grid>
          <Grid item {...grid}>
            <DatePicker
              fullWidth
              label={t('to')}
              name={`educations.${educationActive}.to_date`}
              control={control}
              required
            />
          </Grid>
          <Grid item {...gridOneLine}>
            <Input
              fullWidth
              label={t('description')}
              name={`educations.${educationActive}.description`}
              control={control}
              placeholder={t('description')}
              required
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ ...styleButton }}>
          <Grid item xs={6} alignItems="center">
            <ButtonCommon variant="outlined" error={true} onClick={handleClose}>
              {t('cancel')}
            </ButtonCommon>
          </Grid>
          <Grid item xs={6} alignItems="center">
            <ButtonCommon
              variant="contained"
              type="submit"
              onClick={onSubmit}
              startIcon={isSubmit ? <CircularProgress color="inherit" size="16px" /> : ''}
            >
              {t('submit')}
            </ButtonCommon>
          </Grid>
        </Grid>
      </Box>
    )
  }, [educationActive, isSubmit])

  const styleButton = {
    mt: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    px: { xs: 0, md: 10, lg: 12, xl: 25 }
  }

  return (
    <>
      <ReactTableWithToolBar
        title={t('education.name')}
        endpoint={`${V1}/user/education/employee/${params.id}`}
        columns={EmployeeEducationFields.listFields}
        quickSearchField={EmployeeEducationFields.quickSearchField}
        onActionCreate={onCreate}
        displayTitle={true}
        isDisableBreadcrumb={true}
        deleteApi={deleteApi}
        defaultActionDelete
        data={[]}
        loading={loading}
        onActionEdit={(e: any) => onRowClick(e.row)}
        onRowClick={onRowClick}
        reRender={reRender}
        forceReRender={forceReRender}
        sxCustom={{
          padding: 0,
          width: '100% important',
          marginTop: 0,
          marginBottom: 2
        }}
        paperOptions={{ elevation: 0 }}
        titleDelete={t('education.delete_text_education')}
        titlePage={t('education.name')}
      />

      <ModalEditEdcucation
        open={openModal}
        handleClose={handleClose}
        title={t('companies.edit_info')}
        content={contentModal}
        customStyles={{ width: { xs: '90%', md: '60%' }, btnFooterRight: true }}
      />
      <ModalAddEducation
        title={t('education.add_new')}
        open={openAdd}
        reload={refetch}
        forceReRender={forceReRender}
        id={params?.id}
        handleClose={clsOpenAdd}
        customStyles={{ width: { xs: '90%', md: '60%' }, btnFooterRight: true }}
      />
    </>
  )
}

export { ListEmployeeEducation }
