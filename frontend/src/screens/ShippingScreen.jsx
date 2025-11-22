'use client';

import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../slices/cartSlice';
import { vi } from '../i18n/translations';
import { FaArrowLeft } from 'react-icons/fa';
import './ShippingScreen.css';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [country, setCountry] = useState(shippingAddress.country || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <div className='shipping-container'>
      <div className='shipping-header'>
        <button className='back-button' onClick={() => navigate('/cart')}>
          <FaArrowLeft /> {vi.goBack}
        </button>
        <div>
          <h1 className='page-title'>{vi.shipping}</h1>
        </div>
      </div>

      <CheckoutSteps step1 step2 />

      <div className='shipping-form-wrapper'>
        <div className='shipping-form-card'>
          <form onSubmit={submitHandler}>
            <div className='form-group-custom'>
              <label className='form-label'>{vi.address}</label>
              <input
                type='text'
                placeholder={vi.enterAddress}
                value={address}
                required
                onChange={(e) => setAddress(e.target.value)}
                className='form-input'
              />
            </div>

            <div className='form-group-custom'>
              <label className='form-label'>{vi.city}</label>
              <input
                type='text'
                placeholder={vi.enterCity}
                value={city}
                required
                onChange={(e) => setCity(e.target.value)}
                className='form-input'
              />
            </div>

            <div className='form-group-custom'>
              <label className='form-label'>{vi.postalCode}</label>
              <input
                type='text'
                placeholder={vi.enterPostalCode}
                value={postalCode}
                required
                onChange={(e) => setPostalCode(e.target.value)}
                className='form-input'
              />
            </div>

            <div className='form-group-custom'>
              <label className='form-label'>{vi.country}</label>
              <input
                type='text'
                placeholder={vi.enterCountry}
                value={country}
                required
                onChange={(e) => setCountry(e.target.value)}
                className='form-input'
              />
            </div>

            <Button type='submit' className='submit-btn'>
              {vi.continue}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShippingScreen;
