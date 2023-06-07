// importing modules 
import { ReactNavbar } from "overlay-navbar"
import logo from "../../../assets/logo.png"
import {MdAccountCircle} from "react-icons/md";
import {MdSearch} from "react-icons/md";
import {MdAddShoppingCart} from "react-icons/md";


const Header = () => {

// creating property object 
    const options ={
        burgerColor:"#bb773f",
        burgerColorHover:"#7DB9B6",
        navColor1:"#DBDFEA",
        navColor2:"#7DB9B6",
        logo,
        logoWidth:"300px",
        link1Text:"Home",
        link2Text:"Products",
        link3Text:"Contact",
        link4Text:"About",
        link1Url:"/",
        link2Url:"/products",
        link3Url:"/contact",
        link4Url:"/about",
        link1Size:"1.3vmax",
        link1Color:"white",
        nav1justifyContent:"flex-end",
        nav2justifyContent:"flex-end",
        nav3justifyContent:"flex-start",
        nav4justifyContent:"flex-start",
        link1ColorHover:"#bb773f",
        link1Margin:"1vmax",
        profileIconUrl:"/login",
        profileIconColor:"white",
        searchIconColor:"white",
        cartIconColor:"white",
        profileIconColorHover:"#bb773f",
        searchIconColorHover:"#bb773f",
        cartIconColorHover:"#bb773f",
        cartIconMargin:"1vmax",
        ProfileIconElement:MdAccountCircle,
        profileIcon:true,
        SearchIconElement:MdSearch,
        searchIcon:true,
        CartIconElement:MdAddShoppingCart,
        cartIcon:true,
    }

return <ReactNavbar {...options}/>
}

export default Header
