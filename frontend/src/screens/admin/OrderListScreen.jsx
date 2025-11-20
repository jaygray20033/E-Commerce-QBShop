import { Table, Button, Container } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import { Link } from 'react-router-dom';
import { vi } from '../../i18n/translations';
import { formatPrice } from '../../utils/formatPrice';
import './OrderListScreen.css';

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <Container className='order-list-container'>
      <div className='admin-section-header'>
        <h1 className='admin-section-title'>{vi.orders}</h1>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className='admin-table-wrapper'>
          <Table striped hover responsive className='admin-orders-table'>
            <thead>
              <tr>
                <th>{vi.id}</th>
                <th>{vi.user}</th>
                <th>{vi.date}</th>
                <th>{vi.total}</th>
                <th>{vi.isPaid}</th>
                <th>{vi.isDelivered}</th>
                <th>{vi.actions}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={order._id}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  className='admin-table-row'
                >
                  <td className='order-id-cell'>
                    {order._id.substring(0, 8)}...
                  </td>
                  <td className='user-name-cell'>
                    {order.user && order.user.name}
                  </td>
                  <td className='date-cell'>
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td className='total-cell'>
                    <strong>{formatPrice(order.totalPrice)}</strong>
                  </td>
                  <td className='status-cell'>
                    {order.isPaid ? (
                      <span className='status-badge status-paid'>
                        {order.paidAt.substring(0, 10)}
                      </span>
                    ) : (
                      <FaTimes className='status-icon status-unpaid' />
                    )}
                  </td>
                  <td className='status-cell'>
                    {order.isDelivered ? (
                      <span className='status-badge status-delivered'>
                        {order.deliveredAt.substring(0, 10)}
                      </span>
                    ) : (
                      <FaTimes className='status-icon status-undelivered' />
                    )}
                  </td>
                  <td className='action-cell'>
                    <Button
                      as={Link}
                      to={`/order/${order._id}`}
                      className='btn-details-order'
                    >
                      {vi.details}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default OrderListScreen;
