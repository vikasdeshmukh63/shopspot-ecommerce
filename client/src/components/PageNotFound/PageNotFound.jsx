// importing modules 
import { Link } from "react-router-dom"
import PageNotFoundImg from "../../assets/page not found.png";
import "./pagenotfound.css"

const PageNotFound = () => {
    return (
        <div className="PageNotFound">
            <h3>Oops!</h3>
            <img src={PageNotFoundImg} alt="Page Not Found" />
            <div className="content">
                <h1>PAGE NOT FOUND</h1>
                <p>{`Sorry, the page you're looking for doesn't exist. If you think something is broken, report a problem.`}</p>
                <div className="buttons">
                    <Link to="/">GO HOME</Link>
                    <Link to="/contact">CONTACT US</Link>
                </div>
            </div>
        </div>
    )
}

export default PageNotFound
