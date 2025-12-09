import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import { resetCart } from '../slices/cartSlice';
import { vi } from '../i18n/translations';
import './Header.css';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      setDropdownOpen(false);
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleDropdown = (e) => {
    e.preventDefault();
    setDropdownOpen(!dropdownOpen);
  };

  const handleNavigateToProfile = (e) => {
    e.preventDefault();
    setDropdownOpen(false);
    navigate('/profile');
  };

  const handleNavigateToDashboard = (e) => {
    e.preventDefault();
    setDropdownOpen(false);
    navigate('/admin/dashboard');
  };

  const handleNavigateToProductList = (e) => {
    e.preventDefault();
    setDropdownOpen(false);
    navigate('/admin/productlist');
  };

  const handleNavigateToOrderList = (e) => {
    e.preventDefault();
    setDropdownOpen(false);
    navigate('/admin/orderlist');
  };

  const handleNavigateToUserList = (e) => {
    e.preventDefault();
    setDropdownOpen(false);
    navigate('/admin/userlist');
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logoutHandler();
  };

  return (
    <header className='modern-header'>
      <div className='header-container'>
        {/* Logo Section */}
        <div className='header-logo'>
          <Link to='/' className='logo-link'>
            <div className='logo-icon'>Q</div>
            <span className='logo-text'>quyetbui</span>
          </Link>
        </div>

        {/* Search Section */}
        <div className='header-search'>
          <SearchBox />
        </div>

        {/* Right Actions */}
        <div className='header-actions'>
          {/* Cart */}
          <Link to='/cart' className='header-action-item cart-link'>
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <circle cx='9' cy='21' r='1'></circle>
              <circle cx='20' cy='21' r='1'></circle>
              <path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'></path>
            </svg>
            {cartItems.length > 0 && (
              <span className='cart-badge'>
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </Link>

          {/* Auth Section */}
          {userInfo ? (
            <div className='header-user-menu' ref={dropdownRef}>
              <button
                className='header-action-item user-button'
                onClick={handleToggleDropdown}
                type='button'
              >
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path>
                  <circle cx='12' cy='7' r='4'></circle>
                </svg>
                <span className='user-name'>{userInfo.name}</span>
              </button>

              {dropdownOpen && (
                <div className='dropdown-menu-content'>
                  <button
                    onClick={handleNavigateToProfile}
                    className='dropdown-item'
                  >
                    {vi.profile}
                  </button>
                  {userInfo.isAdmin && (
                    <>
                      <hr className='dropdown-divider' />
                      <button
                        onClick={handleNavigateToDashboard}
                        className='dropdown-item'
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={handleNavigateToProductList}
                        className='dropdown-item'
                      >
                        {vi.products}
                      </button>
                      <button
                        onClick={handleNavigateToOrderList}
                        className='dropdown-item'
                      >
                        {vi.orders}
                      </button>
                      <button
                        onClick={handleNavigateToUserList}
                        className='dropdown-item'
                      >
                        {vi.users}
                      </button>
                      <hr className='dropdown-divider' />
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className='dropdown-item logout'
                  >
                    {vi.logout}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to='/login' className='header-action-item login-link'>
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
              >
                <path d='M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4'></path>
                <polyline points='10 17 15 12 10 7'></polyline>
                <line x1='15' y1='12' x2='3' y2='12'></line>
              </svg>
              {vi.signin}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
