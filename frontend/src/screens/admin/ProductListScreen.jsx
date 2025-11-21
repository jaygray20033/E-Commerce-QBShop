'use client';

import { Table, Button, Row, Col, Modal } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
} from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';
import { vi } from '../../i18n/translations';
import { formatPrice } from '../../utils/formatPrice';
import { useState } from 'react';
import './ProductListScreen.css';

const ProductListScreen = () => {
  const { pageNumber } = useParams();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm(vi.confirmDelete)) {
      try {
        await deleteProduct(id);
        refetch();
        toast.success(vi.productDeleted);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const createProductHandler = () => {
    setShowConfirm(true);
  };

  const handleConfirmCreate = () => {
    setShowConfirm(false);
    navigate('/admin/product/new/edit', { state: { isNew: true } });
  };

  return (
    <>
      {/* Create Product Confirmation Modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tạo Sản Phẩm Mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có muốn tạo một sản phẩm mới không?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowConfirm(false)}>
            Hủy
          </Button>
          <Button variant='primary' onClick={handleConfirmCreate}>
            Có, Tạo Sản Phẩm
          </Button>
        </Modal.Footer>
      </Modal>

      <Row className='align-items-center admin-header'>
        <Col>
          <h1 className='admin-title'>{vi.products}</h1>
        </Col>
        <Col className='text-end'>
          <Button className='create-btn' onClick={createProductHandler}>
            <FaPlus /> {vi.createProduct}
          </Button>
        </Col>
      </Row>

      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error.data.message}</Message>
      ) : (
        <>
          <div className='admin-table-container'>
            <Table striped bordered hover responsive className='admin-table'>
              <thead>
                <tr>
                  <th>{vi.id}</th>
                  <th>{vi.name}</th>
                  <th>{vi.price}</th>
                  <th>{vi.category}</th>
                  <th>{vi.brand}</th>
                  <th className='actions-col'>{vi.actions}</th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((product, index) => (
                  <tr
                    key={product._id}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    className='admin-row'
                  >
                    <td className='id-cell'>
                      {product._id.substring(0, 8)}...
                    </td>
                    <td className='name-cell'>{product.name}</td>
                    <td className='price-cell'>{formatPrice(product.price)}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td className='actions-cell'>
                      <Button
                        as={Link}
                        to={`/admin/product/${product._id}/edit`}
                        variant='light'
                        className='edit-btn mx-2'
                        title={vi.edit}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant='danger'
                        className='delete-btn'
                        onClick={() => deleteHandler(product._id)}
                        title={vi.delete}
                      >
                        <FaTrash style={{ color: 'white' }} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
