import { Link } from "react-router-dom";
import "./cartItemCard.css";
import PropTypes from "prop-types";

const CartItemCard = ({ item,deleteCartItem }) => {
  return (
    <div className="CartItemCard">
      <img src={item.image} alt={item.name} />
      <div>
        <Link to={`/product/${item.product}`}>{item.name}</Link>
        <span>{`Price:₹${item.price}`}</span>
        <p onClick={()=>{deleteCartItem(item.product)}}>Remove</p>
      </div>
    </div>
  );
};

CartItemCard.propTypes = {
  item: PropTypes.object,
  deleteCartItem:PropTypes.func
};

export default CartItemCard;
