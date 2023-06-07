// importing modules 
import ReactStars from "react-rating-stars-component";
import profilePng from "../../assets/Profile.png";
import PropTypes from 'prop-types';

const ReviewCard = ({ review }) => {

    // properties for react stars 
    const options = {
        edit: false,
        color: "rgba(20,20,20,0.1)",
        activeColor: "tomato",
        value: review.rating,
        isHalf: true,
        size: window.innerWidth < 600 ? 20 : 25
    }


    return (
        <div className="reviewCard">
            <img src={profilePng} alt="User" />
            <p>{review.name}</p>
            <ReactStars {...options} />
            <span>{review.comment}</span>
        </div>
    )
}

ReviewCard.propTypes = {
    review: PropTypes.object
};



export default ReviewCard
