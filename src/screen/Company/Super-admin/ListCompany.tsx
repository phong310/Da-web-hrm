import ReactTableWithToolBar from 'components/ReactTable/ReactTableWithToolBar/ReactTableWithToolBar'
import { V1 } from 'constants/apiVersion'
import { useApiResource, useAuth } from 'lib/hook'
import { CompanyData } from 'lib/types/companyGroup'
import { TYPE_OF_STATUS } from 'lib/utils/contants'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { Row } from 'react-table'
const ListCompany: React.VFC = () => {
  const { deleteApi } = useApiResource<CompanyData>(`1.0/admin/companies`)
  const navigate = useNavigate()
  const { setCompany } = useAuth()
  const { t } = useTranslation()

  const onCreate = () => {
    navigate('/companies/create')
  }

  const onEdit = ({ original }: Row<CompanyData>) => {
    // console.log('original', original)
    navigate('/companies/edit/' + original.id)
  }

//   const onRowClick = ({ original }: Row<CompanyData>) => {
//     console.log('original', original)
//     setCompany(original)
//     navigate('/' + original.id + '/')
//   }

  const listFields = [
    {
      Header: t('companies.name'),
      accessor: 'name',
      style: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: 300
      },
      display: true
    },
    {
      Header: t('companies.representative'),
      accessor: 'representative',
      style: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: 150
      },
      display: true
    },
    {
      Header: t('companies.phone_number'),
      accessor: 'phone_number',
      display: true
    },
    {
      Header: t('companies.address'),
      accessor: 'address',
      style: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: 150
      },
      display: true
    },
    {
      Header: t('companies.tax_code'),
      accessor: 'tax_code',
      style: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: 150
      },
      display: true
    },
    {
      Header: t('companies.status'),
      accessor: 'status',
      Cell: ({ value }: { value: number }) =>
        TYPE_OF_STATUS.find((item) => item.value === value)?.label,
      display: true
    }
  ]
  const quickSearchField = {
    Header: t('companies.name'),
    accessor: 'name_like'
  }

  return (
    <ReactTableWithToolBar
      endpoint={`${V1}/admin/companies`}
      columns={listFields}
      quickSearchField={quickSearchField}
      onRowClick={onEdit}
      onActionEdit={onEdit}
      deleteApi={deleteApi}
      onActionCreate={onCreate}
      data={[]}
      title={t('companies.list')}
      titleDelete="Bạn có chắc muốn xóa công ty này ?"
      defaultActionDelete
    />
  )
}

export { ListCompany }
