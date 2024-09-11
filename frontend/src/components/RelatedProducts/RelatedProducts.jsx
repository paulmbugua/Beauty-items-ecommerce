import React, { useEffect, useState } from 'react'
import './RelatedProducts.css'
import Item from '../Item/Item'

const RelatedProducts = () => {
  
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/relatedproducts')
      .then((response) => response.json())
      .then((data) => setRelatedProducts(data));
  }, []);

  return (
    <div className='relatedproducts'>
      <h1>Related Products</h1>
      <hr/>
      <div className="relatedproducts-item">
        {relatedProducts.length > 0 ? (
          relatedProducts.map((item, i) => (
            <Item 
              key={i} 
              id={item.id} 
              name={item.name} 
              main_image={item.main_image} 
              new_price={item.new_price} 
              old_price={item.old_price} 
            />
          ))
        ) : (
          <p>No related products available.</p>
        )}
      </div>
    </div>
  );
}

export default RelatedProducts;
