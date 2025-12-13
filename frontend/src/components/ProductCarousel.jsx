import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';
import { formatPrice } from '../utils/formatPrice';
import { useLanguage } from '../context/LanguageContext';
import './ProductCarousel.css';

const ProductCarousel = () => {
  const { t } = useLanguage();
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  return isLoading ? null : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <div className='carousel-wrapper'>
      <Carousel pause='hover' className='modern-carousel'>
        {products.map((product, index) => (
          <Carousel.Item key={product._id} className='carousel-item-animated'>
            <Link to={`/product/${product._id}`} className='carousel-link'>
              <div className='carousel-content'>
                {/* Left side - Product Image */}
                <div className='carousel-image-container'>
                  <div className='carousel-image-wrapper'>
                    <Image
                      src={product.image || '/placeholder.svg'}
                      alt={product.name}
                      className='carousel-image'
                    />
                    <div className='carousel-image-overlay'></div>
                  </div>
                </div>

                {/* Right side - Product Info */}
                <div className='carousel-info-container'>
                  <div className='carousel-info-content'>
                    <span className='carousel-badge'>{t.featuredProduct}</span>
                    <h1 className='carousel-title'>{product.name}</h1>
                    <p className='carousel-description'>
                      {product.description}
                    </p>

                    <div className='carousel-details'>
                      <div className='carousel-rating'>
                        <span className='carousel-stars'>★★★★★</span>
                        <span className='carousel-reviews'>
                          ({product.numReviews} {t.reviews.toLowerCase()})
                        </span>
                      </div>
                      <div className='carousel-price-section'>
                        <span className='carousel-price-label'>{t.price}:</span>
                        <span className='carousel-price'>
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    </div>

                    <button className='carousel-cta-button'>
                      {t.viewProduct}
                      <svg
                        width='20'
                        height='20'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                      >
                        <polyline points='9 18 15 12 9 6'></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default ProductCarousel;
