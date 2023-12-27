// @ts-nocheck
import {
  Badge,
  Box,
  Button,
  IconButton,
  MenuItem,
  MenuList,
  Popover,
  Stack,
  styled,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material'
import { SxProps, Theme } from '@mui/system'
import { V1 } from 'constants/apiVersion'
import { markAllAsReadApi, markAsRead as markAsReadApi, markAsSeenApi } from 'lib/api/notification'
import { useAuth } from 'lib/hook/useAuth'
import { usePaginationQuery } from 'lib/hook/usePaginationQuery'
import {
  KEY_SCREEN,
  MODEL_TYPE,
  STATUS_NOTIFICATION,
  TYPE_NOTIFICATION
} from 'lib/types/applicationForm'
import { NotificationType } from 'lib/types/notification'
import { formatTimeDiff } from 'lib/utils/misc'
import { createContentNoti } from 'lib/utils/notification'
import React, { MouseEvent, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { InView } from 'react-intersection-observer'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { ModalDetailLeaveApplication } from 'screen/leaveForm/ModalDetailLeaveApplication'
import { ModalUpdateStatusLeave } from 'screen/leaveForm/ModalUpdateStatus'
import { ModalUpdateStatusOvertime } from 'screen/OverTime/ModalUpdateStatusOvertime'
import BellIcon from '../../../assets/svgs/navbar-icons/bell.svg'
import { ModalUpdateStatusRequestTime } from 'screen/RequestChangeTimesheet/ModalUpdateStatusRequestTime'
import { ModalDetailOverTimeApplication } from 'screen/OverTime/ModalDetailOverTimeApplication'
import ModalDetailRequestChangeTimesheetApplication from 'screen/RequestChangeTimesheet/ModalDetailRequestChangeTimesheetApplication'
import { ModalDetailCompensatoryApplication } from 'screen/compensatoryLeave/ModalDetailCompensatoryApplication'
import { ModalUpdateStatusCompenSatory } from 'screen/compensatoryLeave/ModalUpdateStatusCompenSatory'
type markAsReadType = {
  id: string | number
  model_id: number
  model_type: string
  type: number
  status: number
}

const Notification: React.VFC = () => {
  const [notiFilter, setNotiFilter] = useState<'all' | 'unread'>('all')
  const [anchorNoti, setAnchorNoti] = useState<null | HTMLElement>(null)
  const [isUnreadFilter, setIsUnreadFilter] = useState<boolean>(false)
  const [typeModal, setTypeModal] = useState<string>('')
  const [typeModalManager, setTypeModalManager] = useState<string>('')
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [idDetail, setIdDetail] = useState<number>(0)
  const [idUpdate, setIdUpdate] = useState<number>()
  const [openModalUpdate, setModalUpdate] = useState<boolean>(false)

  const open = Boolean(anchorNoti)
  const { user } = useAuth()
  const { t } = useTranslation()
  const {
    paginationData: { data: notifications },
    refetch: refetchNotification,
    handleChangeParams,
    isLoading: isLoadingNotification
  } = usePaginationQuery<NotificationType>(`${V1}/user/notifications`, { per_page: 20 })

  const { data: newCount, refetch: refecthNewCount } = useQuery(
    `${V1}/user/notifications/new-count`
  )

  const navigate = useNavigate()

  const handleRedirect = (model_id: number, model_type: string, type: number) => {
    if (type === TYPE_NOTIFICATION['CREATE'] || type === TYPE_NOTIFICATION['UPDATE']) {
      setIdUpdate(model_id)
      setTypeModalManager(model_type)
      setOpenModal(false)
      setModalUpdate(true)
    } else if (type === TYPE_NOTIFICATION['ACCEPT'] || type === TYPE_NOTIFICATION['REJECT']) {
      setIdDetail(model_id)
      setTypeModal(model_type)
      setOpenModal(true)
      setModalUpdate(false)
    }

    if (model_type === MODEL_TYPE['SALARY_SHEET']) {
      navigate(`/employees/salary-managerment/salaries/edit/${model_id}`)
    }
    if ((model_type === MODEL_TYPE['SALARY_SHEET'], type === TYPE_NOTIFICATION['PUBLIC'])) {
      navigate(`/salary/list`)
    }

    if ((model_type === MODEL_TYPE['EXTEND_CONTRACT'], type === TYPE_NOTIFICATION['EXTEND'])) {
      navigate(`/individual-contract/list`)
    }
  }

  const closeModal = () => {
    setModalUpdate(false)
    setOpenModal(false)
  }
  const renderModal = (form: string, idDetail: number, openModal: boolean) => {
    if (typeModal === undefined) {
      return null // Hoặc xử lý khác khi typeModal là undefined
    }
    switch (form) {
      case MODEL_TYPE['LEAVE']:
        return (
          <ModalDetailLeaveApplication
            key={idDetail}
            open={openModal}
            closeModalDetail={closeModal}
            idDetail={idDetail}
          />
        )
      case MODEL_TYPE['OVERTIME']:
        return (
          <ModalDetailOverTimeApplication
            open={openModal}
            idDetail={idDetail}
            closeModalDetail={closeModal}
          />
        )
      case MODEL_TYPE['REQUEST_CHANGE_TIMESHEET']:
        return (
          <ModalDetailRequestChangeTimesheetApplication
            open={openModal}
            idDetail={idDetail}
            handleClose={closeModal}
          />
        )
      case MODEL_TYPE['COMPENSATORY_LEAVE']:
        return (
          <ModalDetailCompensatoryApplication
            open={openModal}
            idDetail={idDetail}
            closeModalDetail={closeModal}
          />
        )
      default:
        return null
    }
  }

  const onSuccess = () => {
    closeModal()
    switch (typeModalManager) {
      case MODEL_TYPE['LEAVE']: {
        navigate('/applications/manager/leave-form', {
          state: { tabIndex: KEY_SCREEN.PROCESSED }
        })
        break
      }
      case MODEL_TYPE['OVERTIME']: {
        navigate('/applications/manager/overtimes', {
          state: { tabIndex: KEY_SCREEN.PROCESSED }
        })
        break
      }
      case MODEL_TYPE['REQUEST_CHANGE_TIMESHEET']: {
        navigate('/applications/manager/request-change-timesheets', {
          state: { tabIndex: KEY_SCREEN.PROCESSED }
        })
        break
      }
      case MODEL_TYPE['COMPENSATORY_LEAVE']: {
        navigate('/applications/manager/compensatory-leaves', {
          state: { tabIndex: KEY_SCREEN.PROCESSED }
        })
        break
      }

      // case MODEL_TYPE['SALARY_SHEET']: {
      //   navigate('/salary-managerment/salaries', {
      //     state: { tabIndex: KEY_SCREEN.PROCESSED }
      //   })
      //   break
      // }
      default:
        return null
    }
  }

  const renderModalUpdate = (
    form: string,
    idUpdate: number | undefined,
    openModalUpdate: boolean
  ) => {
    if (typeModalManager === undefined) {
      return null
    }
    switch (form) {
      case MODEL_TYPE['LEAVE']:
        return (
          <ModalUpdateStatusLeave
            closeModalEdit={closeModal}
            open={openModalUpdate}
            idEdit={idUpdate}
            onSuccess={onSuccess}
          />
        )
      case MODEL_TYPE['OVERTIME']:
        return (
          <ModalUpdateStatusOvertime
            closeModalEdit={closeModal}
            open={openModalUpdate}
            idEdit={idUpdate}
            onSuccess={onSuccess}
          />
        )
      case MODEL_TYPE['REQUEST_CHANGE_TIMESHEET']:
        return (
          <ModalUpdateStatusRequestTime
            open={openModalUpdate}
            idEdit={idUpdate}
            handleCloseModal={closeModal}
            onSuccessEdit={onSuccess}
          />
        )
      case MODEL_TYPE['COMPENSATORY_LEAVE']:
        return (
          <ModalUpdateStatusCompenSatory
            closeModalEdit={closeModal}
            open={openModalUpdate}
            idEdit={idUpdate}
            handleEditSuccess={onSuccess}
          />
        )
      default:
        return null
    }
  }

  const markAsRead = async ({ id, model_id, model_type, type, status }: markAsReadType) => {
    if (status === STATUS_NOTIFICATION['UNREAD'] || status === STATUS_NOTIFICATION['NEW']) {
      await markAsReadApi(id)
      refetchNotification()
    }
    handleClose()

    handleRedirect(model_id, model_type, type)
  }

  const maskAllAsRead = async () => {
    await markAllAsReadApi()
    refetchNotification()
    // handleClose()
  }

  // const { subcribeEvent } = usePusher()

  // const handleCallBack = async () => {
  //   refetchNotification()
  //   refecthNewCount()
  // }

  // if (user) {
  //   subcribeEvent(user.noti_channel, 'new-message', handleCallBack)
  // }

  const handleOpenNoti = async (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorNoti(event.currentTarget)
    if (newCount !== 0) {
      await markAsSeenApi()
      refecthNewCount()
    }
  }

  const handleClose = () => {
    setAnchorNoti(null)
  }

  const handleChangeFilter = (event: MouseEvent<HTMLElement>, filter: 'all' | 'unread') => {
    if (filter === 'all') {
      setNotiFilter(filter)
      setIsUnreadFilter(false)
      handleChangeParams({ filter: filter })
    } else if (filter === 'unread') {
      setNotiFilter(filter)
      setIsUnreadFilter(true)
      handleChangeParams({ filter: filter })
    }
  }

  const [notiCount, setNotiCount] = useState<number>(0)
  const [isAvaiableRefetch, setIsAvaiableRefetch] = useState<boolean>(false)

  useEffect(() => {
    if (notiCount !== notifications.length) {
      setNotiCount(notifications.length)
      setIsAvaiableRefetch(true)
    } else {
      setIsAvaiableRefetch(false)
    }
  }, [notifications])

  const _handleChangeParams = () => {
    if (notifications.length < 50 && isAvaiableRefetch) {
      handleChangeParams({ per_page: notifications.length + 10, filter: notiFilter })
      refetchNotification()
    }
  }

  const NotificationItem = useCallback(({ noti }: { noti: NotificationType }) => {
    return (
      <MenuItem
        sx={
          {
            background:
              (noti.status === STATUS_NOTIFICATION['UNREAD'] ||
                noti.status === STATUS_NOTIFICATION['NEW']) &&
              '#F1F8FF',
            ...styleMenuItems
          } as SxProps
        }
        onClick={() => markAsRead(noti)}
      >
        <Stack spacing={1}>
          <Title variant="body1">
            {/* {noti.content as string} */}
            <span style={{ ...styleStackModelType }}>{noti?.full_name_sender}</span>
            <span
              style={{
                ...styleCreateContentNoti
              }}
            >
              {createContentNoti(noti.model_type, noti.type)}
            </span>
          </Title>
          <Typography sx={{ ...styleFormatTimeDiff }} variant="body2">
            {formatTimeDiff(noti.created_at)}
          </Typography>
        </Stack>
        {/* {noti.status === STATUS_NOTIFICATION['UNREAD'] ||
        noti.status === STATUS_NOTIFICATION['NEW'] ? (
          <Badge color="primary" variant="dot" sx={{ ...styleBadge }} />
        ) : null} */}
      </MenuItem>
    )
  }, [])
  return (
    <>
      <IconButton onClick={handleOpenNoti}>
        <Badge badgeContent={newCount as number} color="error">
            <img src={BellIcon} />
        </Badge>
      </IconButton>

      <Box sx={{ ...styleBoxPopover }}>
        <Popover
          anchorEl={anchorNoti}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          sx={{ mt: '10px' }}
          PaperProps={{
            style: {
              ...stylePopover
            }
          }}
        >
          <Stack
            spacing={0.5}
            height="51.75vh"
            sx={{
              ...styleStack
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{
                ...styleStackItem
              }}
            >
              <Typography
                sx={{
                  ...styleNotificationTitle
                }}
              >
                {t('notification.title')}
              </Typography>

              <ToggleButtonGroup
                value={notiFilter}
                exclusive
                size="small"
                onChange={handleChangeFilter}
                color="primary"
                sx={{
                  ...styleToggleButtonGroup
                }}
                aria-label="Platform"
              >
                <ToggleButton
                  value="all"
                  sx={{
                    ...styleToggleButton
                  }}
                >
                  <Typography
                    sx={{
                      ...styleToggleButtonTypography
                    }}
                  >
                    {t('notification.read_all')}
                  </Typography>
                </ToggleButton>

                <ToggleButton
                  value="unread"
                  sx={{
                    ...styleToggleButton
                  }}
                >
                  <Typography
                    sx={{
                      ...styleToggleButtonTypography
                    }}
                  >
                    {t('notification.unread')}
                  </Typography>
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
            <Box
              sx={{
                ...styleBoxNotifications
              }}
            >
              {notifications.length ? (
                <CustomMenuList dense>
                  {notifications?.map((noti, index) =>
                    notifications.length - 1 === index ? (
                      <InView
                        key={noti.id}
                        onChange={(inView) => {
                          if (inView && !isLoadingNotification) {
                            _handleChangeParams()
                          }
                        }}
                      >
                        <NotificationItem noti={noti} key={noti.id} />
                      </InView>
                    ) : (
                      <NotificationItem noti={noti} key={noti.id} />
                    )
                  )}
                </CustomMenuList>
              ) : (
                <Typography
                  sx={{
                    ...styleMessageNo
                  }}
                >
                  {t('notification.message_no')}
                </Typography>
              )}
            </Box>
            {/* <Divider /> */}
          </Stack>
          <Button
            sx={{
              ...styleButtonMaskAll
            }}
            onClick={maskAllAsRead}
          >
            {t('notification.mark_all')}
          </Button>
        </Popover>
      </Box>
      {openModal && renderModal(typeModal, idDetail, openModal)}
      {openModalUpdate && renderModalUpdate(typeModalManager, idUpdate, openModalUpdate)}
    </>
  )
}

const styleBoxNotifications = {
  overflowY: 'auto'
}

const styleStackModelType = {
  fontSize: '14px',
  fontWeight: '600',
  lineHeight: '20px',
  color: '#111111'
}

const styleMenuItems = {
  minHeight: (theme: Theme) => theme.spacing(10),
  justifyContent: 'space-between',
  whiteSpace: 'normal',
  padding: '16px'
}

const styleToggleButtonGroup = {
  width: '200px',
  backgroundColor: '#f0f0f0',
  borderRadius: '8px',
  height: '42px',
  padding: '1px',

  '& .MuiToggleButtonGroup-grouped': {
    margin: 0.5,
    border: 0,

    '&.Mui-disabled': {
      border: 0
    },
    '&:not(:first-of-type)': {
      borderRadius: '8px'
    },
    '&:first-of-type': {
      borderRadius: '8px'
    },
    '&.Mui-selected': {
      backgroundColor: '#fff'
    }
  }
}

const styleBoxPopover = {
  borderRadius: '20px'
}

const stylePopover = {
  borderRadius: '12px',
  width: '400px'
}

const styleToggleButton = {
  fontSize: '14px',
  fontWeight: '600',
  textTransform: 'capitalize',
  borderRadius: '6px',
  width: '92px'
}

const styleToggleButtonTypography = {
  fontSize: '14px',
  fontWeight: '700',
  textTransform: 'capitalize'
}

const styleStackItem = {
  backgroundColor: '#146BD2',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '14px 16px  14px 16px',
  color: '#fff',
  width: "'400px"
}

const styleStack = {
  position: 'relative',
  width: {
    xs: '93vw',
    md: '400px'
  },
  maxWidth: '400px'
}

const styleButtonMaskAll = {
  py: 0.4,
  width: '100%',
  justifyContent: 'start',
  '&:hover': {
    backgroundColor: '#EEE'
  },
  borderRadius: 'unset',
  textTransform: 'uppercase',
  color: '#146BD2',
  fontWeight: 600,
  fontStyle: 'normal',
  padding: '10px 18px 10px 18px',
  fontSize: '14px',
  borderTop: '1px solid #C8CCD3'
}

const styleMessageNo = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  fontWeight: '700'
}

export const Title = styled(Typography)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: '2',
  WebkitBoxOrient: 'vertical'
  // fontWeight: '600'
})

const CustomMenuList = styled(MenuList)({
  padding: 0,
  '& li:hover': {
    backgroundColor: '#F1F8FF'
  },
  '& .MuiMenuList-padding': {
    padding: 0
  }
})

const styleNotificationTitle = {
  fontSize: '20px',
  fontStyle: 'normal',
  fontWeight: 600,
  lineHeight: '28px',
  color: '#fff',
  fontFamily: 'Lato'
}

const styleCreateContentNoti = {
  fontSize: '14px',
  lineHeight: '20px',
  fontStyle: 'normal',
  fontWeight: 400,
  color: '#111111'
}

const styleFormatTimeDiff = {
  fontSize: '14px',
  color: '#878C95'
}

export { Notification }

