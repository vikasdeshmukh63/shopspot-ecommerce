import { useEffect, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import PropTypes from 'prop-types';

const Carousel = ({slides}) => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLeftArrowHovered, setIsLeftArrowHovered] = useState(false);
    const [isRightArrowHovered, setIsRightArrowHovered] = useState(false);

    // const slides = [
    //     {
    //         url: "https://assets.ajio.com/medias/sys_master/root/20230120/4mly/63caae35aeb269c651ef0d39/-288Wx360H-465634623-navy-MODEL.jpg",
    //         title: "Tshirt"
    //     },
    //     {
    //         url: "https://cdn.shopify.com/s/files/1/0752/6435/products/IMG_0053_5c650849-9d9d-4cc3-8863-6a23778cd9a0.jpg?v=1675170808",
    //         title: "Camera"
    //     },
    //     {
    //         url: "https://rukminim1.flixcart.com/image/832/832/l251xu80/t-shirt/z/j/8/xl-alhamdulillah-tshirt-printcorners-original-imagdk68sns2gcgh.jpeg?q=70",
    //         title: "bulb"
    //     },
    //     {
    //         url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8vmhxzqUstTmphyK2-vSGbTEKXbxSp8kCqA&usqp=CAU",
    //         title: "mouse"
    //     },
    // ]

    const slideStyle = {
        width: "100%",
        height: "100%",
        borderRadius: "10px",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundImage: `url(${slides[currentIndex].url})`,
        transition: "all 0.5s"
    }

    const sliderStyle = {
        width:"20vmax",
        height: "100%",
        position: "relative"
    }

    const leftArrowStyle = {
        position: "absolute",
        top: "50%",
        transform: "translate(0,-50%)",
        left: "1vmax",
        fontSize: "40px",
        backgroundColor: isLeftArrowHovered ? "#7db9b6" : "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
        color: "gray",
        zIndex: 1,
        cursor: "pointer",
        transition: "all 0.5s",
    }


    const rightArrowStyle = {
        position: "absolute",
        top: "50%",
        transform: "translate(0,-50%)",
        right: "1vmax",
        fontSize: "40px",
        backgroundColor: isRightArrowHovered ? "#7db9b6" : "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
        color: "gray",
        zIndex: 1,
        cursor: "pointer",
        transition: "all 0.5s",
    }

    function goToPrevious() {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1
        setCurrentIndex(newIndex);
    }

    function goToNext() {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }

    function goToSpecSlide(imgIndex) {
        setCurrentIndex(imgIndex);
    }

    const dotStyle = {
        position: "absolute",
        bottom: "20px",
        left: "50%",
        display: "flex",
        gap: "10px",
        transform: "translate(-50%,0)",
        fontSize: "20px"
    }


    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const isLastSlide = prevIndex === slides.length - 1;
                return isLastSlide ? 0 : prevIndex + 1;
            });
        }, 8000);

        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, [slides.length]);


    return (
        <div style={sliderStyle}>
            <div
                style={leftArrowStyle}
                onClick={goToPrevious}
                onMouseOver={() => setIsLeftArrowHovered(true)}
                onMouseOut={() => setIsLeftArrowHovered(false)}
             >
                <MdKeyboardArrowLeft />
            </div>
            <div style={slideStyle}></div>
            <div
                style={rightArrowStyle}
                onClick={goToNext}
                onMouseOver={() => setIsRightArrowHovered(true)}
                onMouseOut={() => setIsRightArrowHovered(false)}
             >
                <MdKeyboardArrowRight />
            </div>
            <div style={dotStyle}>
                {slides.map((item, index) => {
                    return <span key={index} style={{ color: currentIndex === index ? "#7db9b6" : "gray", cursor: "pointer" }} onClick={() => { goToSpecSlide(index) }}>●</span>
                })}
            </div>
        </div>
    )
}

Carousel.propTypes = {
    slides: PropTypes.array.isRequired
  };
  

export default Carousel
