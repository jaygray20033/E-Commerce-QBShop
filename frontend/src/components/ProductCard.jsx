'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className='product-card-wrapper'>
      <Link to={`/product/${product._id}`} className='product-card-link'>
        <div
          className='product-card'
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image Container with 3D Effect */}
          <div className='product-image-container'>
            <img
              src={product.image || '/placeholder.svg'}
              alt={product.name}
              className={`product-image ${isHovered ? 'hovered' : ''}`}
              loading='lazy'
            />

            {/* Floating Badge */}
            {product.countInStock === 0 ? (
              <div className='product-badge out-of-stock'>Out of Stock</div>
            ) : product.countInStock < 5 ? (
              <div className='product-badge limited'>Limited Stock</div>
            ) : null}

            {/* Overlay on Hover */}
            <div
              className={`product-overlay ${isHovered ? 'active' : ''}`}
            ></div>
          </div>

          {/* Content */}
          <div className='product-content'>
            <h3 className='product-name'>{product.name}</h3>

            {/* Rating */}
            <div className='product-rating'>
              <Rating
                value={product.rating}
                text={`${product.numReviews} reviews`}
              />
            </div>

            {/* Price */}
            <div className='product-price-section'>
              <span className='product-price'>
                ₫{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className='product-original-price'>
                  ₫{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className='product-stock'>
              <span
                className={`stock-indicator ${
                  product.countInStock > 0 ? 'in-stock' : 'out-of-stock'
                }`}
              >
                {product.countInStock > 0 ? '✓ In Stock' : '✗ Out of Stock'}
              </span>
            </div>
          </div>

          {/* Hover Action */}
          <div className={`product-action ${isHovered ? 'visible' : ''}`}>
            <button className='action-btn'>
              <svg
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
              >
                <circle cx='9' cy='21' r='1'></circle>
                <circle cx='20' cy='21' r='1'></circle>
                <path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'></path>
              </svg>
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
