// importing modules 
import "./updateProfile.css"
import Loader from "../Loader";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import FaceIcon from '@mui/icons-material/Face';
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../redux/userSlice";
import { loadUser } from "../../redux/userSlice";
import { setIsUpdated } from "../../redux/userSlice";
import Metadata from "../../components/Layout/Metadata"

const UpdateProfile = () => {

  // using useDispatch 
  const dispatch = useDispatch()

  // using useNavigate 
  const navigate = useNavigate()

  // extracting data from redux store 
  const { me, status, isUpdated } = useSelector(state => state.user)

  // avatar state 
  const [avatar, setAvatar] = useState("");

  // avatar preview state 
  const [avatarPreview, setAvatarPreview] = useState("../../../public/assets/Profile.png");

  // name state 
  const [name, setName] = useState("");

  // email state 
  const [email, setEmail] = useState("");

  const updateProfileDataChange = (e) => {
    const reader = new FileReader();
    // after photo is uploaded successfully 
    reader.onload = () => {
      if (reader.readyState === 2) {         //there are total three state of readyState 0-initial 1-processing 2-done 
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    }

    reader.readAsDataURL(e.target.files[0]);
  }

  // fuction to handle updateProfile 
  const updateProfileSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("avatar", avatar);

    // api call for updateProfile
    dispatch(updateProfile(myForm));
  }


  useEffect(() => {
    // if user is available then setting the initial values 
    if (me) {
      setName(me?.name);
      setEmail(me?.email);
      setAvatarPreview(me?.avatar?.url);
    }

    // if isUpdated is true then do follow
    if (isUpdated) {
      dispatch(loadUser());
      navigate("/account");
      dispatch(setIsUpdated(false));
    }
  }, [navigate, isUpdated, dispatch, me]);

  return (
    <>
      {
        status === "loading" ? (<Loader />) : (
          <>
            <Metadata title="Update Profile - ShopSpot" />
            <div className="updateProfileContainer">
              <div className="updateProfileBox">
                <h2 className="updateProfileHeading">Update Profile</h2>
                <form className="updateProfileForm" encType="multipart/form-data" onSubmit={updateProfileSubmit}>
                  <div className="updateProfileName">
                    <FaceIcon />
                    <input
                      type="text"
                      placeholder="Name"
                      required
                      name="name"
                      value={name}
                      onChange={(e)=>{setName(e.target.value)}}
                    />
                  </div>
                  <div className="updateProfileEmail">
                    <MailOutlineIcon />
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      name="email"
                      value={email}
                      onChange={(e)=>{setEmail(e.target.value)}}
                    />
                  </div>

                  <div className="updateProfileImg">
                    <img src={avatarPreview} alt="Avatar Preview" />
                    <input
                      type="file"
                      name="avatar"
                      accept="image/*"
                      onChange={updateProfileDataChange}
                    />
                  </div>
                  <input
                    type="submit"
                    value="Update"
                    className="updateProfileBtn"
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

export default UpdateProfile
