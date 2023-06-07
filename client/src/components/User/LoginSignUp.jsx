import "./loginsignup.css";
import Loader from "../Loader";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import FaceIcon from '@mui/icons-material/Face';
import { login, register } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { USERSTATUSES } from "../../redux/userSlice";
import { useCookies } from "react-cookie";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import profilePng from "../../assets/Profile.png"

const LoginSignUp = () => {

  const [cookies, setCookie] = useCookies(["token"]);

  // using useLocation
  const location = useLocation()

  // using useDispatch 
  const dispatch = useDispatch();

  // using useNavigate
  const navigate = useNavigate();

  // accessing data in redux store 
  const { status, isAuthenticated } = useSelector(state => state.user);

  // using useRef hook 
  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  // hidePassword state for login or register
  const [hidePassword, setHidePassword] = useState(false);

  // email input state 
  const [loginEmail, setLoginEmail] = useState("");

  // password input state 
  const [loginPassword, setLoginPassword] = useState("");

  // user state 
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  });

  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      // after photo is uploaded successfully 
      reader.onload = () => {
        if (reader.readyState === 2) {         //there are total three state of readyState 0-initial 1-processing 2-done 
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      }

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  }

  // avatar state 
  const [avatar, setAvatar] = useState();

  // avatar preview state 
  const [avatarPreview, setAvatarPreview] = useState(profilePng);

  // extracting the values from user object 
  const { name, email, password } = user;

  // function to switch between tabs 
  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    else if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  }

  // function to handle show or hide password 
  const handleHide = () => {
    setHidePassword((prev) => {
      return !prev
    });
  }

  // function to handle login 
  const loginSubmit = (e) => {
    e.preventDefault();
    //api call for login
    dispatch(login(loginEmail, loginPassword, setCookie));
  }

  // fuction to handle register 
  const registerSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("password", password);
    myForm.set("avatar", avatar);

    // api call for register
    dispatch(register(myForm));
  }

  // after clicking on checkout if user is login then redirect to account page or redirect shipping page 
  const redirect = location.search ? `/${location.search.split("=")[1]}` : "/account"

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [navigate, isAuthenticated,redirect]);

  return (
    <>
      {
        status === USERSTATUSES.LOADING ? (<Loader />) : (<>
          <div className="loginSignUpContainer">
            <div className="loginSignUpBox">
              <div>

                <div className="loginSignUpToggle">
                  <p onClick={(e) => { switchTabs(e, "login") }}>LOGIN</p>
                  <p onClick={(e) => { switchTabs(e, "register") }}>REGISTER</p>
                </div>
                <button ref={switcherTab}></button>
              </div>
              {/* LOGIN FORM  */}
              <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                <div className="loginEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={loginEmail}
                    onChange={(e) => { setLoginEmail(e.target.value) }}
                  />
                </div>
                <div className="loginPassword">
                  <LockOpenIcon />
                  <input
                    type={hidePassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    value={loginPassword}
                    onChange={(e) => { setLoginPassword(e.target.value) }}
                  />
                  {hidePassword ? <VisibilityIcon onClick={handleHide} /> : <VisibilityOffIcon onClick={handleHide} />}
                </div>
                <Link to="/password/forgot">Forget Password</Link>
                <input type="submit" value="Login" className="loginBtn" />
              </form>
              {/* {REGISTER FORM} */}
              <form className="signUpForm" ref={registerTab} encType="multipart/form-data" onSubmit={registerSubmit}>
                <div className="signUpName">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpPassword">
                  <LockOpenIcon />
                  <input
                    type={hidePassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    name="password"
                    value={password}
                    onChange={registerDataChange}
                  />
                  {hidePassword ? <VisibilityIcon onClick={handleHide} /> : <VisibilityOffIcon onClick={handleHide} />}
                </div>

                <div className="registerImg">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={registerDataChange}
                  />
                </div>
                <input
                  type="submit"
                  value="Register"
                  className="signUpBtn"
                />
              </form>
            </div>
          </div>
        </>)
      }
    </>
  )
}

export default LoginSignUp
