// importing moudles
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";

// creating status object and making it immutable using Object.freeze
export const USERSTATUSES = Object.freeze({
  IDLE: "idle",
  LOADING: "loading",
  ERROR: "error",
});

// create user slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: {},
    status: USERSTATUSES.IDLE,
    isAuthenticated: false,
    me: {},
    isUpdated: false,
  },
  reducers: {
    // reducer to add user
    addUser: (state, action) => {
      state.userInfo = action.payload;
    },
    // reducer to set current status
    setLoadingStatus: (state, action) => {
      state.status = action.payload;
    },
    // reducer to set isAuthenticated status
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setMe: (state, action) => {
      state.me = action.payload;
    },
    setIsUpdated: (state, action) => {
      state.isUpdated = action.payload;
    },
  },
});

// exporting actions
export const { addUser, setLoadingStatus, setIsAuthenticated, setMe, setIsUpdated } = userSlice.actions;

// exporting reducers
export default userSlice.reducer;

//? creating thunk functions for API request
//! login

export function login(email, password, setCookie) {
  return async function loginThunk(dispatch) {
    // changing status to loading
    dispatch(setLoadingStatus(USERSTATUSES.LOADING));
    try {
      // setting headers
      const config = {
        headers: {
          "Content-Type": "application/json",
          withCredentials: true,
        },
      };
      // extracting data from the received data
      const { data } = await axios.post("/api/v1/login", { email, password }, config);
      if (data.success === false) {
        //showing error message in notification
        toast.error(data.message);
        // changing status to idle
        dispatch(setLoadingStatus(USERSTATUSES.IDLE));
      } else {
        //adding user
        dispatch(addUser(data.user));
        // setting user data using reducer
        dispatch(setMe(data.user));
        //showing notification that user is logged in
        toast.success(data.message);
        // setting cookie
        setCookie("token", data.token);
        // setting is authenticated to true
        dispatch(setIsAuthenticated(true));
        // changing status to idle
        dispatch(setLoadingStatus(USERSTATUSES.IDLE));
      }
    } catch (error) {
      // if error then showing it in notification
      toast.error(error.message);
      // changing status to error
      dispatch(setLoadingStatus(USERSTATUSES.ERROR));
    }
  };
}

//!register

export function register(userData) {
  return async function registerThunk(dispatch) {
    // changing status to loading
    dispatch(setLoadingStatus(USERSTATUSES.LOADING));
    try {
      // setting headers
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      // extracting data from the received data
      const { data } = await axios.post("/api/v1/register", userData, config);
      if (data.success === false) {
        //showing error message in notification
        toast.error(data.message);
        // changing status to idle
        dispatch(setLoadingStatus(USERSTATUSES.IDLE));
      } else {
        //showing notification that user is logged in
        toast.success(data.message);
        // changing status to idle
        dispatch(setLoadingStatus(USERSTATUSES.IDLE));
      }
    } catch (error) {
      // if error then showing it in notification
      toast.error(error.message);
      // changing status to error
      dispatch(setLoadingStatus(USERSTATUSES.ERROR));
    }
  };
}

//! Load User

export function loadUser() {
  return async function loadUserThunk(dispatch) {
    // changing status to loading
    dispatch(setLoadingStatus(USERSTATUSES.LOADING));
    try {
      // extracting data from the received data
      const { data } = await axios.get("/api/v1/me", { withCredentials: true });
      // setting user data using reducer
      dispatch(setMe(data.user));
      // setting isAuthenticated using reducer
      dispatch(setIsAuthenticated(true));
      // changing status to idle
      dispatch(setLoadingStatus(USERSTATUSES.IDLE));
    } catch (error) {
      // if error then showing it in notification
      toast.error(error.message);
      // changing status to error
      dispatch(setLoadingStatus(USERSTATUSES.ERROR));
    }
  };
}

//! Logout user

export function logout(setCookie) {
  return async function logoutThunk(dispatch) {
    // changing status to loading
    dispatch(setLoadingStatus(USERSTATUSES.LOADING));
    try {
      // extracting data from the received data
      await axios.get("/api/v1/logout");
      // setting user data using reducer
      dispatch(setMe(null));
      // setting isAuthenticated using reducer
      dispatch(setIsAuthenticated(false));
      //setting user using reducer
      dispatch(addUser(null));
      //setting cookie to null
      setCookie("token", null);
      // changing status to idle
      dispatch(setLoadingStatus(USERSTATUSES.IDLE));
    } catch (error) {
      // if error then showing it in notification
      toast.error(error.message);
      // changing status to error
      dispatch(setLoadingStatus(USERSTATUSES.ERROR));
    }
  };
}

