// importing modules 
import "./productDetails.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getProductDetails } from "../../redux/productSlice";
import { useParams } from 'react-router-dom';
import Loader from "../Loader";
import ReactStars from "react-rating-stars-component";
import "./productDetails.css";
import ReviewCard from "./ReviewCard";
import { STATUSES } from "../../redux/productSlice";
import Carousel from "../Carousel/Carousel";
import Metadata from "../Layout/Metadata";
import { toast } from "react-hot-toast";
import { addItemsToCart } from "../../redux/cartSlice";



const ProductDetails = () => {

  // using useDispatch
  const dispatch = useDispatch();

  // extracting data from redux store
  const { productDetails, status } = useSelector(state => state.product);

  // using useParams 
  const params = useParams();

  // quantity state 
  const [quantity, setQuantity] = useState(1);

  // function to increase quantity
  const increaseQuantity = () => {

    // the quantity should not increase more than the stock 
    if (productDetails?.stock <= quantity) {
      toast.error("Quantity exceeds the stock");
      return
    }
    // to increase the quantity
    setQuantity(quantity + 1)
  }

  //  function to decrease quantity
  const decreaseQuantity = () => {
    // the quantity should not be less than zero 
    if (quantity <= 1) {
      toast.error("Quantity cannot be zero");
      return
    }
    // to decrease the quantity
    setQuantity(quantity - 1)
  }

  // function to add to cart items 
  const addToCartHandler = ()=>{
    // adding items to cart 
    dispatch(addItemsToCart(params.id,quantity));
    // showing notification that item added 
    toast.success("Item added to cart");
  }

  useEffect(() => {
    dispatch(getProductDetails(params.id));
  }, [dispatch, params.id]);


  // properties for react stars 
  const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "tomato",
    value: productDetails.ratings,
    isHalf: true,
    size: window.innerWidth < 600 ? 20 : 25
  }



  return (
    <>
      {
        status === STATUSES.LOADING ? (<Loader />) : (<>
          <Metadata title={`ShopSpot - ${productDetails.name}`} />
          <div className="productDetails">
            <div>
              {productDetails.images && <Carousel slides={productDetails.images} />}
            </div>

            <div>
              <div className="detailsBlock-1">
                <h2>{productDetails.name}</h2>
                <p>Product # {productDetails._id}</p>
              </div>

              <div className="detailsBlock-2">
                <ReactStars {...options} />
                <span>{`(${productDetails.noOfReviews} Reviews)`}</span>
              </div>

              <div className="detailsBlock-3">
                <h1>{`₹${productDetails.price}`}</h1>

                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <input type="number" value={quantity} readOnly />
                    <button onClick={increaseQuantity}>+</button>
                  </div>
                  <button onClick={addToCartHandler}>Add to Cart</button>
                </div>

                <p>
                  Status:
                  <b className={productDetails.stock < 1 ? "redColor" : "greenColor"}>
                    {productDetails.stock < 1 ? "Out of Stock" : "In Stock"}
                  </b>
                </p>
              </div>

              <div className="detailsBlock-4">
                Description : <p>{productDetails.description}</p>
              </div>

              <button className="submitReview">Submit Review</button>
            </div>
          </div>

          <h3 className="reviewsHeading">REVIEWS</h3>

          {productDetails.reviews && productDetails.reviews[0] ? (
            <div className="reviews">
              {
                productDetails.reviews && productDetails.reviews.map((item, index) => {
                  return <ReviewCard key={index} review={item} />
                })
              }
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
        </>)
      }
    </>
  )
}

export default ProductDetails
