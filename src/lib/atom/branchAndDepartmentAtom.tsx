import { atomWithStorage } from 'jotai/utils'

type BranchAndDepartMentInput = {
  value: string
  key: number
}

export type BranchAndDepartmentResponse = {
  branchs: BranchAndDepartMentInput[]
  departments: BranchAndDepartMentInput[]
}
const branchAndDepartment = atomWithStorage<BranchAndDepartmentResponse>('branch_departments', {
  branchs: [],
  departments: []
})

export { branchAndDepartment }
