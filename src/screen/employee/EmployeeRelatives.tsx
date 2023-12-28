// @ts-nocheck
import { Box } from '@mui/material'
import ReactTableWithToolBar from 'components/ReactTable/ReactTableWithToolBar/ReactTableWithToolBar'
import { V1 } from 'constants/apiVersion'
import { useApiResource } from 'lib/hook/useApiResource'
import i18n from 'lib/lang/translations/i18n'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { CellProps, Row } from 'react-table'
import { EmployeeTabs } from './EmployeeTabs'
import { PageTable } from 'components/Layouts/Page/PageTable'
import { Relative, Relatives, RelativesObj } from 'lib/types/relatives'
import { CHECK_NUMBER_PHONE, RELATIVES_TYPES } from 'lib/utils/contants'
import { Status } from 'components/Status/Status'
import NewEmployeeRelatives from './NewEmployeeRelatives'

const EmployeeRelatives = () => {
  const [reRender, setReRender] = useState(0)
  const params = useParams()
  const { deleteApi } = useApiResource(`${V1}/user/relatives/employee/${params.id}`)
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [openModal, setOpenModal] = useState(false)
  const [openModalCreate, setOpenModalCreate] = useState(false)
  const [relativeActive, setRelativeActive] = useState<number>(-1)
  const [relatives, setRelatives] = useState<Relative[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [originalId, setOriginalId] = useState<number>(0)
  const [showDateApply, setShowDateApply] = useState<boolean>(false)
  const [dataDetail, setDataDetail] = useState<Relative>()
  const [isEditForm, setIsEditForm] = useState<boolean>(false)
  const isEdit = !!params.id

  const { control, setValue, getValues, setError, reset, handleSubmit } = useForm<RelativesObj>({
    defaultValues: {
      relatives: [{}]
    }
  })

  const { data, refetch } = useQuery<Relatives>([`${V1}/user/relatives/employee/${params.id}`], {
    onSuccess: (data: any) => {
      setValue('relatives', data.data)
      setRelatives(data.data)
      setLoading(false)
    },

    enabled: !!isEdit
  })
  const onRowClick = ({ original }: Row<Relative>) => {
    setDataDetail(original)
    setOpenModalCreate(true)
  }

  const onCreate = () => {
    setDataDetail(undefined)
    setOpenModalCreate(true)
  }
  const handleCloseCreate = () => {
    setOpenModalCreate(false)
  }

  const forceReRender = (value: number) => {
    setReRender((prev) => prev + value)
  }

  const EmployeeRelativesField = {
    listFields: [
      {
        Header: i18n.t('employee.full_name'),
        accessor: 'full_name',
        display: true
      },
      {
        Header: i18n.t('employee.relatives'),
        accessor: 'relationship_type',
        Cell: ({ value }: CellProps<Relative>) => {
          return RELATIVES_TYPES(value)
        },
        display: true
      },
      {
        Header: i18n.t('employee.phone_number'),
        accessor: 'phone',
        Cell: ({ value }: CellProps<Relative>) => {
          return CHECK_NUMBER_PHONE(value)
        },
        display: true
      },
      {
        Header: i18n.t('address.name'),
        accessor: 'address',
        display: true
      },
      {
        Header: i18n.t('employee.birth_day'),
        accessor: 'birthday',
        display: true
      },
      {
        Header: i18n.t('employee.relatives_person'),
        accessor: 'is_dependent_person',
        Cell: ({ value }: any) => <Status value={value as number} isStatusPaidLeave={true} />,
        display: true
      }
    ],
    quickSearchField: {
      Header: i18n.t('employee.full_name'),
      accessor: 'full_name',
      type: 'text',
      grid: { xs: 12, sm: 6, md: 6 },
      display: true
    }
  }

  useEffect(() => {
    if (relatives[relativeActive]?.is_dependent_person) {
      setShowDateApply(true)
    } else {
      setShowDateApply(false)
    }
  }, [relativeActive])

  return (
    <PageTable>
      <Box sx={{ paddingTop: '16px' }}>
        <EmployeeTabs />
        <ReactTableWithToolBar
          title={t('employee.relatives')}
          endpoint={`${V1}/user/relatives/employee/${params.id}`}
          columns={EmployeeRelativesField.listFields}
          quickSearchField={EmployeeRelativesField.quickSearchField}
          onActionCreate={onCreate}
          displayTitle={true}
          deleteApi={deleteApi}
          defaultActionDelete
          data={[]}
          loading={loading}
          onActionEdit={(e: any) => onRowClick(e.row)}
          onRowClick={onRowClick}
          reRender={reRender}
          forceReRender={forceReRender}
          isDisableBreadcrumb={true}
          sxCustom={{
            padding: 0,
            width: '100% important',
            marginTop: 0,
            marginBottom: 2
          }}
          paperOptions={{ elevation: 0 }}
          titleDelete={t('employee.delete_text_relative')}
          titlePage={t('employee.relatives')}
        />
        <NewEmployeeRelatives
          forceReRender={forceReRender}
          open={openModalCreate}
          close={handleCloseCreate}
          reload={refetch}
          dataDetail={dataDetail}
        />
      </Box>
    </PageTable>
  )
}

export default EmployeeRelatives
