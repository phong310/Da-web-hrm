import { Step, StepButton, Stepper } from '@mui/material'
import Box from '@mui/material/Box'

type StepperProps = {
  steps: Array<string>
  activeStep: number
  handleStep: (step: number) => void
  completed: { [k: number]: boolean }
}

export default function CompanyStepper({ steps, activeStep, handleStep, completed }: StepperProps) {
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} nonLinear>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit" onClick={() => handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
    </Box>
  )
}
