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
} from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useGetInventoryQuery,
  useUpdateStockMutation,
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

  const { data, isLoading, error, refetch } = useGetInventoryQuery();
  const [updateStock, { isLoading: updating }] = useUpdateStockMutation();

  const filteredProducts = useMemo(() => {
    if (!data?.products) return [];

    return data.products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      let matchesFilter = true;
      if (filterStatus === 'outOfStock') {
        matchesFilter = product.countInStock === 0;
      } else if (filterStatus === 'lowStock') {
        matchesFilter = product.countInStock > 0 && product.countInStock <= 10;
      } else if (filterStatus === 'inStock') {
        matchesFilter = product.countInStock > 10;
      }

      return matchesSearch && matchesFilter;
    });
  }, [data?.products, searchTerm, filterStatus]);

  const handleEditClick = (product) => {
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
        <h1 className='inventory-title'>
          <FaWarehouse className='title-icon' />
          {t.inventoryManagement}
        </h1>
        <p className='inventory-subtitle'>{t.inventoryOverview}</p>
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
                      <th>{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <img
                            src={product.image || '/placeholder.svg'}
                            alt={product.name}
                            className='product-thumb'
                          />
                        </td>
                        <td className='product-name'>{product.name}</td>
                        <td>{product.brand}</td>
                        <td>{product.category}</td>
                        <td className='price-cell'>
                          {formatPrice(product.price)}
                        </td>
                        <td>
                          {editingId === product._id ? (
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
                        <td>{getStockBadge(product.countInStock)}</td>
                        <td className='value-cell'>
                          {formatPrice(product.price * product.countInStock)}
                        </td>
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
                      </tr>
                    ))}
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
