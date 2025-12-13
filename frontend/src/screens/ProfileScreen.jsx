'use client';

import { useEffect, useState } from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaTimes,
  FaUser,
  FaEnvelope,
  FaLock,
  FaCheckCircle,
} from 'react-icons/fa';

import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useProfileMutation } from '../slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/formatPrice';
import './ProfileScreen.css';

const ProfileScreen = () => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { userInfo } = useSelector((state) => state.auth);

  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.name]);

  const dispatch = useDispatch();
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Mật khẩu không trùng khớp');
    } else {
      try {
        const res = await updateProfile({
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success('Hồ sơ đã được cập nhật thành công');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className='profile-container'>
      <div className='profile-header'>
        <div className='profile-header-content'>
          <h1 className='profile-title'>{t.userProfile}</h1>
          <p className='profile-subtitle'>{t.manageAccountInfo}</p>
        </div>
        <div className='profile-user-badge'>
          <FaUser className='badge-icon' />
          <span>{userInfo.name}</span>
        </div>
      </div>

      <div className='profile-content'>
        <div className='profile-section'>
          <div className='profile-form-card'>
            <div className='form-header'>
              <h2>{t.userProfile}</h2>
              <div className='form-header-line'></div>
            </div>

            <Form onSubmit={submitHandler} className='profile-form'>
              <Form.Group className='form-group-custom' controlId='name'>
                <Form.Label className='form-label-custom'>
                  <FaUser className='label-icon' /> {t.name}
                </Form.Label>
                <Form.Control
                  type='text'
                  placeholder={t.enterName}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='form-control-custom'
                ></Form.Control>
              </Form.Group>

              <Form.Group className='form-group-custom' controlId='email'>
                <Form.Label className='form-label-custom'>
                  <FaEnvelope className='label-icon' /> {t.emailAddress}
                </Form.Label>
                <Form.Control
                  type='email'
                  placeholder={t.enterEmail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='form-control-custom'
                ></Form.Control>
              </Form.Group>

              <Form.Group className='form-group-custom' controlId='password'>
                <Form.Label className='form-label-custom'>
                  <FaLock className='label-icon' /> {t.password}
                </Form.Label>
                <Form.Control
                  type='password'
                  placeholder={t.enterPassword}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='form-control-custom'
                ></Form.Control>
              </Form.Group>

              <Form.Group
                className='form-group-custom'
                controlId='confirmPassword'
              >
                <Form.Label className='form-label-custom'>
                  <FaLock className='label-icon' /> {t.confirmPassword}
                </Form.Label>
                <Form.Control
                  type='password'
                  placeholder={t.confirmPassword}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className='form-control-custom'
                ></Form.Control>
              </Form.Group>

              <Button type='submit' className='btn-update-profile'>
                {loadingUpdateProfile ? (
                  <>
                    <Loader />
                  </>
                ) : (
                  <>
                    <FaCheckCircle /> {t.update}
                  </>
                )}
              </Button>
            </Form>
          </div>
        </div>

        <div className='orders-section'>
          <div className='orders-card'>
            <div className='orders-header'>
              <h2>{t.myOrders}</h2>
              <div className='orders-header-line'></div>
            </div>

            {isLoading ? (
              <Loader />
            ) : error ? (
              <Message variant='danger'>
                {error?.data?.message || error.error}
              </Message>
            ) : orders.length === 0 ? (
              <div className='empty-orders'>
                <p>{t.noOrders}</p>
              </div>
            ) : (
              <div className='orders-table-container'>
                <Table striped hover responsive className='orders-table'>
                  <thead>
                    <tr>
                      <th>{t.id}</th>
                      <th>{t.date}</th>
                      <th>{t.total}</th>
                      <th>{t.paid}</th>
                      <th>{t.delivered}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr
                        key={order._id}
                        style={{ animationDelay: `${index * 0.05}s` }}
                        className='order-row'
                      >
                        <td className='order-id'>
                          {order._id.substring(0, 8)}...
                        </td>
                        <td className='order-date'>
                          {order.createdAt.substring(0, 10)}
                        </td>
                        <td className='order-total'>
                          {formatPrice(order.totalPrice)}
                        </td>
                        <td>
                          {order.isPaid ? (
                            <span className='status-badge paid'>
                              {order.paidAt.substring(0, 10)}
                            </span>
                          ) : (
                            <FaTimes style={{ color: 'red' }} />
                          )}
                        </td>
                        <td>
                          {order.isDelivered ? (
                            <span className='status-badge delivered'>
                              {order.deliveredAt.substring(0, 10)}
                            </span>
                          ) : (
                            <FaTimes style={{ color: 'red' }} />
                          )}
                        </td>
                        <td>
                          <Button
                            as={Link}
                            to={`/order/${order._id}`}
                            className='btn-details'
                          >
                            {t.details}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
