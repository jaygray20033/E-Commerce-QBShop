'use client';

import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Image, Form, Button, Card } from 'react-bootstrap';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/formatPrice';
import './CartScreen.css';

const CartScreen = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div className='cart-container'>
      <div className='cart-header'>
        <button className='back-button' onClick={() => navigate('/')}>
          <FaArrowLeft /> {t.goBack}
        </button>
        <div>
          <h1 className='page-title'>{t.shoppingCart}</h1>
        </div>
      </div>

      <Row className='cart-content'>
        <Col lg={8} className='cart-items-column'>
          {cartItems.length === 0 ? (
            <div className='empty-cart'>
              <Message>
                {t.emptyCart} <Link to='/'>{t.goBack}</Link>
              </Message>
            </div>
          ) : (
            <div className='cart-items'>
              {cartItems.map((item, index) => (
                <div
                  key={item._id}
                  className='cart-item-card'
                  style={{ animationDelay: `${index * 0.1}s` }}
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
                    <Col md={4}>
                      <Link to={`/product/${item._id}`} className='item-name'>
                        {item.name}
                      </Link>
                    </Col>
                    <Col md={2} className='item-price'>
                      {formatPrice(item.price)}
                    </Col>
                    <Col md={2}>
                      <Form.Control
                        as='select'
                        value={item.qty}
                        onChange={(e) =>
                          addToCartHandler(item, Number(e.target.value))
                        }
                        className='qty-select'
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={2}>
                      <Button
                        type='button'
                        className='delete-btn'
                        onClick={() => removeFromCartHandler(item._id)}
                      >
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          )}
        </Col>

        <Col lg={4} className='cart-summary-column'>
          <Card className='cart-summary-card'>
            <Card.Body>
              <h2 className='summary-title'>{t.orderSummary}</h2>
              <div className='summary-item'>
                <span>{t.subtotal}</span>
                <span className='summary-value'>
                  {formatPrice(
                    cartItems.reduce(
                      (acc, item) => acc + item.qty * item.price,
                      0
                    )
                  )}
                </span>
              </div>
              <div className='summary-item'>
                <span>{t.items}</span>
                <span className='summary-value'>
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              </div>
              <div className='summary-divider'></div>
              <div className='summary-total'>
                <span>{t.total}</span>
                <span className='total-price'>
                  {formatPrice(
                    cartItems.reduce(
                      (acc, item) => acc + item.qty * item.price,
                      0
                    )
                  )}
                </span>
              </div>
              <Button
                type='button'
                className='checkout-btn'
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                {t.proceedCheckout}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CartScreen;
