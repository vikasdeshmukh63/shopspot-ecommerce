// importing modules 
import "./search.css";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Metadata from "../Layout/Metadata";



const Search = () => {

    const navigate = useNavigate();

    // state for keyword search 
    const [keyword, setKeyword] = useState("");

    // search function 
    const searchSubmitHandler = (e) => {
        // for preventing default behavior of form 
        e.preventDefault();

        // if keyword exist then
        if (keyword.trim()) {
            navigate(`/products/${keyword}`);
        }
        // if keyword not exist 
        else {
            navigate("/products");
        }
    }

    return (
        <>
        <Metadata title="ShopSpot - Search"/>
            <form className="searchBar" onSubmit={searchSubmitHandler}>
                <input
                    type="text"
                    placeholder="Search a Product..."
                    onChange={(e) => { setKeyword(e.target.value) }} />

                <input
                    type="submit"
                    value="Search" />
            </form>
        </>
    )
}




export default Search
