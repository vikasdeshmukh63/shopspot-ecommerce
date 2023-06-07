// importing modules
import { useState } from "react";
import "./header.css";
import { SpeedDial, SpeedDialAction } from "@mui/material";
import ProfileImg from "../../../assets/Profile.png";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useCookies } from "react-cookie";
import { logout } from "../../../redux/userSlice";
import Backdrop from '@mui/material/Backdrop';
import PropTypes from 'prop-types';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';


const UserOptions = ({ user }) => {
    // speedDial state
    const [open, setOpen] = useState(false);

    // cookie state 
    const [cookies, setCookie] = useCookies(["token"]);

    // extracting data from redux store 
    const { cartItems } = useSelector(state => state.cart);

    //using useNavigate 
    const navigate = useNavigate();

    // using dispatch 
    const dispatch = useDispatch();

    // menuOptions Array
    const options = [
        { icon: <ListAltIcon />, name: "Orders", func: orders },
        { icon: <PersonIcon />, name: "Profile", func: account },
        { icon: <ShoppingCartIcon style={{ color: cartItems.length === 0 ? "unset" : "tomato" }} />, name: cartItems.length === 0 ? "Cart" : `Cart (${cartItems.length})`, func: cart },
        { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
    ];

    // display dashboard option only when the user is admin 
    if (user?.role === "Admin") {
        options.unshift({ icon: <DashboardIcon />, name: "DashBoard", func: dashboard });
    }

    // function for dashboard
    function dashboard() {
        navigate("/dashboard");
    }

    // function for orders 
    function orders() {
        navigate("/orders");
    }

    // function for account 
    function account() {
        navigate("/account");
    }

    // function for logoutUser 
    function logoutUser() {
        dispatch(logout(setCookie));
        toast.success("Logout Successfully");
        navigate("/login");
    }

    // function for cart 
    function cart() {
        navigate("/cart")
    }


    return (
        <>
            <Backdrop open={open} style={{ zIndex: 10 }} />
            <SpeedDial
                style={{ zIndex: 10 }}
                ariaLabel="SpeedDial tooltip example"
                className="speedDial"
                onClose={() => {
                    setOpen(false);
                }}
                onOpen={() => {
                    setOpen(true);
                }}
                open={open}
                direction="down"
                icon={<img className="speedDialIcon" src={user?.avatar?.url ? user?.avatar?.url : ProfileImg} alt="Profile" />}
            >
                {options.map((item, index) => {
                    return <SpeedDialAction key={index} icon={item.icon} tooltipOpen={window.innerWidth <= 600 ? true : false} tooltipTitle={item.name} onClick={item.func} />
                })}
            </SpeedDial>
        </>
    );
};


UserOptions.propTypes = {
    user: PropTypes.object
};

export default UserOptions;
