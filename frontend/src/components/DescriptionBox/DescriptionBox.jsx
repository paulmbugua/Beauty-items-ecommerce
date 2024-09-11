import React from 'react';
import './DescriptionBox.css';


const DescriptionBox = ({ product }) => {
  return (
    <div className='descriptionbox'>
      <div className="description-navigatior">
        <div className="description-nav-box">Description</div>
        <div className="description-nav-box fade">Reviews (122)</div>
      </div>
      <div className="descriptionbox-description">
        {product.detailed_description}
      </div>
    </div>
  );
};

export default DescriptionBox;
