import React, { useState } from 'react';
import './Footer.css';
import footer_logo from '../Assets/logo_big.png';
import instagram_icon from '../Assets/instagram_icon.png';
import pintester_icon from '../Assets/pintester_icon.png';
import whatsapp_icon from '../Assets/whatsapp_icon.png';

const Footer = () => {
  const [activeSection, setActiveSection] = useState(null);

  const handleLinkClick = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className='footer'>
      <div className="footer-logo">
        <img src={footer_logo} alt="Shopper logo" />
        <h3>Ever True Cosmetics</h3>
      </div>

      <ul className="footer-links">
        <li onClick={() => handleLinkClick('company')}>Company</li>
        <li onClick={() => handleLinkClick('products')}>Products</li>
        <li onClick={() => handleLinkClick('offices')}>Offices</li>
        <li onClick={() => handleLinkClick('about')}>About</li>
        <li onClick={() => handleLinkClick('contact')}>Contact</li>
      </ul>

      <div className="footer-details">
        {activeSection === 'offices' && (
          <div className="footer-offices">
            <h3>Our Offices</h3>
            <p>Head Office: 123 Main Street, Nairobi, Kenya</p>
            <p>Branch Office: 456 Elm Street, Doha, Qatar</p>
          </div>
        )}
        {activeSection === 'contact' && (
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <p>Email: support@evertruecosmetics.co.ke</p>
            <p>Phone: +254 704 179 663 (Kenya)</p>
           
          </div>
        )}
        {activeSection === 'about' && (
          <div className="footer-about">
            <h3>Welcome to EverTrue Cosmetics</h3>
            <p>At EverTrue Cosmetics, we are committed to bringing you the finest organic and natural skincare products that lighten, brighten, and repair, helping you achieve the healthiest, most radiant skin. We believe in the power of nature, and our products are crafted from the purest ingredients to nourish and rejuvenate your skin naturally.</p>
            <p>Our dedication to quality means that we source our products directly from the manufacturers, ensuring their authenticity and effectiveness. With EverTrue Cosmetics, you can trust that every product you use is genuine, safe, and designed to bring out your true beauty.</p>
            <p>Discover the difference with EverTrue Cosmetics—where nature meets science for skincare you can trust.</p>
          </div>
        )}
      </div>

      <div className="footer-social-icon">
        <div className="footer-icons-container">
          <img src={instagram_icon} alt="Instagram" />
        </div>
        <div className="footer-icons-container">
          <img src={pintester_icon} alt="Pinterest" />
        </div>
        <div className="footer-icons-container">
          <img src={whatsapp_icon} alt="WhatsApp" />
        </div>
      </div>

      <div className="footer-copyright">
        <hr />
        <p>Copyright © 2024 - All Rights Reserved</p>
      </div>
    </div>
  );
};

export default Footer;
