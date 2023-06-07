import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../Home/ProductCard";
import Loader from "../Loader";
import { STATUSES } from "../../redux/productSlice";
import { getProducts } from "../../redux/productSlice";
import { useEffect, useState } from "react";
import "./products.css";
import { useParams } from "react-router-dom";
import Pagination from "react-js-pagination";
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Metadata from "../Layout/Metadata";

// categories array 
const categories = [
  "Electronic",
  "Footwear",
  "Clothing",
  "Groceries",
  "Books",
  "Beauty",
  "Furniture",
  "Music",
  "Tools",
  "Appliances",
  "Mens Grooming",
]

const Products = () => {
  // page state
  const [currentPage, setCurrentPage] = useState(1);

  // price state 
  const [price,setPrice] = useState([0,25000]);

  // category state 
  const [category,setCategory] = useState();

  // rating state 
  const [ratings,setRatings] = useState(0);

  // extracting the data from redux store
  const { products, status, productCount, resultPerPage } = useSelector((state) => state.product);

  // using useDispatch hook
  const dispatch = useDispatch();

  // using useParams hook
  const params = useParams();

  // extracting keyword value from params
  const keyword = params.keyword;

  // function to handle currentPage no
  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  // function to handle price 
  const priceHandler = (e,newPrice)=>{
    setPrice(newPrice);
  }

    // handle clear filters button
    const handleClearFilters = () => {
      setPrice([0, 25000]);
      setCategory("");
      setCurrentPage(1);
      setRatings(0)
    };

    // function for handeling ratings filter 
    const handleRatingsFilter =(e,newRating)=>{
      setRatings(newRating);
    }
  

  // getting products data on component mount
  useEffect(() => {
    dispatch(getProducts(keyword, currentPage,price,category,ratings));
  }, [dispatch, keyword, currentPage,price,category,ratings]);



  return (
    <>
      {status === STATUSES.LOADING ? (
        <Loader />
      ) : (
        <>
        <Metadata title={"ShopSpot - Products"}/>
          <h2 className="productsHeading">Products</h2>
          <div className="products">
            {products &&
              products.map((item, index) => {
                return <ProductCard key={index} product={item} />;
              })}
          </div>

          <div className="filterbox">
                <Typography>Price</Typography>
                <Slider
                    value={price}
                    onChange={priceHandler}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                    min={0}
                    max={25000}
                    size="small"
                    step={1000}
                    marks
                />

                <Typography>Categories</Typography>
                <ul className="categoryBox">
                  {categories.map((item,index)=>{
                    return <li
                    className="category-link"
                    key={index}
                    onClick={()=>{setCategory(item)}}
                    >
                      {item}
                    </li>
                  })}
                </ul>

                <fieldset>
                  <Typography component="legend">Ratings Above</Typography>
                  <Slider
                  value={ratings}
                  onChange={handleRatingsFilter}
                  aria-label="continuous-slider"
                  min={0}
                  max={5}
                  valueLabelDisplay="auto"
                  size="small"
                  step={1}
                    marks
                  />
                </fieldset>

                <button className="clearFilters" onClick={handleClearFilters}>Clear Filters</button>
            </div>

          {resultPerPage < productCount && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={productCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Products;
