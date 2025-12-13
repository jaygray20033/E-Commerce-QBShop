import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  createBulkProducts,
  importProductsFromExcel,
  getInventory,
  updateStock,
  updateBulkStock,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/bulk').post(protect, admin, createBulkProducts);
router.route('/bulk-stock').put(protect, admin, updateBulkStock);
router.route('/import-excel').post(protect, admin, importProductsFromExcel);
router.route('/inventory').get(protect, admin, getInventory);
router.route('/:id/reviews').post(protect, checkObjectId, createProductReview);
router.route('/:id/stock').put(protect, admin, checkObjectId, updateStock);
router.get('/top', getTopProducts);
router
  .route('/:id')
  .get(checkObjectId, getProductById)
  .put(protect, admin, checkObjectId, updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct);

export default router;
