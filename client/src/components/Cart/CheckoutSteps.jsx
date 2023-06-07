// importing modules 
import Typography from '@mui/material/Typography';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Step, StepLabel, Stepper } from '@mui/material';
import PropTypes from 'prop-types';
import "./checkoutSteps.css";

const CheckoutSteps = ({ activeStep }) => {

  const steps = [
    {
      label: <Typography>Shipping Details</Typography>,
      icon: <LocalShippingIcon />,
    },
    {
      label: <Typography>Confirm Order</Typography>,
      icon: <LibraryAddCheckIcon />
    },
    {
      label: <Typography>Payment</Typography>,
      icon: <AccountBalanceIcon />
    }
  ]

  const stepStyles = {
    boxSizing: "border-box",
    marginTop: "50px"
  }

  return (
    <>
      <Stepper alternativeLabel activeStep={activeStep} style={stepStyles}>
        {steps.map((item, index) => {
          return <Step
            key={index}
            active={activeStep === index ? true : false}
            completed={activeStep >= index ? true : false}
          >
            <StepLabel
              icon={item.icon}
              style={{ color: activeStep >= index ? "tomato" : "rgba(0,0,0,0.649)" }}
            >
              {item.label}
            </StepLabel>
          </Step>
        })}
      </Stepper>
    </>
  )
}


CheckoutSteps.propTypes = {
  activeStep: PropTypes.number
};


export default CheckoutSteps
