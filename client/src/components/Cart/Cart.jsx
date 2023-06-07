// importing modules 
import { toast } from "react-hot-toast";
import { addItemsToCart, removeItemsFromCart } from "../../redux/cartSlice";
import "./cart.css";
import CartItemCard from "./CartItemCard"
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import Metadata from "../Layout/Metadata";


const Cart = () => {

  // using useDispatch
  const dispatch = useDispatch();

  // using useNavigate 
  const navigate = useNavigate();

  // extracting data from redux store 
  const { cartItems } = useSelector(state => state.cart);

  // function to increase quantity of items in cart 
  const increaseQuantity = (id, quantity, stock) => {
    // variable to store new quantity
    const newQty = quantity + 1;
    // to make sure quantity does not exceeds more than stock 
    if (stock <= quantity) {
      toast.error("Quantity exceeds the stock");
      return
    }
    // finally sending newQty and productId to make changes to redux store
    dispatch(addItemsToCart(id, newQty))
  }

  // function to decrease quantity of items in cart 
  const decreaseQuantity = (id, quantity) => {
    // variable to store new quantity
    const newQty = quantity - 1;
    // to make sure quantity does not exceeds more than stock 
    if (quantity <= 1) {
      toast.error("Quantity cannot be zero");
      return
    }
    // finally sending newQty and productId to make changes to redux store
    dispatch(addItemsToCart(id, newQty))
  }

  // function for deleting cartItems 
  const deleteCartItem = (id) => {
    dispatch(removeItemsFromCart(id));
  }

  // function for checkout 
  const checkOutHandler = () => {
    navigate("/login?redirect=shipping")
  }

  return (
    <>
      <Metadata title={"Cart - ShopSpot"} />
      {cartItems.length === 0 ? (
        <div className="emptyCart">
          <RemoveShoppingCartIcon />
          <Typography>No Product In your Cart</Typography>
          <Link to="/products">View Product</Link>
        </div>) : (<>
          <div className="cartPage">
            <div className="cartHeader">
              <p>Product</p>
              <p>Quantity</p>
              <p>SubTotal</p>
            </div>

            {cartItems && cartItems.map((item, index) => {
              return <div key={index} className="cartContainer">
                <CartItemCard item={item} deleteCartItem={deleteCartItem} />
                <div className="cartInput">
                  <button onClick={() => { decreaseQuantity(item.product, item.quantity) }}>-</button>
                  <input type="number" readOnly value={item.quantity} />
                  <button onClick={() => { increaseQuantity(item.product, item.quantity, item.stock) }}>+</button>
                </div>
                <p className="cartSubtotal">
                  {`₹${item.price * item.quantity}`}
                </p>
              </div>
            })}

            <div className="cartGrossTotal">
              <div></div>
              <div className="cartGrossTotalBox">
                <p>Gross Total</p>
                <p>{`₹${cartItems.reduce((accumulator, item) => {
                  return accumulator + item.quantity * item.price;
                }, 0)}`}</p>
              </div>
              <div></div>
              <div className="checkOutButton">
                <button onClick={checkOutHandler}>Check Out</button>
              </div>
            </div>
          </div>
        </>)}
    </>
  )
}

export default Cart
