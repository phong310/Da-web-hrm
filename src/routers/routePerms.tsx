// import { CompanyEdit, CompanyForm, ListCompany } from 'screen/companies'
import { CompanyInfo } from 'screen/Company/CompanyInfo'
import { ListCompany } from 'screen/Company/Super-admin/ListCompany'

export const routerSuperAdmin = [
  //COMPANY
  {
    path: '/companies',
    protected: true,
    element: <ListCompany />,
    permissions: ['companies.list']
  },
  {
    path: '/companies/edit/:id',
    protected: true,
    // @ts-ignore
    element: <CompanyInfo />,
    permissions: ['companies.update']
  }
]
