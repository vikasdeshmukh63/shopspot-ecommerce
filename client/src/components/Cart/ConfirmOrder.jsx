// importing modules 
import "./confirmOrder.css"
import Typography from '@mui/material/Typography';
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Metadata from "../Layout/Metadata";
import CheckoutSteps from "../Cart/CheckoutSteps";

const ConfirmOrder = () => {

  // extracting data from redux store 
  const { shippingInfo, cartItems } = useSelector(state => state.cart);
  const { me } = useSelector(state => state.user);

  // using useNavigate 
  const navigate = useNavigate();

  // subtotal
  const subTotal = cartItems.reduce((accumulator, item) => {
    return accumulator + item.quantity * item.price;
  }, 0);

  // shippingCharges
  const shippingCharges = subTotal > 1000 ? 0 : 100;

  // tax 18%
  const tax =Math.round(subTotal * 0.18);

  // total price 
  const totalPrice = subTotal + shippingCharges + tax;

  // address 
  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`

  // function for proceed to payment 
  const proceedToPayment = () => {
    const data = {
      subTotal,
      shippingCharges,
      tax,
      totalPrice
    }

    // saving data in session storage 
    sessionStorage.setItem("orderInfo", JSON.stringify(data));

    // navigating to next page 
    navigate("/process/payment");
  }

  return (
    <>
      <Metadata title="Confirm Order - ShopSpot" />
      <CheckoutSteps activeStep={1} />
      <div className="confirmOrderPage">
        <div>
          {/* confirm shipping area */}
          <div className="confirmShippingArea">
            <Typography>Shipping Info</Typography>
            <div className="confirmShippingAreaBox">
              <div>
                <p>Name:</p>
                <span>{me.name}</span>
              </div>
              <div>
                <p>Phone:</p>
                <span>{shippingInfo.phoneNo}</span>
              </div>
              <div>
                <p>Address:</p>
                <span>{address}</span>
              </div>
            </div>
          </div>
          {/* confirm cart items */}
          <div className="confirmCartItems">
            <Typography>Your Cart Items:</Typography>
            <div className="confirmCartItemsContainer">
              {
                cartItems.map((item) => {
                  return <div key={item.product}>
                    <img src={item.image} alt="product" />
                    <Link to={`/product/${item.product}`}>
                      {item.name}
                    </Link>
                    <span>
                      {item.quantity} X ₹{item.price} =
                      <b>₹{item.price * item.quantity}</b>
                    </span>
                  </div>
                })
              }
            </div>
          </div>
        </div>

        <div>
          {/* order summery */}
          <div className="orderSummery">
            <Typography>Order Summery</Typography>
            <div>
              <div>
                <p>Subtotal:</p>
                <span>₹{subTotal}</span>
              </div>
              <div>
                <p>Shipping Charges:</p>
                <span>₹{shippingCharges}</span>
              </div>
              <div>
                <p>GST:</p>
                <span>₹{tax}</span>
              </div>
            </div>
            {/* order summery total */}
            <div className="orderSummeryTotal">
              <p>
                <b>Total:</b>
              </p>
              <span>₹{totalPrice}</span>
            </div>

            <button onClick={proceedToPayment}>Proceed to Payment</button>

          </div>
        </div>
      </div>
    </>
  )
}

export default ConfirmOrder
