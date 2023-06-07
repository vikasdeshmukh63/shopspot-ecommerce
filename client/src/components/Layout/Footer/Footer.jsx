// importing modules 
import playstore from "../../../assets/playstore.png";
import appstore from "../../../assets/Appstore.png";
import logo from "../../../assets/logo.png";
import {Link} from "react-router-dom";
import "./footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="leftFooter">
        <h4>Download Our App</h4>
        <p>Download App for Android and IOS mobile phones</p>
        <img src={playstore} alt="playstore" />
        <img src={appstore} alt="Appstore" />
      </div>

      <div className="midFooter">
        <img src={logo} alt="logo" />
        <p>High Quality is our first Priority</p>
        <p>Copyright {new Date().getFullYear()} &copy; Vikas Deshmukh</p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us</h4>
        <Link to="https://www.instagram.com/im_vikasdeshmukh/">Instagram</Link>
        <Link to="https://github.com/vikasdeshmukh63">Github</Link>
        <Link to="https://www.linkedin.com/in/vikas-deshmukh-fullstackdeveloper/">LinkeDin</Link>
      </div>
    </footer>
  )
}

export default Footer
