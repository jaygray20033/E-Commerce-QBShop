'use client';

import { Table, Button, Row, Col, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash, FaUpload } from 'react-icons/fa';
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

const compressImage = (
  base64String,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.7
) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = base64String;
  });
};

const initialFormState = {
  name: '',
  price: 0,
  brand: '',
  category: '',
  countInStock: 0,
  description: '',
  image: '',
};

const ProductListScreen = () => {
  const { pageNumber } = useParams();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [imagePreview, setImagePreview] = useState('');

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
    setFormData(initialFormState);
    setImagePreview('');
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.price ||
      !formData.brand ||
      !formData.category ||
      !formData.description ||
      !formData.image
    ) {
      toast.error(
        'Vui lòng điền đầy đủ các trường bắt buộc: tên, giá, thương hiệu, danh mục, mô tả, ảnh'
      );
      return;
    }

    try {
      await createProduct(formData).unwrap();
      toast.success(vi.productCreated);
      setShowCreateModal(false);
      refetch();
      // Reset form
      setFormData(initialFormState);
      setImagePreview('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'price' || name === 'countInStock' ? Number(value) : value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const compressedImage = await compressImage(reader.result);
          setImagePreview(compressedImage);
          setFormData((prev) => ({
            ...prev,
            image: compressedImage,
          }));
        } catch (err) {
          toast.error('Lỗi khi xử lý hình ảnh');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    setFormData(initialFormState);
    setImagePreview('');
  };

  return (
    <>
      <Modal
        show={showCreateModal}
        onHide={handleModalClose}
        centered
        size='lg'
        className='create-product-modal'
      >
        <Modal.Header closeButton className='create-modal-header'>
          <Modal.Title className='create-modal-title'>
            Tạo Sản Phẩm Mới
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='create-modal-body'>
          <Form onSubmit={handleCreateSubmit} className='create-product-form'>
            <div className='form-grid'>
              {/* Left Column - Image Upload */}
              <div className='form-image-section'>
                <div className='image-upload-container'>
                  <h3 className='section-title'>Hình Ảnh Sản Phẩm</h3>
                  <div className='image-preview-box'>
                    {imagePreview ? (
                      <img
                        src={imagePreview || '/placeholder.svg'}
                        alt='Preview'
                        className='image-preview-img'
                      />
                    ) : (
                      <div className='image-placeholder'>
                        <svg
                          width='48'
                          height='48'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                        >
                          <rect x='3' y='3' width='18' height='18' rx='2' />
                          <circle cx='8.5' cy='8.5' r='1.5' />
                          <path d='M21 15l-5-5L5 21' />
                        </svg>
                        <p>Chưa có hình ảnh</p>
                      </div>
                    )}
                  </div>
                  <Form.Group className='file-upload-group'>
                    <input
                      type='file'
                      id='imageFile'
                      onChange={handleImageChange}
                      accept='image/*'
                      className='file-input-hidden'
                    />
                    <label htmlFor='imageFile' className='file-upload-label'>
                      <FaUpload className='upload-icon' />
                      <span>Chọn ảnh hoặc kéo thả</span>
                    </label>
                  </Form.Group>
                  <Form.Group className='mt-3'>
                    <Form.Label className='form-label-small'>
                      Hoặc dán URL ảnh
                    </Form.Label>
                    <Form.Control
                      type='text'
                      name='image'
                      placeholder='https://example.com/image.jpg'
                      value={formData.image}
                      onChange={(e) => {
                        handleFormChange(e);
                        setImagePreview(e.target.value);
                      }}
                      className='form-input-modern'
                    />
                  </Form.Group>
                </div>
              </div>

              {/* Right Column - Product Info */}
              <div className='form-info-section'>
                <h3 className='section-title'>Thông Tin Sản Phẩm</h3>

                <Form.Group className='form-group-modern'>
                  <Form.Label className='form-label-required'>
                    Tên Sản Phẩm <span className='required-badge'>*</span>
                  </Form.Label>
                  <Form.Control
                    type='text'
                    name='name'
                    placeholder='VD: iPhone 15 Pro Max'
                    value={formData.name}
                    onChange={handleFormChange}
                    className='form-input-modern'
                    required
                  />
                </Form.Group>

                <Form.Group className='form-group-modern'>
                  <Form.Label className='form-label-required'>
                    Giá (VND) <span className='required-badge'>*</span>
                  </Form.Label>
                  <Form.Control
                    type='number'
                    name='price'
                    placeholder='0'
                    value={formData.price}
                    onChange={handleFormChange}
                    className='form-input-modern'
                    required
                  />
                </Form.Group>

                <div className='form-row'>
                  <Form.Group className='form-group-modern'>
                    <Form.Label className='form-label-required'>
                      Thương Hiệu <span className='required-badge'>*</span>
                    </Form.Label>
                    <Form.Control
                      type='text'
                      name='brand'
                      placeholder='VD: Apple'
                      value={formData.brand}
                      onChange={handleFormChange}
                      className='form-input-modern'
                      required
                    />
                  </Form.Group>

                  <Form.Group className='form-group-modern'>
                    <Form.Label className='form-label-required'>
                      Danh Mục <span className='required-badge'>*</span>
                    </Form.Label>
                    <Form.Control
                      type='text'
                      name='category'
                      placeholder='VD: Điện thoại'
                      value={formData.category}
                      onChange={handleFormChange}
                      className='form-input-modern'
                      required
                    />
                  </Form.Group>
                </div>

                <Form.Group className='form-group-modern'>
                  <Form.Label>Số Lượng Tồn</Form.Label>
                  <Form.Control
                    type='number'
                    name='countInStock'
                    placeholder='0'
                    value={formData.countInStock}
                    onChange={handleFormChange}
                    className='form-input-modern'
                  />
                </Form.Group>

                <Form.Group className='form-group-modern'>
                  <Form.Label>Mô Tả</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={3}
                    name='description'
                    placeholder='Nhập mô tả chi tiết sản phẩm...'
                    value={formData.description}
                    onChange={handleFormChange}
                    className='form-input-modern'
                    required
                  />
                </Form.Group>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='form-actions-modern'>
              <Button
                variant='light'
                className='btn-cancel-modern'
                onClick={handleModalClose}
              >
                Hủy
              </Button>
              <Button
                variant='primary'
                type='submit'
                disabled={loadingCreate}
                className='btn-submit-modern'
              >
                {loadingCreate ? 'Đang tạo...' : 'Tạo Sản Phẩm'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
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
