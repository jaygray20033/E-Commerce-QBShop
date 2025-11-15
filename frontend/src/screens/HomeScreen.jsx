'use client';

import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import { vi } from '../i18n/translations';
import './HomeScreen.css';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to='/' className='back-button'>
          <svg
            width='18'
            height='18'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
          >
            <polyline points='15 18 9 12 15 6'></polyline>
          </svg>
          {vi.goBack}
        </Link>
      )}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta />

          <div className='home-header'>
            <div className='header-content'>
              <h1 className='page-title'>{vi.latestProducts}</h1>
            </div>
            <div className='product-count'>
              Showing {data.products.length} of {data.total || 'multiple'}{' '}
              products
            </div>
          </div>

          <div className='products-grid-container'>
            <Row className='products-grid'>
              {data.products.map((product, index) => (
                <Col
                  key={product._id}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  className='product-grid-item'
                >
                  <div
                    className='product-grid-item-inner'
                    style={{
                      animationDelay: `${index * 0.05}s`,
                    }}
                  >
                    <ProductCard product={product} />
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ''}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
