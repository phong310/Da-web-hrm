import { Container } from '@mui/material'
import CompanyStepper from './CompanyStepper'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { CompanyInfo } from './CompanyInfo'
import { Page } from 'components/Layouts/Page/Page'
import { CompanyDepartmentAndBranch } from './CompanyDepartmentAndBranch'
import { CompanyPositionAndTitles } from './CompanyPositionAndTitles'
import { CompanySetting } from './CompanySetting'
import { CompanyAccount } from './CompanyAccount'

export const STEP = {
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4
}

export enum STATUS_STEP {
  INCOMPLETE = 'INCOMPLETE',
  FINISH = 'FINISH',
  UPDATE = 'UPDATE'
}

export const CompanyForm = () => {
  const [activeStep, setActiveStep] = useState<number>(STEP[1])
  const [companyId, setCompanyId] = useState<number>()
  const [statusStep, setStatusStep] = useState<string>('')
  const { t } = useTranslation()
  const [completed, setCompleted] = useState<{
    [k: number]: boolean
  }>({})

  const steps = [
    t('companies.steps.information'),
    t('companies.steps.branch_department'),
    t('companies.steps.position_titles'),
    t('companies.steps.settings'),
    t('companies.steps.account_info')
  ]

  const totalSteps = () => {
    return steps.length
  }

  const completedSteps = () => {
    return Object.keys(completed).length
  }

  const isLastStep = () => {
    return activeStep === totalSteps() - 1
  }

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps()
  }
  const handleStep = (step: number) => {
    setActiveStep(step)
  }
  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1
    setActiveStep(newActiveStep)
  }

  const handleComplete = (activeStep: number) => {
    const newCompleted = completed
    newCompleted[activeStep] = true
    setCompleted(newCompleted)
    handleNext()
  }

  return (
    <Container>
      <Page elevation={0} title="TẠO MỚI CÔNG TY">
        <CompanyStepper
          steps={steps}
          activeStep={activeStep}
          handleStep={handleStep}
          completed={completed}
        />

        {activeStep === STEP[1] ? (
          <CompanyInfo
            companyId={companyId}
            setCompanyId={setCompanyId}
            handleComplete={handleComplete}
            statusStep={statusStep}
          />
        ) : null}

        {activeStep === STEP[2] ? (
          <CompanyDepartmentAndBranch
            companyId={companyId}
            handleComplete={handleComplete}
            statusStep={statusStep}
          />
        ) : null}

        {activeStep === STEP[3] ? (
          <CompanyPositionAndTitles
            companyId={companyId}
            handleComplete={handleComplete}
            statusStep={statusStep}
          />
        ) : null}

        {activeStep === STEP[4] ? (
          <CompanySetting
            companyId={companyId}
            handleComplete={handleComplete}
            statusStep={statusStep}
          />
        ) : null}

        {activeStep === STEP[5] ? (
          <CompanyAccount
            companyId={companyId}
            handleComplete={handleComplete}
            statusStep={statusStep}
          />
        ) : null}

      </Page>
    </Container>
  )
}
