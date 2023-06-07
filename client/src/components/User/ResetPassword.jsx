import "./resetPassword.css";
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../../redux/userSlice';
import MetaData from "../../components/Layout/Metadata";
import Loader from "../../components/Loader"
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const ResetPassword = () => {
    // using useDispatch 
    const dispatch = useDispatch();

    // using useNavigate
    const navigate = useNavigate();

    //using useParams 
    const params = useParams();

    // extracting data from redux store 
    const { status } = useSelector(state => state.user);

    // password state 
    const [password, setPassword] = useState("");

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

    // fuction to handle resetPassword
    const resetPasswordSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("password", password);
        myForm.set("confirmPassword", confirmPassword);

        // api call for resetPassword
        dispatch(resetPassword(params.token, myForm));
    }

    return (
        <>
            {
                status === "loading" ? (<Loader />) : (
                    <>
                        <MetaData title="Reset Password - ShopSpot" />
                        <div className="resetPasswordContainer">
                            <div className="resetPasswordBox">
                                <h2 className="resetPasswordHeading">Reset Password</h2>
                                <form className="resetPasswordForm" encType="multipart/form-data" onSubmit={resetPasswordSubmit}>

                                    <div className="resetPassword">
                                        <LockOpenIcon />
                                        <input
                                            type={hidePassword ? "text" : "password"}
                                            placeholder="Password"
                                            required
                                            value={password}
                                            onChange={(e) => { setPassword(e.target.value) }}
                                        />
                                        {hidePassword ? <VisibilityIcon onClick={handleHide} /> : <VisibilityOffIcon onClick={handleHide} />}
                                    </div>
                                    <div className="resetPassword">
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
                                        value="Reset Password"
                                        className="resetPasswordBtn"
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

export default ResetPassword
