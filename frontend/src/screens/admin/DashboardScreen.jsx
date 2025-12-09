'use client';

import { Container, Table } from 'react-bootstrap';
import {
  FaDollarSign,
  FaShoppingCart,
  FaUsers,
  FaChartLine,
} from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetDashboardStatsQuery } from '../../slices/dashboardApiSlice';
import { formatPrice } from '../../utils/formatPrice';
import './DashboardScreen.css';

const DashboardScreen = () => {
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery();

  return (
    <Container className='dashboard-container'>
      <div className='dashboard-header'>
        <h1 className='dashboard-title'>Dashboard Admin</h1>
        <p className='dashboard-subtitle'>
          Tổng quan về doanh thu và hoạt động của hệ thống
        </p>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <div className='stats-grid'>
            <div
              className='stat-card'
              style={{ animationDelay: '0.1s' }}
            >
              <div className='stat-card-header'>
                <div className='stat-icon revenue'>
                  <FaDollarSign />
                </div>
                <p className='stat-title'>Tổng Doanh Thu</p>
              </div>
              <h2 className='stat-value'>{formatPrice(stats.totalRevenue)}</h2>
              <p className='stat-description'>Từ {stats.paidOrders} đơn hàng</p>
            </div>

            <div
              className='stat-card'
              style={{ animationDelay: '0.2s' }}
            >
              <div className='stat-card-header'>
                <div className='stat-icon orders'>
                  <FaShoppingCart />
                </div>
                <p className='stat-title'>Đơn Hàng</p>
              </div>
              <h2 className='stat-value'>{stats.totalOrders}</h2>
              <p className='stat-description'>
                {stats.deliveredOrders} đã giao
              </p>
            </div>

            <div
              className='stat-card'
              style={{ animationDelay: '0.3s' }}
            >
              <div className='stat-card-header'>
                <div className='stat-icon users'>
                  <FaUsers />
                </div>
                <p className='stat-title'>Người Dùng</p>
              </div>
              <h2 className='stat-value'>{stats.totalUsers}</h2>
              <p className='stat-description'>
                +{stats.newUsersLastWeek} tuần này
              </p>
            </div>

            <div
              className='stat-card'
              style={{ animationDelay: '0.4s' }}
            >
              <div className='stat-card-header'>
                <div className='stat-icon products'>
                  <FaChartLine />
                </div>
                <p className='stat-title'>Tăng Trưởng</p>
              </div>
              <h2 className='stat-value'>
                {stats.newUsersLastWeek > 0 ? '+' : ''}
                {stats.newUsersLastWeek}
              </h2>
              <p className='stat-description'>Người dùng mới 7 ngày qua</p>
            </div>
          </div>

          <div className='charts-section'>
            <div className='chart-card'>
              <h3 className='chart-title'>Doanh Thu 30 Ngày Gần Đây</h3>
              <div className='chart-container'>
                {stats.revenueByDay && stats.revenueByDay.length > 0 ? (
                  <div style={{ width: '100%', padding: '1rem' }}>
                    {stats.revenueByDay.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '0.5rem 0',
                          borderBottom: '1px solid #f0f0f0',
                        }}
                      >
                        <span style={{ fontSize: '0.85rem', color: '#666' }}>
                          {new Date(item._id).toLocaleDateString('vi-VN')}
                        </span>
                        <span
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: '#667eea',
                          }}
                        >
                          {formatPrice(item.revenue)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  'Chưa có dữ liệu doanh thu'
                )}
              </div>
            </div>

            <div className='chart-card'>
              <h3 className='chart-title'>Tăng Trưởng Người Dùng</h3>
              <div className='chart-container'>
                {stats.userGrowth && stats.userGrowth.length > 0 ? (
                  <div style={{ width: '100%', padding: '1rem' }}>
                    {stats.userGrowth.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '0.5rem 0',
                          borderBottom: '1px solid #f0f0f0',
                        }}
                      >
                        <span style={{ fontSize: '0.85rem', color: '#666' }}>
                          {new Date(item._id).toLocaleDateString('vi-VN')}
                        </span>
                        <span
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: '#ff9800',
                          }}
                        >
                          +{item.count} người dùng
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  'Chưa có dữ liệu người dùng mới'
                )}
              </div>
            </div>
          </div>

          <div className='tables-section'>
            <div className='table-card'>
              <div className='table-card-header'>
                <h3 className='table-card-title'>
                  Top 5 Sản Phẩm Bán Chạy
                </h3>
              </div>
              <div className='table-card-body'>
                {stats.topProducts && stats.topProducts.length > 0 ? (
                  <Table striped hover responsive className='dashboard-table'>
                    <thead>
                      <tr>
                        <th>Sản Phẩm</th>
                        <th>Số Lượng</th>
                        <th>Doanh Thu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.topProducts.map((product, index) => (
                        <tr key={product._id || index}>
                          <td className='product-name'>{product.name}</td>
                          <td>{product.totalQuantity}</td>
                          <td className='revenue-value'>
                            {formatPrice(product.totalRevenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div style={{ padding: '2rem', textAlign: 'center' }}>
                    Chưa có dữ liệu sản phẩm
                  </div>
                )}
              </div>
            </div>

            <div className='table-card'>
              <div className='table-card-header'>
                <h3 className='table-card-title'>Đơn Hàng Gần Đây</h3>
              </div>
              <div className='table-card-body'>
                {stats.recentOrders && stats.recentOrders.length > 0 ? (
                  <Table striped hover responsive className='dashboard-table'>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Khách Hàng</th>
                        <th>Tổng Tiền</th>
                        <th>Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map((order, index) => (
                        <tr key={order._id || index}>
                          <td className='order-id'>
                            {order._id.substring(0, 8)}...
                          </td>
                          <td>{order.user?.name || 'N/A'}</td>
                          <td className='revenue-value'>
                            {formatPrice(order.totalPrice)}
                          </td>
                          <td>
                            <span
                              className={`order-status ${
                                order.isPaid ? 'paid' : 'unpaid'
                              }`}
                            >
                              {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div style={{ padding: '2rem', textAlign: 'center' }}>
                    Chưa có đơn hàng
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </Container>
  );
};

export default DashboardScreen;
