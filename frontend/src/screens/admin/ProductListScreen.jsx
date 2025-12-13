'use client';

import { Table, Button, Row, Col, Modal, Form, Badge } from 'react-bootstrap';
import {
  FaEdit,
  FaPlus,
  FaTrash,
  FaUpload,
  FaFileExcel,
  FaDownload,
  FaTimes,
} from 'react-icons/fa';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
  useCreateBulkProductsMutation,
  useImportProductsFromExcelMutation,
} from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/formatPrice';
import { useState } from 'react';
import * as XLSX from 'xlsx';
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
  const { t } = useLanguage();
  const { pageNumber } = useParams();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [imagePreview, setImagePreview] = useState('');
  const [bulkProducts, setBulkProducts] = useState([
    { ...initialFormState, imagePreview: '' },
  ]);
  const [excelProducts, setExcelProducts] = useState([]);
  const [excelFileName, setExcelFileName] = useState('');
  const [excelImages, setExcelImages] = useState({});

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const [createBulkProducts, { isLoading: loadingBulk }] =
    useCreateBulkProductsMutation();

  const [importProductsFromExcel, { isLoading: loadingExcel }] =
    useImportProductsFromExcelMutation();

  const deleteHandler = async (id) => {
    if (window.confirm(t.confirmDelete)) {
      try {
        await deleteProduct(id);
        refetch();
        toast.success(t.productDeleted);
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
      toast.error(t.fillAllFields);
      return;
    }

    try {
      await createProduct(formData).unwrap();
      toast.success(t.productCreated);
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
          toast.error(t.imageProcessError);
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

  // Bulk Products Handlers
  const handleBulkModalOpen = () => {
    setBulkProducts([{ ...initialFormState, imagePreview: '' }]);
    setShowBulkModal(true);
  };

  const handleBulkModalClose = () => {
    setShowBulkModal(false);
    setBulkProducts([{ ...initialFormState, imagePreview: '' }]);
  };

  const handleAddBulkProduct = () => {
    setBulkProducts([
      ...bulkProducts,
      { ...initialFormState, imagePreview: '' },
    ]);
  };

  const handleRemoveBulkProduct = (index) => {
    if (bulkProducts.length > 1) {
      setBulkProducts(bulkProducts.filter((_, i) => i !== index));
    }
  };

  const handleBulkProductChange = (index, field, value) => {
    const updated = [...bulkProducts];
    updated[index][field] =
      field === 'price' || field === 'countInStock' ? Number(value) : value;
    setBulkProducts(updated);
  };

  const handleBulkImageChange = async (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const compressedImage = await compressImage(reader.result);
          const updated = [...bulkProducts];
          updated[index].image = compressedImage;
          updated[index].imagePreview = compressedImage;
          setBulkProducts(updated);
        } catch (err) {
          toast.error(t.imageProcessError);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    const validProducts = bulkProducts
      .filter(
        (p) => p.name && p.price && p.brand && p.category && p.description
      )
      .map(({ imagePreview, ...rest }) => rest);

    if (validProducts.length === 0) {
      toast.error(t.noProductsToCreate);
      return;
    }

    try {
      const result = await createBulkProducts({
        products: validProducts,
      }).unwrap();
      toast.success(result.message);
      setShowBulkModal(false);
      setBulkProducts([{ ...initialFormState, imagePreview: '' }]);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  // Excel Import Handlers
  const handleExcelModalOpen = () => {
    setExcelProducts([]);
    setExcelFileName('');
    setExcelImages({});
    setShowExcelModal(true);
  };

  const handleExcelModalClose = () => {
    setShowExcelModal(false);
    setExcelProducts([]);
    setExcelFileName('');
    setExcelImages({});
  };

  const handleExcelFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setExcelFileName(file.name);
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const bstr = evt.target.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws);
          setExcelProducts(data);
          setExcelImages({});
          toast.success(t.readProducts.replace('{count}', data.length));
        } catch (err) {
          toast.error(t.excelReadError);
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleExcelProductImageChange = async (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const compressedImage = await compressImage(reader.result);
          setExcelImages((prev) => ({
            ...prev,
            [index]: compressedImage,
          }));
        } catch (err) {
          toast.error(t.imageProcessError);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExcelImport = async () => {
    if (excelProducts.length === 0) {
      toast.error(t.noExcelData);
      return;
    }

    const productsWithImages = excelProducts.map((product, index) => ({
      ...product,
      image: excelImages[index] || product.image || product['Hình ảnh'] || '',
    }));

    try {
      const result = await importProductsFromExcel({
        products: productsWithImages,
      }).unwrap();
      toast.success(result.message);
      setShowExcelModal(false);
      setExcelProducts([]);
      setExcelFileName('');
      setExcelImages({});
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const downloadExcelTemplate = () => {
    const template = [
      {
        name: 'Tên sản phẩm mẫu',
        price: 100000,
        brand: 'Thương hiệu',
        category: 'Danh mục',
        countInStock: 10,
        description: 'Mô tả sản phẩm',
        image: 'https://example.com/image.jpg',
      },
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    XLSX.writeFile(wb, 'product_template.xlsx');
  };

  // Helper function to get image URL from excel product
  const getExcelProductImage = (product) => {
    return product.image || product['Hình ảnh'] || product['Image'] || '';
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
            {t.createNewProduct}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='create-modal-body'>
          <Form onSubmit={handleCreateSubmit} className='create-product-form'>
            <div className='form-grid'>
              {/* Left Column - Image Upload */}
              <div className='form-image-section'>
                <div className='image-upload-container'>
                  <h3 className='section-title'>{t.productImage}</h3>
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
                        <p>{t.noImage}</p>
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
                      <span>{t.selectOrDragImage}</span>
                    </label>
                  </Form.Group>
                  <Form.Group className='mt-3'>
                    <Form.Label className='form-label-small'>
                      {t.orPasteUrl}
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
                <h3 className='section-title'>{t.productInfo}</h3>

                <Form.Group className='form-group-modern'>
                  <Form.Label className='form-label-required'>
                    {t.productName} <span className='required-badge'>*</span>
                  </Form.Label>
                  <Form.Control
                    type='text'
                    name='name'
                    placeholder='iPhone 15 Pro Max'
                    value={formData.name}
                    onChange={handleFormChange}
                    className='form-input-modern'
                    required
                  />
                </Form.Group>

                <Form.Group className='form-group-modern'>
                  <Form.Label className='form-label-required'>
                    {t.priceVND} <span className='required-badge'>*</span>
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
                      {t.brand} <span className='required-badge'>*</span>
                    </Form.Label>
                    <Form.Control
                      type='text'
                      name='brand'
                      placeholder='Apple'
                      value={formData.brand}
                      onChange={handleFormChange}
                      className='form-input-modern'
                      required
                    />
                  </Form.Group>

                  <Form.Group className='form-group-modern'>
                    <Form.Label className='form-label-required'>
                      {t.category} <span className='required-badge'>*</span>
                    </Form.Label>
                    <Form.Control
                      type='text'
                      name='category'
                      placeholder='Electronics'
                      value={formData.category}
                      onChange={handleFormChange}
                      className='form-input-modern'
                      required
                    />
                  </Form.Group>
                </div>

                <Form.Group className='form-group-modern'>
                  <Form.Label>{t.countInStock}</Form.Label>
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
                  <Form.Label>{t.description}</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={3}
                    name='description'
                    placeholder={t.enterDescription}
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
                {t.cancel}
              </Button>
              <Button
                variant='primary'
                type='submit'
                disabled={loadingCreate}
                className='btn-submit-modern'
              >
                {loadingCreate ? t.creating : t.createProduct}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Bulk Create Modal */}
      <Modal
        show={showBulkModal}
        onHide={handleBulkModalClose}
        centered
        size='xl'
        className='bulk-product-modal'
      >
        <Modal.Header closeButton className='create-modal-header'>
          <Modal.Title className='create-modal-title'>
            {t.createBulkProducts}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='create-modal-body'>
          <Form onSubmit={handleBulkSubmit}>
            <div className='bulk-products-container'>
              {bulkProducts.map((product, index) => (
                <div key={index} className='bulk-product-item'>
                  <div className='bulk-product-header'>
                    <span className='bulk-product-index'>
                      {t.productIndex} #{index + 1}
                    </span>
                    {bulkProducts.length > 1 && (
                      <Button
                        variant='danger'
                        size='sm'
                        onClick={() => handleRemoveBulkProduct(index)}
                        className='bulk-remove-btn'
                      >
                        <FaTimes />
                      </Button>
                    )}
                  </div>
                  <div className='bulk-product-fields'>
                    <Form.Group className='bulk-field'>
                      <Form.Label>{t.name} *</Form.Label>
                      <Form.Control
                        type='text'
                        value={product.name}
                        onChange={(e) =>
                          handleBulkProductChange(index, 'name', e.target.value)
                        }
                        placeholder={t.productName}
                        required
                      />
                    </Form.Group>
                    <Form.Group className='bulk-field'>
                      <Form.Label>{t.price} *</Form.Label>
                      <Form.Control
                        type='number'
                        value={product.price}
                        onChange={(e) =>
                          handleBulkProductChange(
                            index,
                            'price',
                            e.target.value
                          )
                        }
                        placeholder='0'
                        required
                      />
                    </Form.Group>
                    <Form.Group className='bulk-field'>
                      <Form.Label>{t.brand} *</Form.Label>
                      <Form.Control
                        type='text'
                        value={product.brand}
                        onChange={(e) =>
                          handleBulkProductChange(
                            index,
                            'brand',
                            e.target.value
                          )
                        }
                        placeholder={t.brand}
                        required
                      />
                    </Form.Group>
                    <Form.Group className='bulk-field'>
                      <Form.Label>{t.category} *</Form.Label>
                      <Form.Control
                        type='text'
                        value={product.category}
                        onChange={(e) =>
                          handleBulkProductChange(
                            index,
                            'category',
                            e.target.value
                          )
                        }
                        placeholder={t.category}
                        required
                      />
                    </Form.Group>
                    <Form.Group className='bulk-field'>
                      <Form.Label>{t.countInStock}</Form.Label>
                      <Form.Control
                        type='number'
                        value={product.countInStock}
                        onChange={(e) =>
                          handleBulkProductChange(
                            index,
                            'countInStock',
                            e.target.value
                          )
                        }
                        placeholder='0'
                      />
                    </Form.Group>
                    <Form.Group className='bulk-field bulk-field-wide'>
                      <Form.Label>{t.description} *</Form.Label>
                      <Form.Control
                        type='text'
                        value={product.description}
                        onChange={(e) =>
                          handleBulkProductChange(
                            index,
                            'description',
                            e.target.value
                          )
                        }
                        placeholder={t.description}
                        required
                      />
                    </Form.Group>
                    <Form.Group className='bulk-field bulk-field-image'>
                      <Form.Label>{t.image}</Form.Label>
                      <div className='bulk-image-upload'>
                        <input
                          type='file'
                          id={`bulkImage-${index}`}
                          accept='image/*'
                          onChange={(e) => handleBulkImageChange(index, e)}
                          className='file-input-hidden'
                        />
                        <label
                          htmlFor={`bulkImage-${index}`}
                          className='bulk-image-label'
                        >
                          {product.imagePreview ? (
                            <img
                              src={product.imagePreview}
                              alt='Preview'
                              className='bulk-image-preview'
                            />
                          ) : (
                            <div className='bulk-image-placeholder'>
                              <FaUpload />
                              <span>{t.selectOrDragImage}</span>
                            </div>
                          )}
                        </label>
                      </div>
                    </Form.Group>
                  </div>
                </div>
              ))}
            </div>
            <div className='bulk-actions'>
              <Button
                type='button'
                variant='outline-primary'
                onClick={handleAddBulkProduct}
                className='add-product-btn'
              >
                <FaPlus /> {t.addProduct}
              </Button>
            </div>
            <div className='form-actions-modern'>
              <Button
                variant='light'
                className='btn-cancel-modern'
                onClick={handleBulkModalClose}
              >
                {t.cancel}
              </Button>
              <Button
                variant='primary'
                type='submit'
                disabled={loadingBulk}
                className='btn-submit-modern'
              >
                {loadingBulk
                  ? t.creating
                  : `${t.createProduct} (${bulkProducts.length})`}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Excel Import Modal */}
      <Modal
        show={showExcelModal}
        onHide={handleExcelModalClose}
        centered
        size='lg'
        className='excel-import-modal'
      >
        <Modal.Header closeButton className='create-modal-header'>
          <Modal.Title className='create-modal-title'>
            <FaFileExcel className='me-2' /> {t.importExcel}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='create-modal-body'>
          <div className='excel-import-container'>
            <div className='excel-template-section'>
              <h5>{t.step1DownloadTemplate}</h5>
              <p className='text-muted'>{t.step1Desc}</p>
              <Button
                variant='outline-success'
                onClick={downloadExcelTemplate}
                className='download-template-btn'
              >
                <FaDownload /> {t.downloadTemplate}
              </Button>
            </div>

            <div className='excel-upload-section'>
              <h5>{t.step2UploadExcel}</h5>
              <div className='excel-upload-box'>
                <input
                  type='file'
                  id='excelFile'
                  accept='.xlsx,.xls'
                  onChange={handleExcelFileChange}
                  className='file-input-hidden'
                />
                <label htmlFor='excelFile' className='excel-upload-label'>
                  <FaFileExcel className='excel-icon' />
                  <span>{excelFileName || t.selectExcelFile}</span>
                </label>
              </div>
            </div>

            {excelProducts.length > 0 && (
              <div className='excel-preview-section'>
                <h5>
                  {t.step3AddImages}{' '}
                  <Badge bg='primary'>
                    {excelProducts.length} {t.products.toLowerCase()}
                  </Badge>
                </h5>
                <p className='text-muted'>{t.clickToUploadImage}</p>
                <div className='excel-preview-table'>
                  <Table striped bordered hover size='sm'>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>{t.name}</th>
                        <th>{t.price}</th>
                        <th>{t.brand}</th>
                        <th>{t.category}</th>
                        <th>{t.image}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {excelProducts.map((p, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{p.name || p['Tên sản phẩm'] || '-'}</td>
                          <td>{p.price || p['Giá'] || '-'}</td>
                          <td>{p.brand || p['Thương hiệu'] || '-'}</td>
                          <td>{p.category || p['Danh mục'] || '-'}</td>
                          <td className='excel-image-cell'>
                            <input
                              type='file'
                              id={`excelImage-${i}`}
                              accept='image/*'
                              onChange={(e) =>
                                handleExcelProductImageChange(i, e)
                              }
                              className='file-input-hidden'
                            />
                            <label
                              htmlFor={`excelImage-${i}`}
                              className='excel-image-label'
                            >
                              {excelImages[i] ? (
                                <img
                                  src={excelImages[i]}
                                  alt='Preview'
                                  className='excel-image-preview'
                                />
                              ) : getExcelProductImage(p) ? (
                                <img
                                  src={getExcelProductImage(p)}
                                  alt='Preview'
                                  className='excel-image-preview'
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              {!excelImages[i] && !getExcelProductImage(p) && (
                                <div className='excel-image-placeholder'>
                                  <FaUpload size={12} />
                                </div>
                              )}
                              {!excelImages[i] && getExcelProductImage(p) && (
                                <div
                                  className='excel-image-placeholder'
                                  style={{ display: 'none' }}
                                >
                                  <FaUpload size={12} />
                                </div>
                              )}
                            </label>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            )}
          </div>

          <div className='form-actions-modern'>
            <Button
              variant='light'
              className='btn-cancel-modern'
              onClick={handleExcelModalClose}
            >
              {t.cancel}
            </Button>
            <Button
              variant='success'
              onClick={handleExcelImport}
              disabled={loadingExcel || excelProducts.length === 0}
              className='btn-submit-modern btn-excel-import'
            >
              {loadingExcel
                ? t.importing
                : `${t.importExcel} (${excelProducts.length})`}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Row className='align-items-center admin-header'>
        <Col>
          <h1 className='admin-title'>{t.products}</h1>
        </Col>
        <Col className='text-end admin-actions'>
          <Button
            className='excel-btn me-2'
            onClick={handleExcelModalOpen}
            title={t.importExcel}
          >
            <FaFileExcel /> {t.importExcel}
          </Button>
          <Button
            className='bulk-btn me-2'
            onClick={handleBulkModalOpen}
            title={t.createBulkProducts}
          >
            <FaPlus /> {t.createBulkProducts}
          </Button>
          <Button className='create-btn' onClick={createProductHandler}>
            <FaPlus /> {t.createProduct}
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
                  <th>{t.id}</th>
                  <th>{t.name}</th>
                  <th>{t.price}</th>
                  <th>{t.category}</th>
                  <th>{t.brand}</th>
                  <th className='actions-col'>{t.actions}</th>
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
                        title={t.edit}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant='danger'
                        className='delete-btn'
                        onClick={() => deleteHandler(product._id)}
                        title={t.delete}
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
