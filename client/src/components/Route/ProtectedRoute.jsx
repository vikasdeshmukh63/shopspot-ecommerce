import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {

    // extracting data from redux store 
    const { status, isAuthenticated } = useSelector((state) => state.user);

    // using useNavigate
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [navigate, isAuthenticated]);

    return (
        <>
            {
                status !== "loading" && (<>{children}</>)
            }
        </>
    );
};

ProtectedRoute.propTypes = {
    children: PropTypes.any
};


export default ProtectedRoute;
