'use client';

import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useCreateProductMutation,
} from '../../slices/productsApiSlice';
import { useLanguage } from '../../context/LanguageContext';
import { FaArrowLeft, FaUpload, FaSave, FaTimes } from 'react-icons/fa';
import './ProductEditScreen.css';

const ProductEditScreen = () => {
  const { t } = useLanguage();
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isNewProduct = location.state?.isNew || productId === 'new';

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId, { skip: isNewProduct });

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!name || !price || !brand || !category) {
      toast.error(t.fillAllFields);
      return;
    }

    try {
      if (isNewProduct) {
        const newProduct = await createProduct({
          name,
          price,
          image,
          brand,
          category,
          description,
          countInStock,
        }).unwrap();
        toast.success(t.productCreated);
        navigate('/admin/productlist');
      } else {
        await updateProduct({
          productId,
          name,
          price,
          image,
          brand,
          category,
          description,
          countInStock,
        }).unwrap();
        toast.success(t.productUpdated);
        refetch();
        navigate('/admin/productlist');
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (product && !isNewProduct) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product, isNewProduct]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className='product-edit-wrapper'>
      {/* Header */}
      <div className='edit-header-fixed'>
        <div className='header-content'>
          <Link to='/admin/productlist' className='back-link-custom'>
            <FaArrowLeft /> {t.goBack}
          </Link>
          <div className='header-title-group'>
            <h1 className='edit-title'>
              {isNewProduct ? t.createNewProduct : t.editProduct}
            </h1>
            <p className='edit-subtitle'>
              {isNewProduct ? t.fillProductInfo : t.updateProductInfo}
            </p>
          </div>
        </div>
      </div>

      {loadingCreate || loadingUpdate ? (
        <Loader />
      ) : error && !isNewProduct ? (
        <Message variant='danger'>{error.data.message}</Message>
      ) : (
        <div className='edit-content-wrapper'>
          {/* Form Section - 70% */}
          <div className='form-section'>
            <div className='form-card'>
              <div className='form-card-header'>
                <h2>{t.productInfo}</h2>
              </div>

              <Form onSubmit={submitHandler} className='product-form'>
                {/* Tên Sản Phẩm */}
                <Form.Group controlId='name' className='form-group-custom'>
                  <Form.Label className='form-label-custom'>
                    {t.productName} <span className='required'>*</span>
                  </Form.Label>
                  <Form.Control
                    type='text'
                    placeholder={t.productName}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='form-input'
                    required
                  />
                </Form.Group>

                {/* Giá */}
                <Form.Group controlId='price' className='form-group-custom'>
                  <Form.Label className='form-label-custom'>
                    {t.priceVND} <span className='required'>*</span>
                  </Form.Label>
                  <Form.Control
                    type='number'
                    placeholder={t.price}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className='form-input'
                    required
                  />
                </Form.Group>

                {/* Thương Hiệu */}
                <Form.Group controlId='brand' className='form-group-custom'>
                  <Form.Label className='form-label-custom'>
                    {t.brand} <span className='required'>*</span>
                  </Form.Label>
                  <Form.Control
                    type='text'
                    placeholder={t.brand}
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className='form-input'
                    required
                  />
                </Form.Group>

                {/* Danh Mục */}
                <Form.Group controlId='category' className='form-group-custom'>
                  <Form.Label className='form-label-custom'>
                    {t.category} <span className='required'>*</span>
                  </Form.Label>
                  <Form.Control
                    type='text'
                    placeholder={t.category}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className='form-input'
                    required
                  />
                </Form.Group>

                {/* Số Lượng Tồn */}
                <Form.Group
                  controlId='countInStock'
                  className='form-group-custom'
                >
                  <Form.Label className='form-label-custom'>
                    {t.countInStock}
                  </Form.Label>
                  <Form.Control
                    type='number'
                    placeholder={t.countInStock}
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                    className='form-input'
                  />
                </Form.Group>

                {/* Mô Tả */}
                <Form.Group
                  controlId='description'
                  className='form-group-custom'
                >
                  <Form.Label className='form-label-custom'>
                    {t.description}
                  </Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={4}
                    placeholder={t.enterDescription}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className='form-input'
                  />
                </Form.Group>

                {/* Action Buttons */}
                <div className='form-actions'>
                  <Button
                    type='submit'
                    className='btn-save'
                    disabled={loadingCreate || loadingUpdate}
                  >
                    <FaSave /> {isNewProduct ? t.createProduct : t.update}
                  </Button>
                  <Link to='/admin/productlist' className='btn-cancel'>
                    <FaTimes /> {t.cancel}
                  </Link>
                </div>
              </Form>
            </div>
          </div>

          {/* Image Section - 30% */}
          <div className='image-section'>
            <div className='image-card'>
              <div className='image-card-header'>
                <h2>{t.productImage}</h2>
              </div>

              <div className='image-preview'>
                {image ? (
                  <img
                    src={image || '/placeholder.svg'}
                    alt={name || 'Product'}
                    className='preview-img'
                  />
                ) : (
                  <div className='preview-placeholder'>
                    <svg
                      width='64'
                      height='64'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                    >
                      <rect x='3' y='3' width='18' height='18' rx='2' />
                      <circle cx='8.5' cy='8.5' r='1.5' />
                      <path d='M21 15l-5-5L5 21' />
                    </svg>
                    <p>{t.noImage}</p>
                  </div>
                )}
              </div>

              {/* Upload Method */}
              <div className='upload-section'>
                <Form.Group controlId='imageUrl' className='form-group-custom'>
                  <Form.Label className='form-label-custom'>
                    {t.imageUrl}
                  </Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='URL'
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className='form-input'
                  />
                </Form.Group>

                <div className='upload-divider'>{t.or}</div>

                <Form.Group controlId='imageFile' className='form-group-custom'>
                  <Form.Label className='form-label-custom'>
                    {t.upload}
                  </Form.Label>
                  <div className='file-upload-wrapper'>
                    <input
                      type='file'
                      onChange={uploadFileHandler}
                      className='file-input'
                      accept='image/*'
                    />
                    <div className='file-upload-placeholder'>
                      <FaUpload />
                      <span>{t.dragOrClick}</span>
                    </div>
                  </div>
                  {loadingUpload && <Loader />}
                </Form.Group>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductEditScreen;
