'use client';

import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';
import { useLanguage } from '../context/LanguageContext';
import { FaArrowLeft } from 'react-icons/fa';
import './PaymentScreen.css';

const PaymentScreen = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const [paymentMethod, setPaymentMethod] = useState('VNPay');
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className='payment-container'>
      <div className='payment-header'>
        <button className='back-button' onClick={() => navigate('/shipping')}>
          <FaArrowLeft /> {t.goBack}
        </button>
        <div>
          <h1 className='page-title'>{t.paymentMethod}</h1>
        </div>
      </div>

      <CheckoutSteps step1 step2 step3 />

      <div className='payment-form-wrapper'>
        <div className='payment-form-card'>
          <form onSubmit={submitHandler}>
            <div className='payment-options'>
              <label className='form-label'>{t.selectMethod}</label>

              <div className='radio-group'>
                <label className='radio-option'>
                  <input
                    type='radio'
                    name='paymentMethod'
                    value='VNPay'
                    checked={paymentMethod === 'VNPay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className='radio-label-text'>{t.vnpay}</span>
                </label>
              </div>
            </div>

            <Button type='submit' className='submit-btn'>
              {t.continue}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentScreen;
