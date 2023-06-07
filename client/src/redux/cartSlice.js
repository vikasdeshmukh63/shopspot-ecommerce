// importing modules
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";

// creating status object and making it immutable using Object.freeze
export const CARTSTATUSES = Object.freeze({
  IDLE: "idle",
  LOADING: "loading",
  ERROR: "error",
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
    status: CARTSTATUSES.IDLE,
    shippingInfo: localStorage.getItem("shippingInfo") ? JSON.parse(localStorage.getItem("shippingInfo")) : {},
  },
  reducers: {
    // reducer to add item to cart
    addCartItem: (state, action) => {
      // item that we want to add in cart
      const item = action.payload;
      //   checking that is item is already exist in cart
      const isItemExist = state.cartItems.find((i) => {
        return i.product === item.product;
      });

      //if item exists then update quantity only
      if (isItemExist) {
        // the quantity shound update as we increase or decrease it
        const newQuantity = item.quantity;
        // the quantity should not exceed more than the stock of item
        isItemExist.quantity = Math.min(newQuantity, isItemExist.stock);
      }
      //if item not exist
      else {
        state.cartItems.push(item);
      }
    },
    //reducer to change the status
    setCartLoadingStatus: (state, action) => {
      state.status = action.payload;
    },
    // reducer to remove item from cart
    removeCartItem: (state, action) => {
      // item that we wanted to remove from cart
      const item = action.payload;
      // removing item from cart
      const filteredRemainingItems = state.cartItems.filter((i) => {
        return i.product !== item;
      });
      // finally saving the remaining item other than the item we want to delete
      state.cartItems = filteredRemainingItems;
    },
    // reducer to save shipping info
    setShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
    },
  },
});

// exporting actions
export const { addCartItem, setCartLoadingStatus, removeCartItem, setShippingInfo } = cartSlice.actions;

// exporting reducers
export default cartSlice.reducer;

//? creating thunk functions

//!add to cart
export function addItemsToCart(id, quantity) {
  return async function addItemsToCartThunk(dispatch, getState) {
    // changing status to loading
    dispatch(setCartLoadingStatus(CARTSTATUSES.LOADING));
    try {
      // receiving the data of the response from server
      const { data } = await axios.get(`/api/v1/product/${id}`);
      if (data.success === false) {
        // if operation fail then showing the error in notification
        toast.error(data.message);
        // changing status to error
        dispatch(setCartLoadingStatus(CARTSTATUSES.ERROR));
      } else {
        // adding item to cart using reducer
        dispatch(
          addCartItem({
            product: data.product._id,
            name: data.product.name,
            price: data.product.price,
            image: data.product.images[0].url,
            stock: data.product.stock,
            quantity,
          })
        );
        // setting up the cart items to localStorage so they appear even when we reload
        localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
        // changing status to idle
        dispatch(setCartLoadingStatus(CARTSTATUSES.IDLE));
      }
    } catch (error) {
      // if error then showing it in notification
      toast.error(error.message);
      // changing status to error
      dispatch(setCartLoadingStatus(CARTSTATUSES.ERROR));
    }
  };
}

//!remove item from cart
export function removeItemsFromCart(id) {
  return async function removeItemsFromCartThunk(dispatch, getState) {
    // changing status to loading
    dispatch(setCartLoadingStatus(CARTSTATUSES.LOADING));
    // removing item from cart
    dispatch(removeCartItem(id));
    // setting up the cart items to localStorage so they appear even when we reload
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
    // changing status to idle
    dispatch(setCartLoadingStatus(CARTSTATUSES.IDLE));
  };
}

//!save shipping info
export function saveShippingInfo(data) {
  return async function saveShippingInfoThunk(dispatch, getState) {
    // changing status to loading
    dispatch(setCartLoadingStatus(CARTSTATUSES.LOADING));
    // setting shipping info using reducer
    dispatch(setShippingInfo(data));
    // setting the shipping info to localStorage
    localStorage.setItem("shippingInfo", JSON.stringify(data));
    // changing status to idle
    dispatch(setCartLoadingStatus(CARTSTATUSES.IDLE));
  };
}
