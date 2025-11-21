'use client';

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { formatPrice } from '../utils/formatPrice';
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetVNPayConfigQuery,
} from '../slices/ordersApiSlice';
import { vi } from '../i18n/translations';
import './OrderScreen.css';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const [isProcessingVNPay, setIsProcessingVNPay] = useState(false);

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: vnpayConfig,
    isLoading: loadingVNPayConfig,
    error: errorVNPayConfig,
  } = useGetVNPayConfigQuery();

  useEffect(() => {
    setIsProcessingVNPay(false);
  }, [orderId]);

  const handleVNPayPayment = async () => {
    if (!order || order.isPaid) {
      toast.error('Không thể thanh toán đơn hàng này');
      return;
    }

    setIsProcessingVNPay(true);

    try {
      // Call backend to create VNPay payment URL
      const response = await fetch('/api/orders/' + orderId + '/vnpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: order.totalPrice,
          orderInfo: `Payment for order ${orderId}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi tạo URL thanh toán');
      }

      // Redirect to VNPay payment page
      window.location.href = data.paymentUrl;
    } catch (err) {
      toast.error(err.message || 'Lỗi khi xử lý thanh toán');
      setIsProcessingVNPay(false);
    }
  };

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error.data.message}</Message>
  ) : (
    <>
      <Link to='/orders' className='order-back-button'>
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

      <div className='order-container'>
        <div className='order-header'>
          <h1 className='order-title'>
            {vi.paymentInfo} <span>{order._id}</span>
          </h1>
        </div>

        <div className='order-content'>
          {/* Left Column - Order Details */}
          <div className='order-details-section'>
            {/* Shipping Info Card */}
            <div className='info-card'>
              <div className='card-header'>
                <h2 className='card-title'>{vi.shipping}</h2>
              </div>
              <div className='card-content'>
                <div className='info-row'>
                  <strong>{vi.login}:</strong>
                  <span>{order.user.name}</span>
                </div>
                <div className='info-row'>
                  <strong>Email:</strong>
                  <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                </div>
                <div className='info-row'>
                  <strong>{vi.address}:</strong>
                  <span>
                    {order.shippingAddress.address},{' '}
                    {order.shippingAddress.city}{' '}
                    {order.shippingAddress.postalCode},{' '}
                    {order.shippingAddress.country}
                  </span>
                </div>
                <div className='status-row'>
                  {order.isDelivered ? (
                    <div className='status-badge success'>
                      ✓ {vi.delivered}: {order.deliveredAt}
                    </div>
                  ) : (
                    <div className='status-badge danger'>
                      ✕ {vi.notDelivered}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className='info-card'>
              <div className='card-header'>
                <h2 className='card-title'>{vi.paymentMethod}</h2>
              </div>
              <div className='card-content'>
                <div className='info-row'>
                  <strong>{vi.method}:</strong>
                  <span>{order.paymentMethod}</span>
                </div>
                <div className='status-row'>
                  {order.isPaid ? (
                    <div className='status-badge success'>
                      ✓ {vi.paid}: {order.paidAt}
                    </div>
                  ) : (
                    <div className='status-badge danger'>✕ {vi.notPaid}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items Card */}
            <div className='info-card'>
              <div className='card-header'>
                <h2 className='card-title'>{vi.orderItems}</h2>
              </div>
              <div className='card-content'>
                {order.orderItems.length === 0 ? (
                  <Message>{vi.orderIsEmpty}</Message>
                ) : (
                  <div className='items-list'>
                    {order.orderItems.map((item, index) => (
                      <div key={index} className='item-row'>
                        <img
                          src={item.image || '/placeholder.svg'}
                          alt={item.name}
                          className='item-image'
                        />
                        <div className='item-details'>
                          <Link
                            to={`/product/${item.product}`}
                            className='item-name'
                          >
                            {item.name}
                          </Link>
                          <p className='item-quantity'>
                            {item.qty} x {formatPrice(item.price)}
                          </p>
                        </div>
                        <div className='item-price'>
                          {formatPrice(item.qty * item.price)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className='order-summary-section'>
            <div className='summary-card'>
              <div className='card-header'>
                <h2 className='card-title'>{vi.orderSummary}</h2>
              </div>
              <div className='card-content'>
                <div className='summary-row'>
                  <span>{vi.items}</span>
                  <strong>{formatPrice(order.itemsPrice)}</strong>
                </div>
                <div className='summary-row'>
                  <span>{vi.shipping}</span>
                  <strong>{formatPrice(order.shippingPrice)}</strong>
                </div>
                <div className='summary-row'>
                  <span>{vi.tax}</span>
                  <strong>{formatPrice(order.taxPrice)}</strong>
                </div>
                <div className='summary-divider'></div>
                <div className='summary-row total'>
                  <span>{vi.total}</span>
                  <strong>{formatPrice(order.totalPrice)}</strong>
                </div>

                {!order.isPaid && (
                  <button
                    type='button'
                    className='action-button payment'
                    onClick={handleVNPayPayment}
                    disabled={isProcessingVNPay}
                  >
                    {isProcessingVNPay ? 'Đang xử lý...' : 'Thanh Toán VNPay'}
                  </button>
                )}

                {userInfo &&
                  userInfo.isAdmin &&
                  order.isPaid &&
                  !order.isDelivered && (
                    <button
                      type='button'
                      className='action-button deliver'
                      onClick={deliverHandler}
                      disabled={loadingDeliver}
                    >
                      {loadingDeliver ? 'Đang cập nhật...' : vi.markAsDelivered}
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderScreen;
