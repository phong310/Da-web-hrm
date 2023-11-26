import { Checkbox } from '@mui/material'
import { CellProps, HeaderProps, Hooks, usePagination, useRowSelect, useSortBy } from 'react-table'
import TableAction from './Components/TableAction'


export type ActionColumnConfig = {
  editText?: string
  deleteText?: string
  needConfirm?: boolean
  deleteConfirmText?: string
}

function selectionHook<T extends object>(enabled: boolean) {
  return (hooks: Hooks<T>) => {
    if (!enabled) return
    hooks.allColumns.push((columns) => [
      {
        id: '_selector',
        Header: ({ getToggleAllRowsSelectedProps }: HeaderProps<T>) => (
          <Checkbox
            onClick={(e) => e.stopPropagation()}
            indeterminate
            {...getToggleAllRowsSelectedProps()}
          />
        ),
        Cell: ({ row }: CellProps<T>) => (
          <Checkbox
            onClick={(e) => e.stopPropagation()}
            indeterminate
            {...row.getToggleRowSelectedProps()}
          />
        )
      },
      ...columns
    ])
  }
}

export type ActionHookArgs<T extends object> = {
  actionConfig?: ActionColumnConfig
  onActionEdit?(props: CellProps<T>): void
  onActionDelete?(props: CellProps<T>): void
  defaultActionEdit?: boolean
}

function actionHook<T extends object>({
  actionConfig,
  onActionDelete,
  onActionEdit,
  defaultActionEdit
}: ActionHookArgs<T>) {
  return (hooks: Hooks<T>) => {
    if (!(onActionDelete || onActionEdit || defaultActionEdit)) return
    hooks.allColumns.push((columns) => [
      ...columns,
      {
        id: '__action',
        Cell: (props: CellProps<T>) => {
          return (
            <TableAction<T>
              actionConfig={actionConfig}
              onActionEdit={onActionEdit}
              onActionDelete={onActionDelete}
              defaultActionEdit={defaultActionEdit}
              {...props}
            />
          )
        }
      }
    ])
  }
}

const hooks = [useSortBy, usePagination, useRowSelect]

export { hooks, selectionHook, actionHook }
