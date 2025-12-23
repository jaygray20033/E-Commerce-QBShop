# 📦 KIỂM THỬ API QUẢN LÝ TỒN KHO (INVENTORY MANAGEMENT) - QBShop

**Phiên bản:** 1.0  
**Ngày tạo:** 2025-12-23  
**Loại kiểm thử:** API Testing  
**Công cụ:** Postman  

---

## 📋 MỤC LỤC

1. [Giới thiệu](#giới-thiệu)
2. [Cấu hình Postman](#cấu-hình-postman)
3. [Danh sách Test Cases](#danh-sách-test-cases)
4. [Kết quả Kiểm thử](#kết-quả-kiểm-thử)

---

## 🎯 Giới thiệu

Module này kiểm thử các chức năng quản lý tồn kho sản phẩm, bao gồm:
- ✅ Xem thông tin tồn kho tổng quan và thống kê
- ✅ Cập nhật số lượng tồn kho cho từng sản phẩm
- ✅ Cập nhật tồn kho hàng loạt (bulk update)
- ✅ Kiểm tra quyền truy cập (Authorization)
- ✅ Validation dữ liệu đầu vào

**Base API:** `http://localhost:5000`

---

## 🔧 Cấu hình Postman

### Bước 1: Tạo Environment
1. Mở Postman
2. Click **Environments** → **Create New**
3. Đặt tên: `QBShop - Inventory`
4. Thêm các biến sau:

| Variable | Initial Value | Current Value | 
|----------|---------------|---------------|
| baseUrl | http://localhost:5000 | http://localhost:5000 |
| adminToken | [Điền token admin] | [Điền token admin] |
| userToken | [Điền token user] | [Điền token user] |
| productId | [Điền ID sản phẩm] | [Điền ID sản phẩm] |
| productId2 | [Điền ID sản phẩm 2] | [Điền ID sản phẩm 2] |

### Bước 2: Import Collection
1. Download file `QBShop_Inventory_Management_Complete.postman_collection.json`
2. Mở Postman → Click **File** → **Import**
3. Chọn file và click **Import**
4. Chọn environment `QBShop - Inventory`

### Bước 3: Lấy Token
Để lấy Admin Token:
1. Gọi API: `POST http://localhost:5000/api/users/login`
2. Body:
```json
{
  "email": "admin@qbshop.com",
  "password": "password123"
}
```
3. Copy token từ response → Dán vào `adminToken` trong Environment

---

## 📊 DANH SÁCH TEST CASES

### 🔹 GROUP 1: LẤY DANH SÁCH TỒN KHO

#### **TC-INV-001: Lấy thông tin tồn kho tổng quan - Thành công** ✅

| Thuộc tính | Chi tiết |
|-----------|---------|
| **Test Case ID** | TC-INV-001 |
| **Tên** | GET Inventory - Lấy thông tin tồn kho và thống kê |
| **Priority** | 🔴 HIGH |
| **Phương thức** | GET |
| **Endpoint** | `/api/products/inventory` |
| **Authorization** | Admin Token (REQUIRED) |
| **Content-Type** | application/json |

**Mục đích kiểm thử:**
Kiểm tra API trả về danh sách sản phẩm với thông tin tồn kho và các thống kê tổng quan về tình trạng kho hàng.

**Request:**
```
GET http://localhost:5000/api/products/inventory
Header: Authorization: Bearer {{adminToken}}
```

**Expected Response (Status 200):**
```json
{
  "products": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "iPhone 14 Pro",
      "countInStock": 45,
      "price": 999,
      "brand": "Apple",
      "image": "image.jpg",
      "category": "Smartphones"
    }
  ],
  "stats": {
    "totalProducts": 48,
    "outOfStock": 5,
    "lowStock": 12,
    "inStock": 31,
    "totalValue": 125000
  }
}
```

**Test Assertions:**
- ✅ Status Code = 200 OK
- ✅ Response chứa `products` (array)
- ✅ Response chứa `stats` (object)
- ✅ Stats có tất cả các field: `totalProducts`, `outOfStock`, `lowStock`, `inStock`, `totalValue`
- ✅ Tất cả giá trị stats là số (number)
- ✅ Logic stats đúng: `outOfStock + lowStock + inStock = totalProducts`
- ✅ Products có các field: `_id`, `name`, `countInStock`, `price`
- ✅ Response time < 1000ms

**Kết quả kiểm thử:**
- [ ] PASSED / [ ] FAILED
- Status Code: ______
- Response Time: ______ ms
- Total Products: ______
- Out of Stock: ______
- Low Stock: ______
- In Stock: ______

---

#### **TC-INV-002: Lấy tồn kho - User thường không có quyền** ⛔

| Thuộc tính | Chi tiết |
|-----------|---------|
| **Test Case ID** | TC-INV-002 |
| **Tên** | GET Inventory - User thường không có quyền (Error 401/403) |
| **Priority** | 🔴 HIGH |
| **Phương thức** | GET |
| **Endpoint** | `/api/products/inventory` |
| **Authorization** | User Token (Regular User) |

**Mục đích kiểm thử:**
Kiểm tra API từ chối truy cập khi user không có quyền Admin.

**Request:**
```
GET http://localhost:5000/api/products/inventory
Header: Authorization: Bearer {{userToken}}
```

**Expected Response (Status 401 hoặc 403):**
```json
{
  "message": "Not authorized as an admin"
}
```

**Test Assertions:**
- ✅ Status Code ∈ [401, 403]
- ✅ Response chứa `message`
- ✅ Message chứa từ "not authorized"

**Kết quả kiểm thử:**
- [ ] PASSED / [ ] FAILED
- Status Code: ______
- Error Message: ______

---

#### **TC-INV-003: Lấy tồn kho - Không có token** ⛔

| Thuộc tính | Chi tiết |
|-----------|---------|
| **Test Case ID** | TC-INV-003 |
| **Tên** | GET Inventory - Không có authentication (Error 401) |
| **Priority** | 🔴 HIGH |
| **Phương thức** | GET |
| **Endpoint** | `/api/products/inventory` |
| **Authorization** | NONE |

**Mục đích kiểm thử:**
Kiểm tra API từ chối truy cập khi không có authentication token.

**Request:**
```
GET http://localhost:5000/api/products/inventory
```

**Expected Response (Status 401):**
```json
{
  "message": "Not authorized, no token"
}
```

**Test Assertions:**
- ✅ Status Code = 401 Unauthorized
- ✅ Response chứa `message`

**Kết quả kiểm thử:**
- [ ] PASSED / [ ] FAILED
- Status Code: ______

---

### 🔹 GROUP 2: CẬP NHẬT TỒN KHO MỘT SẢN PHẨM

#### **TC-INV-004: Cập nhật tồn kho 1 sản phẩm - Thành công** ✅

| Thuộc tính | Chi tiết |
|-----------|---------|
| **Test Case ID** | TC-INV-004 |
| **Tên** | PUT Update Stock - Cập nhật tồn kho thành công |
| **Priority** | 🔴 CRITICAL |
| **Phương thức** | PUT |
| **Endpoint** | `/api/products/:id/stock` |
| **Authorization** | Admin Token (REQUIRED) |

**Mục đích kiểm thử:**
Kiểm tra Admin có thể cập nhật số lượng tồn kho của một sản phẩm cụ thể.

**Request:**
```
PUT http://localhost:5000/api/products/{{productId}}/stock
Header: Authorization: Bearer {{adminToken}}
Content-Type: application/json

Body:
{
  "countInStock": 100
}
```

**Expected Response (Status 200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "iPhone 14 Pro",
  "countInStock": 100,
  "price": 999,
  "brand": "Apple",
  "image": "image.jpg",
  "category": "Smartphones",
  "description": "Latest iPhone",
  "rating": 4.5,
  "numReviews": 120,
  "updatedAt": "2025-12-23T10:30:00Z"
}
```

**Test Assertions:**
- ✅ Status Code = 200 OK
- ✅ Response chứa sản phẩm đã cập nhật
- ✅ `countInStock = 100` (giá trị được cập nhật)
- ✅ Các field khác của sản phẩm vẫn được bảo lưu (`name`, `price`, `brand`)
- ✅ Response time < 1000ms

**Kết quả kiểm thử:**
- [ ] PASSED / [ ] FAILED
- Status Code: ______
- Product Name: ______
- Old Stock: ______
- New Stock: 100
- Updated At: ______

---

#### **TC-INV-005: Cập nhật tồn kho về 0 (Hết hàng)** ✅

| Thuộc tính | Chi tiết |
|-----------|---------|
| **Test Case ID** | TC-INV-005 |
| **Tên** | PUT Update Stock - Đặt về 0 (Out of Stock) |
| **Priority** | 🟡 MEDIUM |
| **Phương thức** | PUT |
| **Endpoint** | `/api/products/:id/stock` |

**Mục đích kiểm thử:**
Kiểm tra hệ thống xử lý đúng khi cập nhật tồn kho về 0.

**Request:**
```
PUT http://localhost:5000/api/products/{{productId}}/stock
Header: Authorization: Bearer {{adminToken}}

Body:
{
  "countInStock": 0
}
```

**Expected Response (Status 200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "iPhone 14 Pro",
  "countInStock": 0,
  "price": 999
}
```

**Test Assertions:**
- ✅ Status Code = 200 OK
- ✅ `countInStock = 0` (sản phẩm hết hàng)

**Kết quả kiểm thử:**
- [ ] PASSED / [ ] FAILED
- Status Code: ______

---

#### **TC-INV-006: Cập nhật tồn kho - Giá trị âm (lỗi validation)** ❌

| Thuộc tính | Chi tiết |
|-----------|---------|
| **Test Case ID** | TC-INV-006 |
| **Tên** | PUT Update Stock - Giá trị âm (Error 400) |
| **Priority** | 🟡 MEDIUM |
| **Phương thức** | PUT |
| **Endpoint** | `/api/products/:id/stock` |

**Mục đích kiểm thử:**
Kiểm tra API từ chối giá trị tồn kho âm (không hợp lệ).

**Request:**
```
PUT http://localhost:5000/api/products/{{productId}}/stock

Body:
{
  "countInStock": -5
}
```

**Expected Response (Status 400):**
```json
{
  "message": "Stock quantity must be non-negative"
}
```

**Test Assertions:**
- ✅ Status Code = 400 Bad Request
- ✅ Response chứa error message

**Kết quả kiểm thử:**
- [ ] PASSED / [ ] FAILED
- Status Code: ______
- Error Message: ______

---

#### **TC-INV-007: Cập nhật tồn kho - ID không hợp lệ (404)** ❌

| Thuộc tính | Chi tiết |
|-----------|---------|
| **Test Case ID** | TC-INV-007 |
| **Tên** | PUT Update Stock - ID không hợp lệ (Error 404) |
| **Priority** | 🟡 MEDIUM |
| **Phương thức** | PUT |
| **Endpoint** | `/api/products/:id/stock` |

**Mục đích kiểm thử:**
Kiểm tra API xử lý đúng khi ID sản phẩm không tồn tại.

**Request:**
```
PUT http://localhost:5000/api/products/invalid-id/stock

Body:
{
  "countInStock": 50
}
```

**Expected Response (Status 404):**
```json
{
  "message": "Product not found"
}
```

**Test Assertions:**
- ✅ Status Code = 404 Not Found
- ✅ Response chứa error message

**Kết quả kiểm thử:**
- [ ] PASSED / [ ] FAILED
- Status Code: ______

---

#### **TC-INV-008: Cập nhật tồn kho - User không có quyền (403)** ⛔

| Thuộc tính | Chi tiết |
|-----------|---------|
| **Test Case ID** | TC-INV-008 |
| **Tên** | PUT Update Stock - User không có quyền Admin (Error 403) |
| **Priority** | 🔴 HIGH |
| **Phương thức** | PUT |
| **Endpoint** | `/api/products/:id/stock` |
| **Authorization** | User Token (Regular User) |

**Mục đích kiểm thử:**
Kiểm tra API từ chối cập nhật khi user không phải là Admin.

**Request:**
```
PUT http://localhost:5000/api/products/{{productId}}/stock
Header: Authorization: Bearer {{userToken}}

Body:
{
  "countInStock": 50
}
```

**Expected Response (Status 401/403):**
```json
{
  "message": "Not authorized as an admin"
}
```

**Test Assertions:**
- ✅ Status Code ∈ [401, 403]
- ✅ Response chứa error message

**Kết quả kiểm thử:**
- [ ] PASSED / [ ] FAILED
- Status Code: ______

---

### 🔹 GROUP 3: CẬP NHẬT TỒN KHO HÀNG LOẠT (BULK UPDATE)

#### **TC-INV-009: Cập nhật tồn kho hàng loạt - Thành công** ✅

| Thuộc tính | Chi tiết |
|-----------|---------|
| **Test Case ID** | TC-INV-009 |
| **Tên** | PUT Bulk Update Stock - Cập nhật nhiều sản phẩm cùng lúc |
| **Priority** | 🔴 CRITICAL |
| **Phương thức** | PUT |
| **Endpoint** | `/api/products/bulk-stock` |
| **Authorization** | Admin Token (REQUIRED) |

**Mục đích kiểm thử:**
Kiểm tra Admin có thể cập nhật tồn kho cho nhiều sản phẩm cùng một lúc.

**Request:**
```
PUT http://localhost:5000/api/products/bulk-stock
Header: Authorization: Bearer {{adminToken}}
Content-Type: application/json

Body:
{
  "products": [
    {
      "_id": "{{productId}}",
      "countInStock": 150
    },
    {
      "_id": "{{productId2}}",
      "countInStock": 200
    }
  ]
}
```

**Expected Response (Status 200):**
```json
{
  "message": "Bulk stock update successful",
  "updated": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "iPhone 14 Pro",
      "countInStock": 150
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Samsung Galaxy S23",
      "countInStock": 200
    }
  ],
  "failed": []
}
```

**Test Assertions:**
- ✅ Status Code = 200 OK
- ✅ Response chứa `updated` (array)
- ✅ Số lượng sản phẩm được cập nhật đúng
- ✅ Mỗi sản phẩm có các field: `_id`, `name`, `countInStock`

**Kết quả kiểm thử:**
- [ ] PASSED / [ ] FAILED
- Status Code: ______
- Products Updated: ______
- Failed Updates: ______

---

#### **TC-INV-010: Cập nhật hàng loạt - Mảng rỗng (lỗi validation)** ❌

| Thuộc tính | Chi tiết |
|-----------|---------|
| **Test Case ID** | TC-INV-010 |
| **Tên** | PUT Bulk Update - Mảng rỗng (Error 400) |
| **Priority** | 🟡 MEDIUM |
| **Phương thức** | PUT |
| **Endpoint** | `/api/products/bulk-stock` |

**Mục đích kiểm thử:**
Kiểm tra API từ chối request với danh sách sản phẩm rỗng.

**Request:**
```
PUT http://localhost:5000/api/products/bulk-stock
Header: Authorization: Bearer {{adminToken}}

Body:
{
  "products": []
}
```

**Expected Response (Status 400):**
```json
{
  "message": "Products array cannot be empty"
}
```

**Test Assertions:**
- ✅ Status Code = 400 Bad Request
- ✅ Response chứa error message

**Kết quả kiểm thử:**
- [ ] PASSED / [ ] FAILED
- Status Code: ______

---

#### **TC-INV-011: Cập nhật hàng loạt - User không có quyền (403)** ⛔

| Thuộc tính | Chi tiết |
|-----------|---------|
| **Test Case ID** | TC-INV-011 |
| **Tên** | PUT Bulk Update - User không có quyền Admin (Error 403) |
| **Priority** | 🔴 HIGH |
| **Phương thức** | PUT |
| **Endpoint** | `/api/products/bulk-stock` |
| **Authorization** | User Token (Regular User) |

**Mục đích kiểm thử:**
Kiểm tra API từ chối cập nhật hàng loạt khi user không phải Admin.

**Request:**
```
PUT http://localhost:5000/api/products/bulk-stock
Header: Authorization: Bearer {{userToken}}

Body:
{
  "products": [
    {
      "_id": "{{productId}}",
      "countInStock": 150
    }
  ]
}
```

**Expected Response (Status 401/403):**
```json
{
  "message": "Not authorized as an admin"
}
```

**Test Assertions:**
- ✅ Status Code ∈ [401, 403]
- ✅ Response chứa error message

**Kết quả kiểm thử:**
- [ ] PASSED / [ ] FAILED
- Status Code: ______

---

## 📈 TÓMLỰC KẾT QUẢ KIỂM THỬ

### Bảng Tóm Tắt Kết Quả

| ID | Tên Test Case | Expected | Actual | Status | Ghi chú |
|-----|---------------|----------|--------|--------|---------|
| TC-INV-001 | Lấy tồn kho - Thành công | 200 | | ☐ ✅ / ☐ ❌ | |
| TC-INV-002 | Lấy tồn kho - User thường | 401/403 | | ☐ ✅ / ☐ ❌ | |
| TC-INV-003 | Lấy tồn kho - Không token | 401 | | ☐ ✅ / ☐ ❌ | |
| TC-INV-004 | Cập nhật tồn kho - Thành công | 200 | | ☐ ✅ / ☐ ❌ | |
| TC-INV-005 | Cập nhật về 0 - Thành công | 200 | | ☐ ✅ / ☐ ❌ | |
| TC-INV-006 | Cập nhật giá trị âm | 400 | | ☐ ✅ / ☐ ❌ | |
| TC-INV-007 | Cập nhật ID không hợp lệ | 404 | | ☐ ✅ / ☐ ❌ | |
| TC-INV-008 | Cập nhật - User không có quyền | 401/403 | | ☐ ✅ / ☐ ❌ | |
| TC-INV-009 | Cập nhật hàng loạt - Thành công | 200 | | ☐ ✅ / ☐ ❌ | |
| TC-INV-010 | Cập nhật hàng loạt - Mảng rỗng | 400 | | ☐ ✅ / ☐ ❌ | |
| TC-INV-011 | Cập nhật hàng loạt - Không có quyền | 401/403 | | ☐ ✅ / ☐ ❌ | |

### Thống Kê
- **Tổng Test Cases:** 11
- **Passed:** ___ / 11
- **Failed:** ___ / 11
- **Pass Rate:** ___%

---

## 🚀 HƯỚNG DẪN CHẠY KIỂM THỬ

### Cách 1: Chạy từng Test Case
1. Chọn một request trong collection
2. Click **Send**
3. Xem kết quả trong tab **Tests** (tự động chạy)

### Cách 2: Chạy tất cả Test Cases
1. Mở Collection
2. Click **Run**
3. Chọn Environment `QBShop - Inventory`
4. Click **Run QBShop - Inventory Management API**
5. Xem báo cáo chi tiết

---

## 📝 GHI CHÚ QUAN TRỌNG

1. **Token Admin:** Lấy từ tài khoản admin đầu tiên khi khởi tạo hệ thống
2. **Token User:** Lấy từ tài khoản user thường (không phải admin)
3. **Product IDs:** Lấy từ API `GET /api/products` 
4. **Base URL:** Mặc định là `http://localhost:5000`, thay đổi nếu API chạy trên port khác

---

**Tester:** ________________  
**Ngày kiểm thử:** ________________  
**Chữ ký:** ________________
