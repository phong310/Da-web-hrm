import { BankAccount } from "./bankAccount"
import { BaseMaster } from "./baseMaster"
import { PersonalInformation } from "./personalInformation"
import { UserType } from "./user"


export type Employee = {
    id: number
    card_number: string
    employee_code: string
    official_employee_date: string
    personal_information_id: number
    date_start_work: string
    position_id: number
    department_id: number
    branch_id: number
    status: string
    position: BaseMaster
    department: BaseMaster
    branch: BaseMaster
    bank_account: BankAccount
    information: PersonalInformation
    user: UserType
    employee_id: number
    admin_user?: UserType
    setting_id: number
}

export type SalariesEmployee = {
    id: number
    salary_sheet_id: number
}
