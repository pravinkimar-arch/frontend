import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    apiService.getProducts()
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  return (
    <div>
      <h2>Product List</h2>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}

export default ProductList;
