'use client';

import { useState, useMemo } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Form,
  Button,
  Badge,
  InputGroup,
} from 'react-bootstrap';
import {
  FaBoxOpen,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaEdit,
  FaSave,
  FaTimes,
  FaWarehouse,
  FaDollarSign,
  FaUndo,
} from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useGetInventoryQuery,
  useUpdateStockMutation,
  useUpdateBulkStockMutation,
} from '../../slices/productsApiSlice';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/formatPrice';
import { toast } from 'react-toastify';
import './DashboardScreen.css';

const DashboardScreen = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editStock, setEditStock] = useState(0);
  const [bulkMode, setBulkMode] = useState(false);
  const [stockChanges, setStockChanges] = useState({});

  const { data, isLoading, error, refetch } = useGetInventoryQuery();
  const [updateStock, { isLoading: updating }] = useUpdateStockMutation();
  const [updateBulkStock, { isLoading: bulkUpdating }] =
    useUpdateBulkStockMutation();

  const filteredProducts = useMemo(() => {
    if (!data?.products) return [];

    return data.products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const currentStock =
        bulkMode && stockChanges[product._id] !== undefined
          ? stockChanges[product._id]
          : product.countInStock;

      let matchesFilter = true;
      if (filterStatus === 'outOfStock') {
        matchesFilter = currentStock === 0;
      } else if (filterStatus === 'lowStock') {
        matchesFilter = currentStock > 0 && currentStock <= 10;
      } else if (filterStatus === 'inStock') {
        matchesFilter = currentStock > 10;
      }

      return matchesSearch && matchesFilter;
    });
  }, [data?.products, searchTerm, filterStatus, bulkMode, stockChanges]);

  // Single edit handlers
  const handleEditClick = (product) => {
    if (bulkMode) return;
    setEditingId(product._id);
    setEditStock(product.countInStock);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditStock(0);
  };

  const handleSaveStock = async (productId) => {
    try {
      await updateStock({ productId, countInStock: editStock }).unwrap();
      toast.success(t.stockUpdated);
      setEditingId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  // Bulk edit handlers
  const toggleBulkMode = () => {
    if (bulkMode) {
      setStockChanges({});
    }
    setBulkMode(!bulkMode);
    setEditingId(null);
  };

  const handleBulkStockChange = (productId, newValue) => {
    const product = data.products.find((p) => p._id === productId);
    const originalStock = product?.countInStock || 0;
    const newStock = parseInt(newValue) || 0;

    if (newStock === originalStock) {
      const updated = { ...stockChanges };
      delete updated[productId];
      setStockChanges(updated);
    } else {
      setStockChanges((prev) => ({ ...prev, [productId]: newStock }));
    }
  };

  const getCurrentStock = (product) => {
    if (bulkMode && stockChanges[product._id] !== undefined) {
      return stockChanges[product._id];
    }
    return product.countInStock;
  };

  const handleSaveBulk = async () => {
    if (Object.keys(stockChanges).length === 0) {
      toast.info('Không có thay đổi để lưu');
      return;
    }

    const updates = Object.entries(stockChanges).map(
      ([productId, countInStock]) => ({ productId, countInStock })
    );

    try {
      const result = await updateBulkStock({ updates }).unwrap();
      toast.success(result.message);
      setStockChanges({});
      setBulkMode(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleResetBulk = () => {
    setStockChanges({});
    toast.info('Đã hủy tất cả thay đổi');
  };

  const changesCount = Object.keys(stockChanges).length;

  const getStockBadge = (count) => {
    if (count === 0) {
      return (
        <Badge bg='danger' className='stock-badge'>
          <FaTimesCircle /> {t.outOfStock}
        </Badge>
      );
    } else if (count <= 10) {
      return (
        <Badge bg='warning' className='stock-badge'>
          <FaExclamationTriangle /> {t.lowStock}
        </Badge>
      );
    }
    return (
      <Badge bg='success' className='stock-badge'>
        <FaCheckCircle /> {t.inStock}
      </Badge>
    );
  };

  return (
    <Container className='inventory-container'>
      <div className='inventory-header'>
        <div className='header-top'>
          <div>
            <h1 className='inventory-title'>
              <FaWarehouse className='title-icon' />
              {t.inventoryManagement}
            </h1>
            <p className='inventory-subtitle'>{t.inventoryOverview}</p>
          </div>
          <div className='header-actions'>
            <Button
              variant={bulkMode ? 'danger' : 'primary'}
              onClick={toggleBulkMode}
              className='bulk-mode-btn'
            >
              <FaEdit className='me-2' />
              {bulkMode ? 'Thoát chế độ sửa hàng loạt' : 'Sửa hàng loạt'}
            </Button>
          </div>
        </div>
        {bulkMode && changesCount > 0 && (
          <div className='bulk-actions-bar'>
            <span className='changes-info'>
              📝 {changesCount} sản phẩm đã thay đổi
            </span>
            <div className='bulk-buttons'>
              <Button
                variant='outline-secondary'
                size='sm'
                onClick={handleResetBulk}
              >
                <FaUndo className='me-1' /> Hủy thay đổi
              </Button>
              <Button
                variant='success'
                size='sm'
                onClick={handleSaveBulk}
                disabled={bulkUpdating}
              >
                <FaSave className='me-1' />
                {bulkUpdating ? 'Đang lưu...' : `Lưu tất cả (${changesCount})`}
              </Button>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Row className='stats-row'>
            <Col md={3} sm={6} className='mb-4'>
              <Card className='stat-card total-card'>
                <Card.Body>
                  <div className='stat-icon-wrapper'>
                    <FaBoxOpen className='stat-icon' />
                  </div>
                  <div className='stat-content'>
                    <h3 className='stat-value'>{data?.stats?.totalProducts}</h3>
                    <p className='stat-label'>{t.totalProducts}</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3} sm={6} className='mb-4'>
              <Card className='stat-card instock-card'>
                <Card.Body>
                  <div className='stat-icon-wrapper'>
                    <FaCheckCircle className='stat-icon' />
                  </div>
                  <div className='stat-content'>
                    <h3 className='stat-value'>{data?.stats?.inStock}</h3>
                    <p className='stat-label'>{t.inStock}</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3} sm={6} className='mb-4'>
              <Card className='stat-card lowstock-card'>
                <Card.Body>
                  <div className='stat-icon-wrapper'>
                    <FaExclamationTriangle className='stat-icon' />
                  </div>
                  <div className='stat-content'>
                    <h3 className='stat-value'>{data?.stats?.lowStock}</h3>
                    <p className='stat-label'>{t.lowStock}</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3} sm={6} className='mb-4'>
              <Card className='stat-card outstock-card'>
                <Card.Body>
                  <div className='stat-icon-wrapper'>
                    <FaTimesCircle className='stat-icon' />
                  </div>
                  <div className='stat-content'>
                    <h3 className='stat-value'>{data?.stats?.outOfStock}</h3>
                    <p className='stat-label'>{t.outOfStock}</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className='mb-4'>
            <Col>
              <Card className='value-card'>
                <Card.Body className='d-flex align-items-center justify-content-center'>
                  <FaDollarSign className='value-icon' />
                  <div className='value-content'>
                    <h2 className='value-amount'>
                      {formatPrice(data?.stats?.totalValue || 0)}
                    </h2>
                    <p className='value-label'>{t.totalInventoryValue}</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className='filter-card mb-4'>
            <Card.Body>
              <Row className='align-items-center'>
                <Col md={6} className='mb-3 mb-md-0'>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      type='text'
                      placeholder={t.searchProduct}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={6}>
                  <Form.Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className='filter-select'
                  >
                    <option value='all'>{t.allProducts}</option>
                    <option value='inStock'>{t.inStockOnly}</option>
                    <option value='lowStock'>{t.lowStockOnly}</option>
                    <option value='outOfStock'>{t.outOfStockOnly}</option>
                  </Form.Select>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className='table-card'>
            <Card.Body className='p-0'>
              {filteredProducts.length === 0 ? (
                <div className='no-products'>
                  <FaBoxOpen size={48} />
                  <p>{t.noProductsFound}</p>
                </div>
              ) : (
                <Table responsive className='inventory-table'>
                  <thead>
                    <tr>
                      <th>{t.image}</th>
                      <th>{t.product}</th>
                      <th>{t.brand}</th>
                      <th>{t.category}</th>
                      <th>{t.price}</th>
                      <th>{t.countInStock}</th>
                      <th>{t.stockStatus}</th>
                      <th>{t.stockValue}</th>
                      {!bulkMode && <th>{t.actions}</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => {
                      const currentStock = getCurrentStock(product);
                      const isChanged =
                        bulkMode && stockChanges[product._id] !== undefined;
                      return (
                        <tr
                          key={product._id}
                          className={isChanged ? 'row-changed' : ''}
                        >
                          <td>
                            <img
                              src={product.image || '/placeholder.svg'}
                              alt={product.name}
                              className='product-thumb'
                            />
                          </td>
                          <td className='product-name'>
                            {product.name}
                            {isChanged && (
                              <Badge bg='info' className='ms-2 changed-badge'>
                                Đã sửa
                              </Badge>
                            )}
                          </td>
                          <td>{product.brand}</td>
                          <td>{product.category}</td>
                          <td className='price-cell'>
                            {formatPrice(product.price)}
                          </td>
                          <td>
                            {bulkMode ? (
                              <div className='bulk-stock-input'>
                                <Form.Control
                                  type='number'
                                  min='0'
                                  value={currentStock}
                                  onChange={(e) =>
                                    handleBulkStockChange(
                                      product._id,
                                      e.target.value
                                    )
                                  }
                                  className={`stock-input ${
                                    isChanged ? 'input-changed' : ''
                                  }`}
                                />
                                {isChanged && (
                                  <small className='original-value'>
                                    Gốc: {product.countInStock}
                                  </small>
                                )}
                              </div>
                            ) : editingId === product._id ? (
                              <Form.Control
                                type='number'
                                min='0'
                                value={editStock}
                                onChange={(e) =>
                                  setEditStock(Number(e.target.value))
                                }
                                className='stock-input'
                              />
                            ) : (
                              <span className='stock-count'>
                                {product.countInStock}
                              </span>
                            )}
                          </td>
                          <td>{getStockBadge(currentStock)}</td>
                          <td className='value-cell'>
                            {formatPrice(product.price * currentStock)}
                          </td>
                          {!bulkMode && (
                            <td>
                              {editingId === product._id ? (
                                <div className='action-buttons'>
                                  <Button
                                    variant='success'
                                    size='sm'
                                    onClick={() => handleSaveStock(product._id)}
                                    disabled={updating}
                                    className='save-btn'
                                  >
                                    <FaSave />
                                  </Button>
                                  <Button
                                    variant='secondary'
                                    size='sm'
                                    onClick={handleCancelEdit}
                                    className='cancel-btn'
                                  >
                                    <FaTimes />
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant='outline-primary'
                                  size='sm'
                                  onClick={() => handleEditClick(product)}
                                  className='edit-btn'
                                >
                                  <FaEdit />
                                </Button>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
};

export default DashboardScreen;
