import { useDispatch, useSelector } from "react-redux"
import Metadata from "../Layout/Metadata"
import Loader from "../Loader"
import "./forgotPassword.css"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { forgotPassword } from "../../redux/userSlice"
import MailOutlineIcon from '@mui/icons-material/MailOutline';

const ForgotPassword = () => {

  // using useDispatch
  const dispatch = useDispatch();

  // using useNavigate
  const navigate = useNavigate();

  // extracting data from redux store 
  const { status } = useSelector(state => state.user);

  // email state 
  const [email, setEmail] = useState("");

  // fuction to handle forgot password 
  const forgotPasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("email", email);

    // api call for updateProfile
    dispatch(forgotPassword(myForm));
  }


  return (
    <>
      {
        status === "loading" ? (<Loader />) : (
          <>
            <Metadata title="Forgot Password - ShopSpot" />
            <div className="ForgotPasswordContainer">
              <div className="ForgotPasswordBox">
                <h2 className="ForgotPasswordHeading">Forgot Password</h2>
                <form className="ForgotPasswordForm" onSubmit={forgotPasswordSubmit}>

                  <div className="ForgotPasswordEmail">
                    <MailOutlineIcon />
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      name="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value) }}
                    />
                  </div>


                  <input
                    type="submit"
                    value="Send"
                    className="ForgotPasswordBtn"
                  />
                </form>
              </div>
            </div>
          </>
        )
      }
    </>
  )
}

export default ForgotPassword
