import React, { useContext, useRef, useState } from 'react'
import './Navbar.css'
import logo_crown from '../Assets/logo-crown.png'
import cart_icon from '../Assets/cart_icon.png'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'


export const Navbar = () => {
    const[menu, setMenu] = useState("shop");
    const{getTotalCartItems} = useContext(ShopContext);
    const menuRef = useRef();
  return (
    <div className='navbar'>
        <div className="nav-logo d-flex align-items-center col-sm-2">
            <img src={logo_crown} alt='crownIcon'/>
        </div>
        <ul ref={menuRef}  className='nav-menu'>
            <li onClick={()=>{setMenu("shop")}}><Link style={{textDecoration: 'none'}} to='/'>Shop</Link>{menu==="shop"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("mens")}}><Link style={{textDecoration: 'none'}} to='/mens'>Men</Link>{menu==="mens"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("womens")}}><Link style={{textDecoration: 'none'}} to='/womens'>Women</Link>{menu==="womens"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("kids")}}><Link style={{textDecoration: 'none'}} to='/kids'>Kids</Link>{menu==="kids"?<hr/>:<></>}</li>
        </ul>
        <div className='nav-login-cart'>
            <Link to='/login'><button>login</button></Link>
            <Link to='/cart'><img src={cart_icon} alt='cartIcon'/></Link>
            <div className="nav-cart-count">{getTotalCartItems()}</div>
        </div>
    </div>
  )
}

export default Navbar
