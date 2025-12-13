'use client';

import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Row, Col, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowLeft } from 'react-icons/fa';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/formatPrice';
import './PlaceOrderScreen.css';

const PlaceOrderScreen = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div className='placeorder-container'>
      <div className='placeorder-header'>
        <button className='back-button' onClick={() => navigate('/payment')}>
          <FaArrowLeft /> {t.goBack}
        </button>
        <div>
          <h1 className='page-title'>{t.orderSummary}</h1>
        </div>
      </div>

      <CheckoutSteps step1 step2 step3 step4 />

      <Row className='placeorder-content'>
        <Col lg={8}>
          <div className='placeorder-details'>
            <div className='detail-card'>
              <h2 className='detail-title'>{t.shipping}</h2>
              <div className='detail-content'>
                <p>
                  <strong>{t.address}:</strong> {cart.shippingAddress.address},
                  {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{' '}
                  {cart.shippingAddress.country}
                </p>
              </div>
            </div>

            <div className='detail-card'>
              <h2 className='detail-title'>{t.paymentMethod}</h2>
              <div className='detail-content'>
                <p>
                  <strong>{t.method}:</strong> {cart.paymentMethod}
                </p>
              </div>
            </div>

            <div className='detail-card'>
              <h2 className='detail-title'>{t.orderItems}</h2>
              <div className='order-items-list'>
                {cart.cartItems.length === 0 ? (
                  <Message>{t.emptyCart}</Message>
                ) : (
                  cart.cartItems.map((item, index) => (
                    <div
                      key={index}
                      className='order-item'
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <Row className='align-items-center'>
                        <Col md={2}>
                          <Image
                            src={item.image || '/placeholder.svg'}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col md={5}>
                          <Link
                            to={`/product/${item.product}`}
                            className='item-link'
                          >
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={5}>
                          <div className='item-pricing'>
                            {item.qty} × {formatPrice(item.price)} ={' '}
                            <strong>
                              {formatPrice(item.qty * item.price)}
                            </strong>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </Col>

        <Col lg={4}>
          <Card className='order-summary-card'>
            <Card.Body>
              <h2 className='summary-title'>{t.orderSummary}</h2>

              <div className='summary-row'>
                <span>{t.items}</span>
                <span className='summary-value'>
                  {formatPrice(cart.itemsPrice)}
                </span>
              </div>

              <div className='summary-row'>
                <span>{t.shipping}</span>
                <span className='summary-value'>
                  {formatPrice(cart.shippingPrice)}
                </span>
              </div>

              <div className='summary-row'>
                <span>{t.tax}</span>
                <span className='summary-value'>
                  {formatPrice(cart.taxPrice)}
                </span>
              </div>

              <div className='summary-divider'></div>

              <div className='summary-total'>
                <span>{t.total}</span>
                <span className='total-amount'>
                  {formatPrice(cart.totalPrice)}
                </span>
              </div>

              {error && (
                <Message variant='danger' className='mt-3'>
                  {error.data?.message || error.message}
                </Message>
              )}

              <Button
                type='button'
                className='place-order-btn'
                disabled={cart.cartItems.length === 0 || isLoading}
                onClick={placeOrderHandler}
              >
                {isLoading ? <Loader /> : t.placeOrder}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlaceOrderScreen;
