// importing modules 
import { Link } from "react-router-dom"
import ReactStars from "react-rating-stars-component";
import PropTypes from 'prop-types';

const ProductCard = ({ product }) => {

    // properties for react stars 
    const options = {
        edit: false,
        color: "rgba(20,20,20,0.1)",
        activeColor: "tomato",
        value: product.rating,
        isHalf: true,
        size: window.innerWidth < 600 ? 20 : 25
    }


    return (
        <Link className="productCard" to={`/product/${product._id}`}>
            <img src={product.images[0].url} alt={product.name} />
            <p>{product.name}</p>
            <div>
                <ReactStars {...options} />
                <span>{`${product.noOfReviews} Reviews`}</span>
            </div>
            <span>₹{product.price}</span>
        </Link>
    )
}

ProductCard.propTypes = {
    product: PropTypes.object
};


export default ProductCard
