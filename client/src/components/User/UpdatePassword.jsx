import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { setIsUpdated, updatePassword } from '../../redux/userSlice';
import MetaData from "../../components/Layout/Metadata";
import Loader from "../../components/Loader"
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import KeyIcon from '@mui/icons-material/Key';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import "./updatePassword.css";

const UpdatePassword = () => {

  // using useDispatch 
  const dispatch = useDispatch();

  // using useNavigate
  const navigate = useNavigate();

  // extracting data from redux store 
  const { isUpdated, status } = useSelector(state => state.user);

  // oldPassword state 
  const [oldPassword, setOldPassword] = useState("");

  // newPassword state 
  const [newPassword, setNewPassword] = useState("");

  // confirmPassword state 
  const [confirmPassword, setConfirmPassword] = useState("");

  // hidePassword state for login or register
  const [hidePassword, setHidePassword] = useState(false);

  // function to handle show or hide password 
  const handleHide = () => {
    setHidePassword((prev) => {
      return !prev
    });
  }

  // fuction to handle updatePassword
  const updatePasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("oldPassword", oldPassword);
    myForm.set("newPassword", newPassword);
    myForm.set("confirmPassword", confirmPassword);

    // api call for updatePassword
    dispatch(updatePassword(myForm));
  }

  useEffect(() => {
    // if isUpdated is true then do follow
    if (isUpdated) {
      navigate("/account");
      dispatch(setIsUpdated(false));
    }
  }, [navigate, dispatch, isUpdated])


  return (
    <>
      {
        status === "loading" ? (<Loader />) : (
          <>
            <MetaData title="Change Password - ShopSpot" />
            <div className="updatePasswordContainer">
              <div className="updatePasswordBox">
                <h2 className="updatePasswordHeading">Update Password</h2>
                <form className="updatePasswordForm" encType="multipart/form-data" onSubmit={updatePasswordSubmit}>
                  <div className="updatePassword">
                    <KeyIcon />
                    <input
                      type={hidePassword ? "text" : "password"}
                      placeholder="Old Password"
                      required
                      value={oldPassword}
                      onChange={(e) => { setOldPassword(e.target.value) }}
                    />
                    {hidePassword ? <VisibilityIcon onClick={handleHide} /> : <VisibilityOffIcon onClick={handleHide} />}
                  </div>
                  <div className="updatePassword">
                    <LockOpenIcon />
                    <input
                      type={hidePassword ? "text" : "password"}
                      placeholder="New Password"
                      required
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value) }}
                    />
                    {hidePassword ? <VisibilityIcon onClick={handleHide} /> : <VisibilityOffIcon onClick={handleHide} />}
                  </div>
                  <div className="updatePassword">
                    <LockIcon />
                    <input
                      type={hidePassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      required
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value) }}
                    />
                    {hidePassword ? <VisibilityIcon onClick={handleHide} /> : <VisibilityOffIcon onClick={handleHide} />}
                  </div>


                  <input
                    type="submit"
                    value="Change Password"
                    className="updatePasswordBtn"
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

export default UpdatePassword
