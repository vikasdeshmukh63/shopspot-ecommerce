// importing modules 
import "./shipping.css"
import PinDropIcon from '@mui/icons-material/PinDrop';
import HomeIcon from '@mui/icons-material/Home';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PublicIcon from '@mui/icons-material/Public';
import PhoneIcon from '@mui/icons-material/Phone';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import { Country, State } from "country-state-city";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Metadata from "../Layout/Metadata";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { toast } from "react-hot-toast";
import { saveShippingInfo } from "../../redux/cartSlice";
import {useNavigate} from "react-router-dom";

const Shipping = () => {

    // using useDispatch 
    const dispatch = useDispatch();

    // using useNavigate
    const navigate = useNavigate();

    // extracting data from redux store 
    const { shippingInfo } = useSelector(state => state.cart);

    // address state 
    const [address, setAddress] = useState(shippingInfo.address);

    // city state 
    const [city, setCity] = useState(shippingInfo.city);

    // states state
    const [state, setState] = useState(shippingInfo.state);

    // country state 
    const [country, setCountry] = useState(shippingInfo.country);

    // pincode state
    const [pincode, setPincode] = useState(shippingInfo.pincode);

    // phone no. state 
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);

    //function to handle shipping submit
    const shippingSubmit = (e) => {
        e.preventDefault();
        // setting condition for phoneNo length
        if (phoneNo.length < 10 || phoneNo.length > 10){
            toast.error("Phone Number should be 10 digit long");
            return
        }
        // saving shipping data in redux store using thunk function 
        dispatch(saveShippingInfo({address,city,state,country,pincode,phoneNo}));
        // navigating user to next step 
        navigate("/order/confirm");
        
    }

    return (
        <>
            <Metadata title="Shipping Details - ShopSpot" />
            <CheckoutSteps activeStep={0} />
            <div className="shippingContainer">
                <div className="shippingBox">
                    <h2 className="shippingHeading">Shipping Details</h2>
                    <form
                        className="shippingForm"
                        encType="multipart/form-data"
                        onSubmit={shippingSubmit}
                    >
                        <div>
                            <HomeIcon />
                            <input
                                type="text"
                                placeholder="Address"
                                required
                                value={address}
                                onChange={(e) => { setAddress(e.target.value) }}
                            />
                        </div>

                        <div>
                            <LocationCityIcon />
                            <input
                                type="text"
                                placeholder="City"
                                required
                                value={city}
                                onChange={(e) => { setCity(e.target.value) }}
                            />
                        </div>

                        <div>
                            <PinDropIcon />
                            <input
                                type="number"
                                placeholder="PinCode"
                                required
                                value={pincode}
                                onChange={(e) => { setPincode(e.target.value) }}
                            />
                        </div>

                        <div>
                            <PhoneIcon />
                            <input
                                type="number"
                                placeholder="Phone Number"
                                required
                                value={phoneNo}
                                onChange={(e) => { setPhoneNo(e.target.value) }}
                                size="10"
                            />
                        </div>

                        <div>
                            <PublicIcon />
                            <select
                                required
                                value={country}
                                onChange={(e) => { setCountry(e.target.value) }}
                            >
                                <option value="">Country</option>
                                {Country && Country.getAllCountries().map((item) => {
                                    return <option key={item.isoCode} value={item.isoCode}>
                                        {item.name}
                                    </option>
                                })}
                            </select>
                        </div>

                        {country && (
                            <div>
                                <TransferWithinAStationIcon />
                                <select
                                    required
                                    value={state}
                                    onChange={(e) => { setState(e.target.value) }}
                                >
                                    <option value="">State</option>
                                    {State && State.getStatesOfCountry(country).map((item) => {
                                        return <option key={item.isoCode} value={item.isoCode}>
                                            {item.name}
                                        </option>
                                    })}
                                </select>

                            </div>
                        )}

                        <input
                            type="submit"
                            value="Continue"
                            className="shippingBtn"
                            disabled={state ? false : true}
                        />
                    </form>
                </div>
            </div>
        </>
    )
}

export default Shipping
