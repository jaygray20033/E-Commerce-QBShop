import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  // NOTE: checking for valid ObjectId to prevent CastError moved to separate
  // middleware. See README for more info.

  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  } else {
    // NOTE: this will run if a valid ObjectId but no product was found
    // i.e. product may be null
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, brand, category, countInStock, description, image } =
    req.body;

  if (!name || !price || !brand || !category || !description || !image) {
    res.status(400);
    throw new Error(
      'Please provide all required fields: name, price, brand, category, description, image'
    );
  }

  const product = new Product({
    name,
    price: Number(price),
    user: req.user._id,
    image,
    brand,
    category,
    countInStock: Number(countInStock) || 0,
    numReviews: 0,
    description,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});

// @desc    Create multiple products
// @route   POST /api/products/bulk
// @access  Private/Admin
const createBulkProducts = asyncHandler(async (req, res) => {
  const { products } = req.body;

  if (!products || !Array.isArray(products) || products.length === 0) {
    res.status(400);
    throw new Error('Vui lòng cung cấp danh sách sản phẩm');
  }

  const results = {
    success: [],
    failed: [],
  };

  for (const productData of products) {
    try {
      const { name, price, brand, category, countInStock, description, image } =
        productData;

      if (!name || !price || !brand || !category || !description) {
        results.failed.push({
          name: name || 'Không có tên',
          error: 'Thiếu thông tin bắt buộc',
        });
        continue;
      }

      const product = new Product({
        name,
        price: Number(price),
        user: req.user._id,
        image: image || '/images/sample.jpg',
        brand,
        category,
        countInStock: Number(countInStock) || 0,
        numReviews: 0,
        description,
      });

      const createdProduct = await product.save();
      results.success.push({
        _id: createdProduct._id,
        name: createdProduct.name,
      });
    } catch (error) {
      results.failed.push({
        name: productData.name || 'Không có tên',
        error: error.message,
      });
    }
  }

  res.status(201).json({
    message: `Đã tạo ${results.success.length} sản phẩm thành công, ${results.failed.length} thất bại`,
    results,
  });
});

// @desc    Import products from Excel data
// @route   POST /api/products/import-excel
// @access  Private/Admin
const importProductsFromExcel = asyncHandler(async (req, res) => {
  const { products } = req.body;

  if (!products || !Array.isArray(products) || products.length === 0) {
    res.status(400);
    throw new Error('Không có dữ liệu sản phẩm từ file Excel');
  }

  const results = {
    success: [],
    failed: [],
  };

  for (const row of products) {
    try {
      // Map Excel columns to product fields
      const productData = {
        name: row.name || row['Tên sản phẩm'] || row['Name'],
        price: Number(row.price || row['Giá'] || row['Price']) || 0,
        brand: row.brand || row['Thương hiệu'] || row['Brand'] || '',
        category: row.category || row['Danh mục'] || row['Category'] || '',
        countInStock:
          Number(row.countInStock || row['Số lượng'] || row['Stock']) || 0,
        description:
          row.description || row['Mô tả'] || row['Description'] || '',
        image:
          row.image || row['Hình ảnh'] || row['Image'] || '/images/sample.jpg',
      };

      if (
        !productData.name ||
        !productData.price ||
        !productData.brand ||
        !productData.category
      ) {
        results.failed.push({
          row: row,
          error: 'Thiếu thông tin bắt buộc (tên, giá, thương hiệu, danh mục)',
        });
        continue;
      }

      const product = new Product({
        ...productData,
        user: req.user._id,
        numReviews: 0,
        rating: 0,
      });

      const createdProduct = await product.save();
      results.success.push({
        _id: createdProduct._id,
        name: createdProduct.name,
      });
    } catch (error) {
      results.failed.push({
        row: row,
        error: error.message,
      });
    }
  }

  res.status(201).json({
    message: `Import thành công ${results.success.length} sản phẩm, ${results.failed.length} thất bại`,
    results,
  });
});

// @desc    Get inventory data
// @route   GET /api/products/inventory
// @access  Private/Admin
const getInventory = asyncHandler(async (req, res) => {
  const products = await Product.find({}).select(
    'name image brand category countInStock price'
  );

  const totalProducts = products.length;
  const outOfStock = products.filter((p) => p.countInStock === 0).length;
  const lowStock = products.filter(
    (p) => p.countInStock > 0 && p.countInStock <= 10
  ).length;
  const inStock = products.filter((p) => p.countInStock > 10).length;
  const totalValue = products.reduce(
    (acc, p) => acc + p.price * p.countInStock,
    0
  );

  res.json({
    products,
    stats: {
      totalProducts,
      outOfStock,
      lowStock,
      inStock,
      totalValue,
    },
  });
});

// @desc    Update product stock
// @route   PUT /api/products/:id/stock
// @access  Private/Admin
const updateStock = asyncHandler(async (req, res) => {
  const { countInStock } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.countInStock = Number(countInStock);
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Update multiple products stock
// @route   PUT /api/products/bulk-stock
// @access  Private/Admin
const updateBulkStock = asyncHandler(async (req, res) => {
  const { updates } = req.body;

  if (!updates || !Array.isArray(updates) || updates.length === 0) {
    res.status(400);
    throw new Error('Vui lòng cung cấp danh sách cập nhật');
  }

  const results = {
    success: [],
    failed: [],
  };

  for (const update of updates) {
    try {
      const product = await Product.findById(update.productId);
      if (product) {
        product.countInStock = Number(update.countInStock);
        await product.save();
        results.success.push({
          _id: product._id,
          name: product.name,
          countInStock: product.countInStock,
        });
      } else {
        results.failed.push({
          productId: update.productId,
          error: 'Không tìm thấy sản phẩm',
        });
      }
    } catch (error) {
      results.failed.push({
        productId: update.productId,
        error: error.message,
      });
    }
  }

  res.json({
    message: `Đã cập nhật ${results.success.length} sản phẩm, ${results.failed.length} thất bại`,
    results,
  });
});

export {
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
};
