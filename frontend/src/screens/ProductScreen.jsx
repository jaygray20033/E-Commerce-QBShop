'use client';

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
  Container,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from '../slices/productsApiSlice';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { addToCart } from '../slices/cartSlice';
import { vi } from '../i18n/translations';
import { formatPrice } from '../utils/formatPrice';
import './ProductScreen.css';

const ProductScreen = () => {
  const { id: productId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success('Nhận xét đã được tạo thành công');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Container>
        <Link className='back-button' to='/'>
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
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <>
            <Meta title={product.name} description={product.description} />

            <div className='product-details-header'>
              <h1 className='page-title'>{product.name}</h1>
              <Rating
                value={product.rating}
                text={`${product.numReviews} ${vi.reviews}`}
              />
            </div>

            <Row className='product-details-container'>
              <Col md={6} className='product-image-col'>
                <div className='product-image-wrapper'>
                  <Image
                    src={product.image || '/placeholder.svg'}
                    alt={product.name}
                    fluid
                    className='product-detail-image'
                  />
                </div>
              </Col>
              <Col md={6} className='product-info-col'>
                <Card className='product-info-card'>
                  <ListGroup variant='flush'>
                    <ListGroup.Item className='info-item'>
                      <div className='info-label'>{vi.description}</div>
                      <p className='info-description'>{product.description}</p>
                    </ListGroup.Item>
                    <ListGroup.Item className='info-item'>
                      <div className='price-section'>
                        <div className='info-label'>{vi.price}</div>
                        <div className='product-price'>
                          {formatPrice(product.price)}
                        </div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className='info-item'>
                      <div className='stock-section'>
                        <div className='info-label'>{vi.countInStock}</div>
                        <span
                          className={`stock-badge ${
                            product.countInStock > 0
                              ? 'in-stock'
                              : 'out-of-stock'
                          }`}
                        >
                          {product.countInStock > 0
                            ? vi.inStock
                            : vi.outOfStock}
                        </span>
                      </div>
                    </ListGroup.Item>

                    {/* Qty Select */}
                    {product.countInStock > 0 && (
                      <ListGroup.Item className='info-item'>
                        <div className='quantity-section'>
                          <label className='info-label'>{vi.quantity}</label>
                          <Form.Control
                            as='select'
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                            className='qty-select'
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </div>
                      </ListGroup.Item>
                    )}

                    <ListGroup.Item className='info-item action-item'>
                      <Button
                        className='add-to-cart-btn'
                        type='button'
                        disabled={product.countInStock === 0}
                        onClick={addToCartHandler}
                      >
                        {vi.addToCart}
                      </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
            </Row>

            <div className='reviews-section'>
              <div className='reviews-header'>
                <h2 className='section-title'>{vi.reviews}</h2>
              </div>
              <Row>
                <Col md={6}>
                  <div className='reviews-list'>
                    {product.reviews.length === 0 && (
                      <Message>{vi.noReviews}</Message>
                    )}
                    <ListGroup variant='flush' className='reviews-listgroup'>
                      {product.reviews.map((review) => (
                        <ListGroup.Item
                          key={review._id}
                          className='review-item'
                        >
                          <div className='review-header'>
                            <strong className='review-author'>
                              {review.name}
                            </strong>
                            <span className='review-date'>
                              {review.createdAt.substring(0, 10)}
                            </span>
                          </div>
                          <Rating value={review.rating} />
                          <p className='review-text'>{review.comment}</p>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                </Col>
                <Col md={6}>
                  <Card className='review-form-card'>
                    <Card.Body>
                      <h3 className='form-title'>{vi.writeReview}</h3>

                      {loadingProductReview && <Loader />}

                      {userInfo ? (
                        <Form onSubmit={submitHandler}>
                          <Form.Group className='form-group' controlId='rating'>
                            <Form.Label className='form-label'>
                              {vi.rating}
                            </Form.Label>
                            <Form.Control
                              as='select'
                              required
                              value={rating}
                              onChange={(e) => setRating(e.target.value)}
                              className='form-control-custom'
                            >
                              <option value=''>{vi.selectRating}</option>
                              <option value='1'>1 - Tệ</option>
                              <option value='2'>2 - Trung Bình</option>
                              <option value='3'>3 - Tốt</option>
                              <option value='4'>4 - Rất Tốt</option>
                              <option value='5'>5 - Xuất Sắc</option>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group
                            className='form-group'
                            controlId='comment'
                          >
                            <Form.Label className='form-label'>
                              {vi.comment}
                            </Form.Label>
                            <Form.Control
                              as='textarea'
                              row='3'
                              required
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              className='form-control-custom'
                            ></Form.Control>
                          </Form.Group>
                          <Button
                            disabled={loadingProductReview}
                            type='submit'
                            className='submit-review-btn'
                          >
                            {vi.submit}
                          </Button>
                        </Form>
                      ) : (
                        <Message>
                          {vi.signInToReview}{' '}
                          <Link to='/login'>{vi.signin}</Link>
                        </Message>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          </>
        )}
      </Container>
    </>
  );
};

export default ProductScreen;
