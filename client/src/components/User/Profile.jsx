// importing modules 
import { Link, useNavigate } from 'react-router-dom'
import Metadata from '../Layout/Metadata'
import { useSelector } from 'react-redux'
import Loader from '../Loader';
import { useEffect } from 'react';
import "./profile.css"

const Profile = () => {

    // extracting data from redux store 
    const { me, status, isAuthenticated } = useSelector(state => state.user);

    // using useNavigate
    const navigate = useNavigate()

    // if user is not logged in then redirecting to login 
    useEffect(() => {
        if (isAuthenticated === false) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    return (
        <>
            {
                status === "loading" ? (<Loader />) : (<>
                    <Metadata title={`${me?.name}'s Profile`} />
                    <div className="profileContainer">
                        <div>
                            <h1>My Profile</h1>
                            <img src={me?.avatar?.url} alt={me?.name} />
                            <Link to="/me/update">Edit Profile</Link>
                        </div>
                        <div>
                            <div>
                                <h4>Full Name</h4>
                                <p>{me?.name}</p>
                            </div>
                            <div>
                                <h4>Email</h4>
                                <p>{me?.email}</p>
                            </div>
                            <div>
                                <h4>Joined On</h4>
                                <p>{String(me?.createdAt).substring(0, 10)}</p>
                            </div>
                            <div>
                                <Link to="/orders">My Orders</Link>
                                <Link to="/password/update">Change Password</Link>
                            </div>
                        </div>
                    </div>
                </>)
            }
        </>
    )
}

export default Profile
