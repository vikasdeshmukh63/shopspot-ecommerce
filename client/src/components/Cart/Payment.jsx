import "./payment.css";
import { CardNumberElement, CardCvcElement, CardExpiryElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Typography from '@mui/material/Typography';
import CheckoutSteps from "./CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import Metadata from "../Layout/Metadata";
import axios from "axios"
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EventIcon from '@mui/icons-material/Event';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useRef } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Payment = () => {

  // extracting orderInfo from session storage 
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  // extracting data from redux store 
  const { shippingInfo, cartItems } = useSelector(state => state.cart);
  const { me } = useSelector(state => state.user);

  // using useDispatch
  const dispatch = useDispatch();

  // using useNavigate
  const navigate = useNavigate();

  // using useStripe
  const stripe = useStripe();

  // using useElements
  const elements = useElements();

  const payBtn = useRef(null);

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  }

  // function to handle form submit 
  const submitHandler = async (e) => {
    // preventing auto reload of form 
    e.preventDefault();
    // disabling button after click 
    payBtn.current.disabled = true;

    try {
      // setting headers 
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      // making api request 
      const { data } = await axios.post("/api/v1/payment/process", paymentData, config);
      // storing client_secret in variable 
      const client_secret = data.client_secret;

      // if both strip and elements are not available then return from here 
      if (!stripe || !elements) {
        return
      }

      // payment operation 
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: me?.name,
            email: me?.email,
            address: {
              line1: shippingInfo?.address,
              city: shippingInfo?.city,
              state: shippingInfo?.state,
              postal_code: shippingInfo?.pinCode,
              country: shippingInfo?.country,
            }
          }
        }
      });

      // if there is error 
      if (result.error) {
        // enabling the button 
        payBtn.current.disabled = false;
        // showing error in notification 
        toast.error(result.error.message);
      } //if no error 
      else {
        if (result.paymentIntent.status === "succeeded") {
          navigate("/success");
        } else {
          toast.error("There's some issue while processing payment");
        }
      }
    } catch (error) {
      // if error then enabling button 
      payBtn.current.disabled = false;
      // showing error in notification 
      toast.error(error.response.data.message)
    }
  }

  return (
    <>
      <Metadata title="Payment - ShopSpot" />
      <CheckoutSteps activeStep={2} />
      <div className="paymentContainer">
        <form className="paymentForm" onSubmit={(e) => { submitHandler(e) }}>
          <Typography>Card Info</Typography>
          <div>
            <CreditCardIcon />
            <CardNumberElement className="paymentInput" />
          </div>
          <div>
            <EventIcon />
            <CardExpiryElement className="paymentInput" />
          </div>
          <div>
            <VpnKeyIcon />
            <CardCvcElement className="paymentInput" />
          </div>

          <input
            type="submit"
            value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
            ref={payBtn}
            className="paymentFormBtn"
          />
        </form>
      </div>
    </>
  )
}

export default Payment


//!Note - we can also use CardElement insted of the CardNumberElement then we dont need to use CardExpiryElement and CardCvcElement because they are already available in the CardElement