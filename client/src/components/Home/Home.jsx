// importing modules 
import {BsMouse} from "react-icons/bs";
import "./home.css";
import ProductCard from "./ProductCard";
import Metadata from "../Layout/Metadata";
import { useEffect } from "react";
import { getProducts } from "../../redux/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { STATUSES } from "../../redux/productSlice";
import Loader from "../Loader";



const Home = () => {

    const dispatch = useDispatch()
    const {products,status} = useSelector(state=>state.product);

    useEffect(()=>{
       dispatch(getProducts());
    },[dispatch]);
    
    return (
        <>
        {
            status === STATUSES.LOADING ? (<Loader/>) : <>
            <Metadata title="ShopSpot - Home"/>

            <div className="banner">
                <p>Welcome to ShopSpot</p>
                <h1>Find Amazing Products Below</h1>

                <a href="#container">
                    <button>Scroll <BsMouse/></button>
                </a>
            </div>

            <h2 className="homeHeading">Featured Products</h2>

            <div className="container" id="container">
                {
                    products && products.map((item,index)=>{
                        return <ProductCard key={index} product={item}/>
                    })
                }
            </div>
        </>
        }
        </>
    )
}

export default Home
