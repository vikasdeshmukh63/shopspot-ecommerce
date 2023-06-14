// importing modules
import WebFont from "webfontloader";
import { useEffect, useState } from "react";
import Header from "./components/Layout/Header/Header";
import Footer from "./components/Layout/Footer/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import "./App.css";
import { Toaster, toast } from "react-hot-toast";
import ProductDetails from "./components/Product/ProductDetails";
import Products from "./components/Product/Products";
import Search from "./components/Search/Search";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import LoginSignUp from "./components/User/LoginSignUp";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./redux/userSlice";
import UserOptions from "./components/Layout/Header/UserOptions";
import Profile from "./components/User/Profile";
import ProtectedRoute from "./components/Route/ProtectedRoute";
import UpdateProfile from "./components/User/UpdateProfile";
import UpdatePassword from "./components/User/UpdatePassword";
import ForgotPassword from "./components/User/ForgotPassword";
import ResetPassword from "./components/User/ResetPassword";
import Cart from "./components/Cart/Cart";
import Shipping from "./components/Cart/Shipping";
import ConfirmOrder from "./components/Cart/ConfirmOrder"
import Payment from "./components/Cart/Payment"
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js" // compulsory required for using stripe payment gateway
import { loadStripe } from "@stripe/stripe-js" // compulsory required for using stripe payment gateway
import Cookies from 'js-cookie';


function App() {

  // using useDispatch 
  const dispatch = useDispatch();

  const cookieValue = Cookies.get('token');
  console.log(cookieValue)

  // state for stripe api key
  const [stripeApiKey, setStripeApiKey] = useState("");

  // function to receive stripeApiKey
  const getStripeApiKey = async () => {
    try {
      const { data } = await axios.get("/api/v1/stripeapikey", { withCredentials: true });
      if (data.success === false) {
        toast.error("Something went wrong");
      } else {
        setStripeApiKey(data.stripeApiKey);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  // using useSelector 
  const { me, isAuthenticated } = useSelector(state => state.user);

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    if (cookieValue) {
      // calling function to get user details 
      dispatch(loadUser());
      // calling getStripeApiKey
      getStripeApiKey();
    }

  }, [dispatch, cookieValue]);




  return (
    <BrowserRouter>
      <Header />
      {isAuthenticated && <UserOptions user={me} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/search" element={<Search />} />
        <Route path="/shipping" element={<ProtectedRoute><Shipping /></ProtectedRoute>} />
        <Route path="/order/confirm" element={<ProtectedRoute><ConfirmOrder /></ProtectedRoute>} />
        {stripeApiKey && <Route path="/process/payment" element={<ProtectedRoute><Elements stripe={loadStripe(stripeApiKey)}><Payment /></Elements></ProtectedRoute>} />}
        <Route path="/account" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/me/update" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
        <Route path="/password/update" element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
