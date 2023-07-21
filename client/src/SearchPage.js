import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/products?search=${searchTerm}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  return (
    <div>
      <input className='Search'
        type="text"
        placeholder="Search for a product..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className='SearchPro' onClick={handleSearch}>Search</button>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            <img src={product.image} alt={product.title} />
            <h3>{product.title}</h3>
            <p>Rating: {product.rating}</p>
            <p>Price: {product.price}</p>
            <p>Final Price: {product.finalPrice}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPage;
