import React, { useState, useContext, useRef } from 'react'; // Import useContext
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import nav_dropdown from '../Assets/nav_dropdown.png';

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const [showDetails, setShowDetails] = useState(false); // State for showing details
  const { getTotalCartItems } = useContext(ShopContext); 
  const menuRef = useRef();
  
  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle('nav-menu-visible');
    e.target.classList.toggle('open');
  }
  
  // Click handler for the logo and title
  const handleLogoClick = (e) => {
    e.preventDefault(); // Prevent the default action of the link
    window.scrollTo({
      top: window.innerHeight / 2, // Scroll to the middle of the viewport
      behavior: 'smooth' // Smooth scrolling
    });
  }

  const handleMenuClick = (item) => {
    if (item === "shop") {
      setShowDetails(!showDetails); // Toggle details for "Shop"
    } else {
      setMenu(item);
    }
  }

  return (
    <div className='navbar'>
      <div className="nav-logo" onClick={handleLogoClick}>
        <img src={logo} alt="Logo" />
        <p>EverTrue Cosmetics</p>       
      </div>
      <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt="" />
      <ul ref={menuRef} className="nav-menu">
        <li onClick={() => handleMenuClick("shop")}>
          <span>Shop</span>
          {menu === "shop" && <hr />}
          {showDetails && (
            <div className="menu-details">
              {/* Add details or extra information here */}
              <p>Welcome to our shop! Explore our wide range of products.</p>
              <p>We offer serums, moisturizers, supplements, toners, and soaps.</p>
            </div>
          )}
        </li>
        <li onClick={() => handleMenuClick("Serums")}><Link to='/Serums'>Serums</Link>{menu === "Serums" && <hr />}</li>
        <li onClick={() => handleMenuClick("Moisturisers")}><Link to='/Moisturisers'>Moisturisers</Link>{menu === "Moisturisers" && <hr />}</li>
        <li onClick={() => handleMenuClick("Supplements")}><Link to='/Supplements'>Supplements</Link>{menu === "Supplements" && <hr />}</li>
        <li onClick={() => handleMenuClick("Soaps")}><Link to='/Soaps'>Soaps</Link>{menu === "Soaps" && <hr />}</li>
        <li onClick={() => handleMenuClick("Toners")}><Link to='/Toners'>Toners</Link>{menu === "Toners" && <hr />}</li>
      </ul>
      <div className="nav-login-cart">
        {localStorage.getItem('auth-token')
          ? <button onClick={() => { localStorage.removeItem('auth-token'); window.location.replace('/') }}>Logout</button>
          : <Link to='/login'><button>Login</button></Link>}
        <div className="cart-container">
          <Link to='/cart'><img src={cart_icon} alt="Cart" /></Link>
          <div className="nav-cart-count">{getTotalCartItems()}</div> {/* Call the function to get the total count */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