//! update profile

export function updateProfile(userData) {
  return async function updateProfileThunk(dispatch) {
    // changing status to loading
    dispatch(setLoadingStatus(USERSTATUSES.LOADING));
    try {
      // setting headers
      const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true };
      // extracting data from the received data
      const { data } = await axios.put("/api/v1/me/update", userData, config);
      if (data.success === false) {
        //showing error message in notification
        toast.error(data.message);
        // changing status to idle
        dispatch(setLoadingStatus(USERSTATUSES.IDLE));
      } else {
        //showing notification that user is updated
        toast.success(data.message);
        // setting is update to true
        dispatch(setIsUpdated(true));
        // changing status to idle
        dispatch(setLoadingStatus(USERSTATUSES.IDLE));
      }
    } catch (error) {
      // if error then showing it in notification
      toast.error(error.message);
      // changing status to error
      dispatch(setLoadingStatus(USERSTATUSES.ERROR));
    }
  };
}

//!update password
export function updatePassword(passwords) {
  return async function updatePasswordThunk(dispatch) {
    // changing status to loading
    dispatch(setLoadingStatus(USERSTATUSES.LOADING));
    try {
      // setting withCredentials to true so that cookie can be sent
      const config = { withCredentials: true };
      // extracting data from the received data
      const { data } = await axios.put("/api/v1/password/update", passwords, config);
      if (data.success === false) {
        // showing error message in notification
        toast.error(data.message);
        //changing status to error
        dispatch(setLoadingStatus(USERSTATUSES.ERROR));
      } else {
        // showing success message in notification
        toast.success(data.message);
        // setting update to true
        dispatch(setIsUpdated(true));
        //changing status to idle
        dispatch(setLoadingStatus(USERSTATUSES.IDLE));
      }
    } catch (error) {
      // if error then showing it in notification
      toast.error(error.message);
      // changing status to error
      dispatch(setLoadingStatus(USERSTATUSES.ERROR));
    }
  };
}

//!forgot password
export function forgotPassword(email) {
  return async function forgotPasswordThunk(dispatch) {
    // changing status to loading
    dispatch(setLoadingStatus(USERSTATUSES.LOADING));
    try {
      // setting withCredentials to true so that cookie can be sent
      const config = { withCredentials: true };
      // extracting data from the received data
      const { data } = await axios.post("/api/v1/password/forgot",email, config);
      if (data.success === false) {
        // showing error message in notification
        toast.error(data.message);
        //changing status to error
        dispatch(setLoadingStatus(USERSTATUSES.ERROR));
      } else {
        // showing success message in notification
        toast.success(data.message);
        //changing status to idle
        dispatch(setLoadingStatus(USERSTATUSES.IDLE));
      }
    } catch (error) {
      // if error then showing it in notification
      toast.error(error.message);
      // changing status to error
      dispatch(setLoadingStatus(USERSTATUSES.ERROR));
    }
  };
}


//!reset password
export function resetPassword(token,passwords){
  return async function resetPasswordThunk(dispatch){
     // changing status to loading
     dispatch(setLoadingStatus(USERSTATUSES.LOADING));
     try {
       // setting withCredentials to true so that cookie can be sent
       const config = { withCredentials: true };
      //  req url 
      const url = `/api/v1/password/reset/${token}`
       // extracting data from the received data
       const { data } = await axios.put(url,passwords, config);
       if (data.success === false) {
         // showing error message in notification
         toast.error(data.message);
         //changing status to error
         dispatch(setLoadingStatus(USERSTATUSES.ERROR));
       } else {
         // showing success message in notification
         toast.success(data.message);
         //changing status to idle
         dispatch(setLoadingStatus(USERSTATUSES.IDLE));
       }
     } catch (error) {
      // if error then showing it in notification
      toast.error(error.message);
      // changing status to error
      dispatch(setLoadingStatus(USERSTATUSES.ERROR));
     }
  }
}