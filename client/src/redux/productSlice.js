// importing moudules
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";

// creating status object and making it immutable using Object.freeze
export const STATUSES = Object.freeze({
  IDLE: "idle",
  LOADING: "loading",
  ERROR: "error",
});

// creating product slice
const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [], // for the list of all product we are getting from the server
    productDetails: {}, // for storing the single product
    status: STATUSES.IDLE, // for showing the loader
    productCount: 0, // for keeping record of the total products
    resultPerPage: 0, //for keeping record of the total products on page
  },
  reducers: {
    // reducer to add product data
    addProducts: (state, action) => {
      state.products = [...action.payload];
    },
    // reducer to set current Status
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    // reducer to set product count
    setProductCount: (state, action) => {
      state.productCount = action.payload;
    },
    // reducer to set result per page
    setResultPerPage: (state, action) => {
      state.resultPerPage = action.payload;
    },
    // reducer to set individual product details
    addProductDetails: (state, action) => {
      state.productDetails = action.payload;
    },
  },
});

// exporting actions
export const { addProducts, setStatus, setProductCount, addProductDetails, setResultPerPage } = productSlice.actions;
// exporting reducers
export default productSlice.reducer;

//? creating thunk functions for API request
//!get all products
export function getProducts(keyword = "", currentPage = 1, price = [0, 25000], category,ratings=0) {

  return async function getProductsThunk(dispatch) {
    // changing status to loading
    dispatch(setStatus(STATUSES.LOADING));
    try {
      // link to make an api call
      let link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${[price[0]]}&price[lte]=${price[1]}&ratings=${ratings}`;

      // if category exist then link will be as follows 
      if (category) {

        console.log(category)
        link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${[price[0]]}&price[lte]=${price[1]}&category=${category}&ratings=${ratings}`;
      }

      // extracting data from the received data
      const { data } = await axios.get(link);
      // if error from server then showing it in notification
      if (data.success === false) {
        toast.error(data.message);
      }
      // setting products data
      dispatch(addProducts(data.products));
      // setting product count
      dispatch(setProductCount(data.productCount));
      // setting results per page value
      dispatch(setResultPerPage(data.resultPerPage));
      // changing status to idle
      dispatch(setStatus(STATUSES.IDLE));
    } catch (error) {
      // if error then showing it in notification
      toast.error(error.message);
      // changing status to error
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}

//!get a product details
export function getProductDetails(id) {
  return async function getProductDetailsThunk(dispatch) {
    // changing status to loading
    dispatch(setStatus(STATUSES.LOADING));
    try {
      // setting the received data to data variable
      const { data } = await axios.get(`/api/v1/product/${id}`);
      // if error from server then showing it in notification
      if (data.success === false) {
        toast.error(data.message);
      }
      // setting individual product data
      dispatch(addProductDetails(data.product));
      // changing status to idle
      dispatch(setStatus(STATUSES.IDLE));
    } catch (error) {
      // if error then showing it in notification
      toast.error(error.message);
      // changing status to error
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}
