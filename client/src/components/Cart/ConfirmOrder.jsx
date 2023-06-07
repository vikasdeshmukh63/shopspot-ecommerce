// importing modules 
import "./confirmOrder.css"
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Metadata from "../Layout/Metadata";
import CheckoutSteps from "../Cart/CheckoutSteps";

const ConfirmOrder = () => {

  // extracting data from redux store 
  const { shippingInfo, cartItems } = useSelector(state => state.cart);
  const { me } = useSelector(state => state.user);

  return (
    <>
    <Metadata title="Confirm Order - ShopSpot"/>
      <CheckoutSteps activeStep={1} />
      <div className="confirmOrderPage">
        
      </div>
    </>
  )
}

export default ConfirmOrder
