'use client';

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';

import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import { useLanguage } from '../context/LanguageContext';
import './LoginRegisterScreen.css';

const RegisterScreen = () => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error(t.passwordsDoNotMatch);
    } else {
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className='auth-page'>
      <Container>
        <Row className='justify-content-center align-items-center min-vh-100'>
          <Col xs={12} sm={10} md={8} lg={6} className='auth-col'>
            <div className='auth-card'>
              <div className='auth-header'>
                <h1 className='auth-title'>{t.register}</h1>
                <p className='auth-subtitle'>アカウント作成して始めましょう</p>
              </div>

              <Form onSubmit={submitHandler} className='auth-form'>
                <Form.Group className='form-group' controlId='name'>
                  <Form.Label className='form-label'>{t.name}</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder={t.enterName}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='form-input'
                    required
                  />
                </Form.Group>

                <Form.Group className='form-group' controlId='email'>
                  <Form.Label className='form-label'>
                    {t.emailAddress}
                  </Form.Label>
                  <Form.Control
                    type='email'
                    placeholder={t.enterEmail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='form-input'
                    required
                  />
                </Form.Group>

                <Form.Group className='form-group' controlId='password'>
                  <Form.Label className='form-label'>{t.password}</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder={t.enterPassword}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='form-input'
                    required
                  />
                </Form.Group>

                <Form.Group className='form-group' controlId='confirmPassword'>
                  <Form.Label className='form-label'>
                    {t.confirmPassword}
                  </Form.Label>
                  <Form.Control
                    type='password'
                    placeholder={t.confirmPassword}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className='form-input'
                    required
                  />
                </Form.Group>

                <Button
                  disabled={isLoading}
                  type='submit'
                  className='auth-submit-btn'
                >
                  {isLoading ? <Loader /> : t.register}
                </Button>
              </Form>

              <div className='auth-footer'>
                <p className='auth-footer-text'>
                  {t.alreadyHaveAccount}{' '}
                  <Link
                    to={redirect ? `/login?redirect=${redirect}` : '/login'}
                    className='auth-link'
                  >
                    {t.login}
                  </Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterScreen;
