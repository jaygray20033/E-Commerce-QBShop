'use client';

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from '../../slices/usersApiSlice';
import { vi } from '../../i18n/translations';
import './UserEditScreen.css';

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ userId, name, email, isAdmin });
      toast.success(vi.userUpdated);
      refetch();
      navigate('/admin/userlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  return (
    <>
      <Link to='/admin/userlist' className='user-edit-back-button'>
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

      <div className='user-edit-container'>
        <div className='user-edit-header'>
          <h1 className='edit-title'>{vi.editUser}</h1>
          <p className='edit-subtitle'>{vi.updateUserInformation}</p>
        </div>

        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <form onSubmit={submitHandler} className='edit-form'>
            <div className='form-group'>
              <label htmlFor='name' className='form-label'>
                {vi.name}
              </label>
              <input
                id='name'
                type='text'
                placeholder={vi.enterName}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='form-input'
              />
            </div>

            <div className='form-group'>
              <label htmlFor='email' className='form-label'>
                {vi.email}
              </label>
              <input
                id='email'
                type='email'
                placeholder={vi.enterEmail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='form-input'
              />
            </div>

            <div className='form-group checkbox-group'>
              <label htmlFor='isadmin' className='checkbox-label'>
                <input
                  id='isadmin'
                  type='checkbox'
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className='checkbox-input'
                />
                <span>{vi.isAdmin}</span>
              </label>
            </div>

            <button type='submit' className='submit-button'>
              {vi.update}
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default UserEditScreen;
