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

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

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
      setRating(0);
      setComment('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Container fluid className='px-0 px-md-3'>
        {' '}
        {/* Loại bỏ padding ngang thừa trên mobile */}
        {/* Nút quay lại */}
        <Link
          className='back-button d-inline-flex align-items-center mb-4'
          to='/'
        >
          <svg
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            className='me-2'
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

            {/* Tiêu đề + rating */}
            <div className='mb-5 text-center text-md-start'>
              <h1 className='page-title display-5 fw-bold mb-3'>
                {product.name}
              </h1>
              <Rating
                value={product.rating}
                text={`${product.numReviews} ${vi.reviews}`}
              />
            </div>

            {/* 2 CỘT CHÍNH - CHIẾM FULL NGANG, BẰNG NHAU */}
            <Row className='g-4 g-xl-5'>
              {' '}
              {/* Khoảng cách đều, responsive */}
              {/* CỘT TRÁI: Ảnh + Thông tin sản phẩm */}
              <Col lg={6} className='d-flex flex-column'>
                {/* Ảnh sản phẩm */}
                <div className='product-image-wrapper mb-4 flex-grow-0'>
                  <Image
                    src={product.image || '/placeholder.svg'}
                    alt={product.name}
                    fluid
                    rounded
                    className='product-detail-image'
                  />
                </div>

                {/* Card thông tin */}
                <Card className='product-info-card border-0 shadow-sm flex-grow-1'>
                  <ListGroup variant='flush'>
                    <ListGroup.Item className='p-4 border-bottom'>
                      <h5 className='text-muted text-uppercase small fw-semibold'>
                        {vi.description}
                      </h5>
                      <p className='mt-2 mb-0 text-dark'>
                        {product.description}
                      </p>
                    </ListGroup.Item>

                    <ListGroup.Item className='p-4 border-bottom'>
                      <div className='d-flex justify-content-between align-items-end'>
                        <div>
                          <div className='text-muted text-uppercase small fw-semibold'>
                            {vi.price}
                          </div>
                          <div className='product-price display-6 fw-bold mt-1'>
                            {formatPrice(product.price)}
                          </div>
                        </div>
                        <span
                          className={`stock-badge px-3 py-2 ${
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

                    {product.countInStock > 0 && (
                      <ListGroup.Item className='p-4 border-bottom'>
                        <div className='quantity-section'>
                          <label className='text-muted text-uppercase small fw-semibold d-block mb-2'>
                            {vi.quantity}
                          </label>
                          <Form.Select
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                            className='qty-select w-auto'
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Select>
                        </div>
                      </ListGroup.Item>
                    )}

                    <ListGroup.Item className='p-4'>
                      <Button
                        onClick={addToCartHandler}
                        disabled={product.countInStock === 0}
                        className='add-to-cart-btn w-100 py-3 fw-bold'
                      >
                        {vi.addToCart}
                      </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
              {/* CỘT PHẢI: Form Viết Nhận Xét */}
              <Col lg={6} className='d-flex'>
                <Card className='review-form-card border-0 shadow-sm w-100'>
                  <Card.Body className='p-4 p-xl-5'>
                    <h3 className='form-title mb-4'>{vi.writeReview}</h3>

                    {loadingProductReview && <Loader />}

                    {userInfo ? (
                      <Form onSubmit={submitHandler}>
                        <Form.Group className='mb-4' controlId='rating'>
                          <Form.Label className='form-label'>
                            {vi.rating}
                          </Form.Label>
                          <Form.Select
                            required
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            className='form-control-custom'
                          >
                            <option value=''>{vi.selectRating}</option>
                            <option value='1'>1 - Tệ</option>
                            <option value='2'>2 - Trung bình</option>
                            <option value='3'>3 - Tốt</option>
                            <option value='4'>4 - Rất tốt</option>
                            <option value='5'>5 - Xuất sắc</option>
                          </Form.Select>
                        </Form.Group>

                        <Form.Group className='mb-4' controlId='comment'>
                          <Form.Label className='form-label'>
                            {vi.comment}
                          </Form.Label>
                          <Form.Control
                            as='textarea'
                            rows={5}
                            required
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className='form-control-custom'
                            placeholder='Chia sẻ trải nghiệm của bạn...'
                          />
                        </Form.Group>

                        <Button
                          type='submit'
                          disabled={loadingProductReview}
                          className='submit-review-btn w-100 py-3 fw-bold'
                        >
                          {vi.submit}
                        </Button>
                      </Form>
                    ) : (
                      <Message variant='info'>
                        {vi.signInToReview}{' '}
                        <Link to='/login' className='text-decoration-underline'>
                          {vi.signin}
                        </Link>
                      </Message>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Phần đánh giá cũ (giữ nguyên hoặc thu gọn tùy ý) */}
            <div className='mt-5 pt-5 border-top'>
              <h2 className='section-title mb-4'>{vi.reviews}</h2>
              {product.reviews.length === 0 ? (
                <Message>{vi.noReviews}</Message>
              ) : (
                <ListGroup variant='flush'>
                  {product.reviews.map((review) => (
                    <ListGroup.Item
                      key={review._id}
                      className='review-item p-4 mb-3 border rounded'
                    >
                      <div className='d-flex justify-content-between align-items-start mb-2'>
                        <strong>{review.name}</strong>
                        <small className='text-muted'>
                          {review.createdAt.substring(0, 10)}
                        </small>
                      </div>
                      <Rating value={review.rating} />
                      <p className='mt-3 mb-0 text-muted'>{review.comment}</p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>
          </>
        )}
      </Container>
    </>
  );
};

export default ProductScreen;
