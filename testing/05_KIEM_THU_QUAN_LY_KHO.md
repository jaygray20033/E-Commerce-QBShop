# 5.7. MODULE 5: KIỂM THỬ QUẢN LÝ TỒN KHO (INVENTORY MANAGEMENT)

Mô tả: Module này kiểm thử các chức năng quản lý tồn kho sản phẩm, bao gồm:

- Xem thông tin tồn kho tổng quan và thống kê
- Cập nhật số lượng tồn kho cho từng sản phẩm
- Cập nhật tồn kho hàng loạt (bulk update)

Base API: `/api/products`

**Danh sách API Endpoints:**
| Method | Endpoint | Mô tả | Auth |
|--------|-----------------------------|---------------------------------|-----------|
| GET | /api/products/inventory | Lấy thông tin tồn kho | Admin |
| PUT | /api/products/:id/stock | Cập nhật tồn kho 1 sản phẩm | Admin |
| PUT | /api/products/bulk-stock | Cập nhật tồn kho hàng loạt | Admin |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 5.7.1. TC-INV-001: Lấy thông tin tồn kho tổng quan

┌────────────────────────────────────────────────────────────────────┐
│ Test Case ID: TC-INV-001 │
│ Test Case Name: GET Inventory - Lấy thông tin tồn kho và thống kê │
│ Priority: HIGH │
│ Tester: [Điền tên] │
│ Date Tested: [Điền ngày] │
└────────────────────────────────────────────────────────────────────┘

**API Endpoint:** GET {{base_url}}/api/products/inventory
**Authentication:** REQUIRED (Admin only)
**Method:** GET

**Mục đích kiểm thử:**
Kiểm tra API trả về danh sách sản phẩm với thông tin tồn kho và các thống kê
tổng quan về tình trạng kho hàng.

**Kết quả mong đợi:**

- Status Code: 200 OK
- Response Body chứa:
  • products: Array chứa danh sách sản phẩm với thông tin tồn kho
  • stats: Object chứa thống kê (totalProducts, outOfStock, lowStock, inStock, totalValue)

**Postman Tests Script:**

```javascript
pm.test('TC-INV-001: Status code is 200', () => {
  pm.response.to.have.status(200);
});

pm.test('TC-INV-001: Response contains products array', () => {
  const jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property('products');
  pm.expect(jsonData.products).to.be.an('array');
});

pm.test('TC-INV-001: Response contains stats object', () => {
  const jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property('stats');
  pm.expect(jsonData.stats).to.be.an('object');
});

pm.test('TC-INV-001: Stats has all required fields', () => {
  const stats = pm.response.json().stats;
  pm.expect(stats).to.have.property('totalProducts');
  pm.expect(stats).to.have.property('outOfStock');
  pm.expect(stats).to.have.property('lowStock');
  pm.expect(stats).to.have.property('inStock');
  pm.expect(stats).to.have.property('totalValue');
});

pm.test('TC-INV-001: Stats values are numbers', () => {
  const stats = pm.response.json().stats;
  pm.expect(stats.totalProducts).to.be.a('number');
  pm.expect(stats.outOfStock).to.be.a('number');
  pm.expect(stats.lowStock).to.be.a('number');
  pm.expect(stats.inStock).to.be.a('number');
  pm.expect(stats.totalValue).to.be.a('number');
});

pm.test('TC-INV-001: Stats logic is correct', () => {
  const stats = pm.response.json().stats;
  // outOfStock + lowStock + inStock should equal totalProducts
  pm.expect(stats.outOfStock + stats.lowStock + stats.inStock).to.eql(
    stats.totalProducts
  );
});

pm.test('TC-INV-001: Products have inventory fields', () => {
  const products = pm.response.json().products;
  if (products.length > 0) {
    const product = products[0];
    pm.expect(product).to.have.property('_id');
    pm.expect(product).to.have.property('name');
    pm.expect(product).to.have.property('countInStock');
    pm.expect(product).to.have.property('price');
  }
});

pm.test('TC-INV-001: Response time < 500ms', () => {
  pm.expect(pm.response.responseTime).to.be.below(500);
});
```

**KẾT QUẢ KIỂM THỬ THỰC TẾ:**
┌────────────────────────────────────────────────────────────────────┐
│ ☐ PASSED / ☐ FAILED │
├────────────────────────────────────────────────────────────────────┤
│ Status Code: [Điền sau khi test] │
│ Response Time: [Điền sau khi test] │
│ Total Products: [Điền sau khi test] │
│ Out of Stock: [Điền sau khi test] │
│ Low Stock (≤10): [Điền sau khi test] │
│ In Stock (>10): [Điền sau khi test] │
│ Total Value: [Điền sau khi test] VNĐ │
├────────────────────────────────────────────────────────────────────┤
│ Sample Response Body: │
│ [Paste response thực tế từ Postman] │
└────────────────────────────────────────────────────────────────────┘

**Nhận xét:**
[Điền nhận xét sau khi test]

[Ảnh chụp màn hình Postman cho TC-INV-001]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 5.7.2. TC-INV-002: Lấy tồn kho - Không có quyền Admin

┌────────────────────────────────────────────────────────────────────┐
│ Test Case ID: TC-INV-002 │
│ Test Case Name: GET Inventory - User thường không có quyền │
│ Priority: HIGH │
│ Tester: [Điền tên] │
│ Date Tested: [Điền ngày] │
└────────────────────────────────────────────────────────────────────┘

**API Endpoint:** GET {{base_url}}/api/products/inventory
**Authentication:** User token (không phải Admin)
**Method:** GET

**Mục đích kiểm thử:**
Kiểm tra API từ chối truy cập khi user không có quyền Admin.

**Kết quả mong đợi:**

- Status Code: 401 Unauthorized hoặc 403 Forbidden
- Error message về quyền truy cập

**Postman Tests Script:**

```javascript
pm.test('TC-INV-002: Status code is 401 or 403', () => {
  pm.expect(pm.response.code).to.be.oneOf([401, 403]);
});

pm.test('TC-INV-002: Error message about authorization', () => {
  const jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property('message');
  pm.expect(jsonData.message.toLowerCase()).to.include('not authorized');
});
```

**KẾT QUẢ KIỂM THỬ THỰC TẾ:**
┌────────────────────────────────────────────────────────────────────┐
│ ☐ PASSED / ☐ FAILED │
├────────────────────────────────────────────────────────────────────┤
│ Status Code: [Điền sau khi test] │
│ Response Time: [Điền sau khi test] │
│ Error Message: [Điền sau khi test] │
└────────────────────────────────────────────────────────────────────┘

[Ảnh chụp màn hình Postman cho TC-INV-002]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 5.7.3. TC-INV-003: Lấy tồn kho - Không có token

┌────────────────────────────────────────────────────────────────────┐
│ Test Case ID: TC-INV-003 │
│ Test Case Name: GET Inventory - Không có authentication │
│ Priority: HIGH │
│ Tester: [Điền tên] │
│ Date Tested: [Điền ngày] │
└────────────────────────────────────────────────────────────────────┘

**API Endpoint:** GET {{base_url}}/api/products/inventory
**Authentication:** KHÔNG có token
**Method:** GET

**Mục đích kiểm thử:**
Kiểm tra API từ chối truy cập khi không có authentication token.

**Kết quả mong đợi:**

- Status Code: 401 Unauthorized
- Error message: "Not authorized, no token"

**Postman Tests Script:**

```javascript
pm.test('TC-INV-003: Status code is 401', () => {
  pm.response.to.have.status(401);
});

pm.test('TC-INV-003: Error message about no token', () => {
  const jsonData = pm.response.json();
  pm.expect(jsonData.message.toLowerCase()).to.include('not authorized');
});
```

**KẾT QUẢ KIỂM THỬ THỰC TẾ:**
┌────────────────────────────────────────────────────────────────────┐
│ ☐ PASSED / ☐ FAILED │
├────────────────────────────────────────────────────────────────────┤
│ Status Code: [Điền sau khi test] │
│ Response Time: [Điền sau khi test] │
│ Error Message: [Điền sau khi test] │
└────────────────────────────────────────────────────────────────────┘

[Ảnh chụp màn hình Postman cho TC-INV-003]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 5.7.4. TC-INV-004: Cập nhật tồn kho một sản phẩm - Thành công

┌────────────────────────────────────────────────────────────────────┐
│ Test Case ID: TC-INV-004 │
│ Test Case Name: PUT Update Stock - Cập nhật tồn kho thành công │
│ Priority: CRITICAL │
│ Tester: [Điền tên] │
│ Date Tested: [Điền ngày] │
└────────────────────────────────────────────────────────────────────┘

**API Endpoint:** PUT {{base_url}}/api/products/:id/stock
**Authentication:** REQUIRED (Admin only)
**Method:** PUT
**Content-Type:** application/json

**Mục đích kiểm thử:**
Kiểm tra Admin có thể cập nhật số lượng tồn kho của một sản phẩm cụ thể.

**Request Body:**

```json
{
  "countInStock": 100
}
```

**Kết quả mong đợi:**

- Status Code: 200 OK
- Response chứa sản phẩm với countInStock đã được cập nhật

**Postman Tests Script:**

```javascript
pm.test('TC-INV-004: Status code is 200', () => {
  pm.response.to.have.status(200);
});

pm.test('TC-INV-004: Stock updated correctly', () => {
  const product = pm.response.json();
  pm.expect(product).to.have.property('_id');
  pm.expect(product).to.have.property('countInStock');
  pm.expect(product.countInStock).to.eql(100);
});

pm.test('TC-INV-004: Product info preserved', () => {
  const product = pm.response.json();
  pm.expect(product).to.have.property('name');
  pm.expect(product).to.have.property('price');
  pm.expect(product).to.have.property('brand');
});

pm.test('TC-INV-004: Response time < 500ms', () => {
  pm.expect(pm.response.responseTime).to.be.below(500);
});
```

**KẾT QUẢ KIỂM THỬ THỰC TẾ:**
┌────────────────────────────────────────────────────────────────────┐
│ ☐ PASSED / ☐ FAILED │
├────────────────────────────────────────────────────────────────────┤
│ Status Code: [Điền sau khi test] │
│ Response Time: [Điền sau khi test] │
│ Product Name: [Điền sau khi test] │
│ Old Stock: [Điền sau khi test] │
│ New Stock: [Điền sau khi test] │
│ Updated At: [Điền sau khi test] │
└────────────────────────────────────────────────────────────────────┘

[Ảnh chụp màn hình Postman cho TC-INV-004]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 5.7.5. TC-INV-005: Cập nhật tồn kho - Đặt về 0 (Hết hàng)

┌────────────────────────────────────────────────────────────────────┐
│ Test Case ID: TC-INV-005 │
│ Test Case Name: PUT Update Stock to 0 - Đánh dấu hết hàng │
│ Priority: HIGH │
│ Tester: [Điền tên] │
│ Date Tested: [Điền ngày] │
└────────────────────────────────────────────────────────────────────┘

**API Endpoint:** PUT {{base_url}}/api/products/:id/stock
**Authentication:** REQUIRED (Admin only)
**Method:** PUT

**Request Body:**

```json
{
  "countInStock": 0
}
```

**Mục đích kiểm thử:**
Kiểm tra có thể đặt số lượng tồn kho về 0 để đánh dấu sản phẩm hết hàng.

**Kết quả mong đợi:**

- Status Code: 200 OK
- countInStock = 0

**Postman Tests Script:**

```javascript
pm.test('TC-INV-005: Status code is 200', () => {
  pm.response.to.have.status(200);
});

pm.test('TC-INV-005: Stock set to 0 (out of stock)', () => {
  const product = pm.response.json();
  pm.expect(product.countInStock).to.eql(0);
});

pm.test('TC-INV-005: Product still exists', () => {
  const product = pm.response.json();
  pm.expect(product._id).to.exist;
  pm.expect(product.name).to.exist;
});
```

**KẾT QUẢ KIỂM THỬ THỰC TẾ:**
┌────────────────────────────────────────────────────────────────────┐
│ ☐ PASSED / ☐ FAILED │
├────────────────────────────────────────────────────────────────────┤
│ Status Code: [Điền sau khi test] │
│ Response Time: [Điền sau khi test] │
│ Stock Count: [Điền sau khi test] │
│ Status: [Điền sau khi test] │
└────────────────────────────────────────────────────────────────────┘

[Ảnh chụp màn hình Postman cho TC-INV-005]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 5.7.6. TC-INV-006: Cập nhật tồn kho - Số âm (Negative Test)

┌────────────────────────────────────────────────────────────────────┐
│ Test Case ID: TC-INV-006 │
│ Test Case Name: PUT Update Stock Negative - Số lượng âm │
│ Priority: HIGH │
│ Tester: [Điền tên] │
│ Date Tested: [Điền ngày] │
└────────────────────────────────────────────────────────────────────┘

**API Endpoint:** PUT {{base_url}}/api/products/:id/stock
**Authentication:** REQUIRED (Admin only)
**Method:** PUT

**Request Body:**

```json
{
  "countInStock": -10
}
```

**Mục đích kiểm thử:**
Kiểm tra API xử lý khi cập nhật số lượng tồn kho âm (không hợp lệ về logic).

**Kết quả mong đợi (Lý tưởng):**

- Status Code: 400 Bad Request
- Error message: "Số lượng tồn kho không được âm"

**Kết quả thực tế có thể xảy ra (BUG):**

- Status Code: 200 OK (API chấp nhận giá trị âm)

**Postman Tests Script:**

```javascript
// Test cho trường hợp lý tưởng (có validation)
pm.test('TC-INV-006: Should reject negative stock (ideal)', () => {
  // Nếu API có validation đúng
  if (pm.response.code === 400) {
    pm.expect(pm.response.json().message).to.exist;
    console.log('✓ API correctly rejects negative stock');
  } else {
    // Nếu API chấp nhận (BUG)
    console.log('⚠️ BUG: API accepts negative stock value!');
    console.log('Actual stock:', pm.response.json().countInStock);
  }
});

pm.test('TC-INV-006: Check actual behavior', () => {
  const status = pm.response.code;
  if (status === 200) {
    // BUG detected
    pm.test('TC-INV-006: BUG - Negative stock accepted', () => {
      const product = pm.response.json();
      console.log('⚠️ BUG DETECTED: countInStock =', product.countInStock);
      // Fail test để đánh dấu bug
      pm.expect(product.countInStock).to.be.at.least(0);
    });
  } else if (status === 400) {
    pm.test('TC-INV-006: Validation works correctly', () => {
      pm.response.to.have.status(400);
    });
  }
});
```

**KẾT QUẢ KIỂM THỬ THỰC TẾ:**
┌────────────────────────────────────────────────────────────────────┐
│ ☐ PASSED / ☐ FAILED / ☐ BUG DETECTED │
├────────────────────────────────────────────────────────────────────┤
│ Expected Status: 400 Bad Request │
│ Actual Status: [Điền sau khi test] │
│ Response Time: [Điền sau khi test] │
│ Actual Stock: [Điền sau khi test] │
├────────────────────────────────────────────────────────────────────┤
│ BUG DETECTED (nếu có): │
│ Severity: [HIGH/MEDIUM/LOW] │
│ Description: [Mô tả bug] │
│ Impact: [Ảnh hưởng] │
└────────────────────────────────────────────────────────────────────┘

[Ảnh chụp màn hình Postman cho TC-INV-006]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 5.7.7. TC-INV-007: Cập nhật tồn kho - Sản phẩm không tồn tại

┌────────────────────────────────────────────────────────────────────┐
│ Test Case ID: TC-INV-007 │
│ Test Case Name: PUT Update Stock - Product Not Found │
│ Priority: MEDIUM │
│ Tester: [Điền tên] │
│ Date Tested: [Điền ngày] │
└────────────────────────────────────────────────────────────────────┘

**API Endpoint:** PUT {{base_url}}/api/products/000000000000000000000000/stock
**Authentication:** REQUIRED (Admin only)
**Method:** PUT

**Request Body:**

```json
{
  "countInStock": 50
}
```

**Mục đích kiểm thử:**
Kiểm tra API xử lý khi cập nhật tồn kho cho sản phẩm không tồn tại.

**Kết quả mong đợi:**

- Status Code: 404 Not Found
- Error message: "Product not found"

**Postman Tests Script:**

```javascript
pm.test('TC-INV-007: Status code is 404', () => {
  pm.response.to.have.status(404);
});

pm.test('TC-INV-007: Error message is correct', () => {
  const jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property('message');
  pm.expect(jsonData.message.toLowerCase()).to.include('not found');
});
```

**KẾT QUẢ KIỂM THỬ THỰC TẾ:**
┌────────────────────────────────────────────────────────────────────┐
│ ☐ PASSED / ☐ FAILED │
├────────────────────────────────────────────────────────────────────┤
│ Status Code: [Điền sau khi test] │
│ Response Time: [Điền sau khi test] │
│ Error Message: [Điền sau khi test] │
└────────────────────────────────────────────────────────────────────┘

[Ảnh chụp màn hình Postman cho TC-INV-007]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 5.7.8. TC-INV-008: Cập nhật tồn kho - ID không hợp lệ

┌────────────────────────────────────────────────────────────────────┐
│ Test Case ID: TC-INV-008 │
│ Test Case Name: PUT Update Stock - Invalid ObjectId Format │
│ Priority: MEDIUM │
│ Tester: [Điền tên] │
│ Date Tested: [Điền ngày] │
└────────────────────────────────────────────────────────────────────┘

**API Endpoint:** PUT {{base_url}}/api/products/invalid-id-format/stock
**Authentication:** REQUIRED (Admin only)
**Method:** PUT

**Request Body:**

```json
{
  "countInStock": 50
}
```

**Mục đích kiểm thử:**
Kiểm tra API xử lý khi ID sản phẩm không đúng format ObjectId.

**Kết quả mong đợi:**

- Status Code: 400 Bad Request hoặc 404 Not Found
- Error message về Invalid ObjectId

**Postman Tests Script:**

```javascript
pm.test('TC-INV-008: Status code is 400 or 404', () => {
  pm.expect(pm.response.code).to.be.oneOf([400, 404]);
});

pm.test('TC-INV-008: Error message about invalid ID', () => {
  const jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property('message');
  const msg = jsonData.message.toLowerCase();
  pm.expect(msg).to.satisfy(
    (m) => m.includes('invalid') || m.includes('not found')
  );
});
```

**KẾT QUẢ KIỂM THỬ THỰC TẾ:**
┌────────────────────────────────────────────────────────────────────┐
│ ☐ PASSED / ☐ FAILED │
├────────────────────────────────────────────────────────────────────┤
│ Status Code: [Điền sau khi test] │
│ Response Time: [Điền sau khi test] │
│ Error Message: [Điền sau khi test] │
└────────────────────────────────────────────────────────────────────┘

[Ảnh chụp màn hình Postman cho TC-INV-008]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 5.7.9. TC-INV-009: Cập nhật tồn kho - User thường không có quyền

┌────────────────────────────────────────────────────────────────────┐
│ Test Case ID: TC-INV-009 │
│ Test Case Name: PUT Update Stock - Non-Admin User Blocked │
│ Priority: HIGH │
│ Tester: [Điền tên] │
│ Date Tested: [Điền ngày] │
└────────────────────────────────────────────────────────────────────┘

**API Endpoint:** PUT {{base_url}}/api/products/:id/stock
**Authentication:** User token (không phải Admin)
**Method:** PUT

**Request Body:**

```json
{
  "countInStock": 999
}
```

**Mục đích kiểm thử:**
Kiểm tra user thường không thể cập nhật tồn kho sản phẩm.

**Kết quả mong đợi:**

- Status Code: 401 Unauthorized hoặc 403 Forbidden
- Error message về quyền admin

**Postman Tests Script:**

```javascript
pm.test('TC-INV-009: Status code is 401 or 403', () => {
  pm.expect(pm.response.code).to.be.oneOf([401, 403]);
});

pm.test('TC-INV-009: Error message about admin rights', () => {
  const jsonData = pm.response.json();
  pm.expect(jsonData.message.toLowerCase()).to.include('not authorized');
});
```

**KẾT QUẢ KIỂM THỬ THỰC TẾ:**
┌────────────────────────────────────────────────────────────────────┐
│ ☐ PASSED / ☐ FAILED │
├────────────────────────────────────────────────────────────────────┤
│ Status Code: [Điền sau khi test] │
│ Response Time: [Điền sau khi test] │
│ Error Message: [Điền sau khi test] │
└────────────────────────────────────────────────────────────────────┘

[Ảnh chụp màn hình Postman cho TC-INV-009]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 5.7.10. TC-INV-010: Cập nhật tồn kho hàng loạt - Thành công

┌────────────────────────────────────────────────────────────────────┐
│ Test Case ID: TC-INV-010 │
│ Test Case Name: PUT Bulk Stock Update - Cập nhật nhiều SP │
│ Priority: CRITICAL │
│ Tester: [Điền tên] │
│ Date Tested: [Điền ngày] │
└────────────────────────────────────────────────────────────────────┘

**API Endpoint:** PUT {{base_url}}/api/products/bulk-stock
**Authentication:** REQUIRED (Admin only)
**Method:** PUT
**Content-Type:** application/json

**Mục đích kiểm thử:**
Kiểm tra Admin có thể cập nhật số lượng tồn kho cho nhiều sản phẩm cùng lúc.

**Request Body:**

```json
{
  "updates": [
    { "productId": "{{productId1}}", "countInStock": 50 },
    { "productId": "{{productId2}}", "countInStock": 75 },
    { "productId": "{{productId3}}", "countInStock": 30 }
  ]
}
```

**Kết quả mong đợi:**

- Status Code: 200 OK
- Response chứa message và results (success, failed arrays)
- Tất cả sản phẩm được cập nhật thành công

**Postman Tests Script:**

```javascript
pm.test('TC-INV-010: Status code is 200', () => {
  pm.response.to.have.status(200);
});

pm.test('TC-INV-010: Response has message', () => {
  const jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property('message');
});

pm.test('TC-INV-010: Response has results object', () => {
  const jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property('results');
  pm.expect(jsonData.results).to.have.property('success');
  pm.expect(jsonData.results).to.have.property('failed');
});

pm.test('TC-INV-010: Success array has updated products', () => {
  const results = pm.response.json().results;
  pm.expect(results.success).to.be.an('array');
  pm.expect(results.success.length).to.be.above(0);
});

pm.test('TC-INV-010: Updated products have correct stock', () => {
  const results = pm.response.json().results;
  results.success.forEach((product) => {
    pm.expect(product).to.have.property('_id');
    pm.expect(product).to.have.property('name');
    pm.expect(product).to.have.property('countInStock');
    pm.expect(product.countInStock).to.be.a('number');
  });
});

pm.test('TC-INV-010: No failures for valid products', () => {
  const results = pm.response.json().results;
  pm.expect(results.failed.length).to.eql(0);
});

pm.test('TC-INV-010: Response time < 1000ms', () => {
  pm.expect(pm.response.responseTime).to.be.below(1000);
});
```

**KẾT QUẢ KIỂM THỬ THỰC TẾ:**
┌────────────────────────────────────────────────────────────────────┐
│ ☐ PASSED / ☐ FAILED │
├────────────────────────────────────────────────────────────────────┤
│ Status Code: [Điền sau khi test] │
│ Response Time: [Điền sau khi test] │
│ Success Count: [Điền sau khi test] │
│ Failed Count: [Điền sau khi test] │
│ Message: [Điền sau khi test] │
├────────────────────────────────────────────────────────────────────┤
│ Updated Products: │
│ 1. [Product Name] - Stock: [New Value] │
│ 2. [Product Name] - Stock: [New Value] │
│ 3. [Product Name] - Stock: [New Value] │
└────────────────────────────────────────────────────────────────────┘

[Ảnh chụp màn hình Postman cho TC-INV-010]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 5.7.11. TC-INV-011: Bulk Update - Một số sản phẩm không tồn tại

┌────────────────────────────────────────────────────────────────────┐
│ Test Case ID: TC-INV-011 │
│ Test Case Name: PUT Bulk Stock - Partial Success │
│ Priority: HIGH │
│ Tester: [Điền tên] │
│ Date Tested: [Điền ngày] │
└────────────────────────────────────────────────────────────────────┘

**API Endpoint:** PUT {{base_url}}/api/products/bulk-stock
**Authentication:** REQUIRED (Admin only)
**Method:** PUT

**Request Body:**

```json
{
  "updates": [
    { "productId": "{{productId1}}", "countInStock": 100 },
    { "productId": "000000000000000000000000", "countInStock": 50 },
    { "productId": "111111111111111111111111", "countInStock": 25 }
  ]
}
```

**Mục đích kiểm thử:**
Kiểm tra API xử lý khi một số sản phẩm trong danh sách không tồn tại.
API nên cập nhật các sản phẩm hợp lệ và báo lỗi cho các sản phẩm không tồn tại.

**Kết quả mong đợi:**

- Status Code: 200 OK
- success array: 1 sản phẩm (productId1)
- failed array: 2 sản phẩm với lý do "Không tìm thấy sản phẩm"

**Postman Tests Script:**

```javascript
pm.test('TC-INV-011: Status code is 200', () => {
  pm.response.to.have.status(200);
});

pm.test('TC-INV-011: Has partial success', () => {
  const results = pm.response.json().results;
  pm.expect(results.success.length).to.eql(1);
});

pm.test('TC-INV-011: Has failures for non-existent products', () => {
  const results = pm.response.json().results;
  pm.expect(results.failed.length).to.eql(2);
});

pm.test('TC-INV-011: Failed items have error reason', () => {
  const results = pm.response.json().results;
  results.failed.forEach((item) => {
    pm.expect(item).to.have.property('productId');
    pm.expect(item).to.have.property('error');
    pm.expect(item.error).to.include('Không tìm thấy');
  });
});

pm.test('TC-INV-011: Message reflects partial success', () => {
  const jsonData = pm.response.json();
  pm.expect(jsonData.message).to.include('1');
  pm.expect(jsonData.message).to.include('2');
});
```

**KẾT QUẢ KIỂM THỬ THỰC TẾ:**
┌────────────────────────────────────────────────────────────────────┐
│ ☐ PASSED / ☐ FAILED │
├────────────────────────────────────────────────────────────────────┤
│ Status Code: [Điền sau khi test] │
│ Response Time: [Điền sau khi test] │
│ Success Count: [Điền sau khi test] │
│ Failed Count: [Điền sau khi test] │
│ Message: [Điền sau khi test] │
├────────────────────────────────────────────────────────────────────┤
│ Failed Items: │
│ 1. ProductId: [ID] - Error: [Reason] │
│ 2. ProductId: [ID] - Error: [Reason] │
└────────────────────────────────────────────────────────────────────┘

[Ảnh chụp màn hình Postman cho TC-INV-011]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 5.7.12. TC-INV-012: Bulk Update - Mảng rỗng

┌────────────────────────────────────────────────────────────────────┐
│ Test Case ID: TC-INV-012 │
│ Test Case Name: PUT Bulk Stock - Empty Array │
│ Priority: MEDIUM │
│ Tester: [Điền tên] │
│ Date Tested: [Điền ngày] │
└────────────────────────────────────────────────────────────────────┘

**API Endpoint:** PUT {{base_url}}/api/products/bulk-stock
**Authentication:** REQUIRED (Admin only)
**Method:** PUT

**Request Body:**

```json
{
  "updates": []
}
```

**Mục đích kiểm thử:**
Kiểm tra API xử lý khi gửi mảng updates rỗng.

**Kết quả mong đợi:**

- Status Code: 400 Bad Request
- Error message: "Vui lòng cung cấp danh sách cập nhật"

**Postman Tests Script:**

```javascript
pm.test('TC-INV-012: Status code is 400', () => {
  pm.response.to.have.status(400);
});

pm.test('TC-INV-012: Error message is correct', () => {
  const jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property('message');
  pm.expect(jsonData.message).to.include('Vui lòng cung cấp');
});
```

**KẾT QUẢ KIỂM THỬ THỰC TẾ:**
┌────────────────────────────────────────────────────────────────────┐
│ ☐ PASSED / ☐ FAILED │
├────────────────────────────────────────────────────────────────────┤
│ Status Code: [Điền sau khi test] │
│ Response Time: [Điền sau khi test] │
│ Error Message: [Điền sau khi test] │
└────────────────────────────────────────────────────────────────────┘

[Ảnh chụp màn hình Postman cho TC-INV-012]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 5.7.13. TC-INV-013: Bulk Update - Không có trường updates

┌────────────────────────────────────────────────────────────────────┐
│ Test Case ID: TC-INV-013 │
│ Test Case Name: PUT Bulk Stock - Missing updates field │
│ Priority: MEDIUM │
│ Tester: [Điền tên] │
│ Date Tested: [Điền ngày] │
└────────────────────────────────────────────────────────────────────┘

**API Endpoint:** PUT {{base_url}}/api/products/bulk-stock
**Authentication:** REQUIRED (Admin only)
**Method:** PUT

**Request Body:**

```json
{}
```

**Mục đích kiểm thử:**
Kiểm tra API xử lý khi request body không có trường updates.

**Kết quả mong đợi:**

- Status Code: 400 Bad Request
- Error message về thiếu dữ liệu

**Postman Tests Script:**

```javascript
pm.test('TC-INV-013: Status code is 400', () => {
  pm.response.to.have.status(400);
});

pm.test('TC-INV-013: Error message exists', () => {
  const jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property('message');
});
```

**KẾT QUẢ KIỂM THỬ THỰC TẾ:**
┌────────────────────────────────────────────────────────────────────┐
│ ☐ PASSED / ☐ FAILED │
├────────────────────────────────────────────────────────────────────┤
│ Status Code: [Điền sau khi test] │
│ Response Time: [Điền sau khi test] │
│ Error Message: [Điền sau khi test] │
└────────────────────────────────────────────────────────────────────┘

[Ảnh chụp màn hình Postman cho TC-INV-013]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 5.7.14. TC-INV-014: Bulk Update - User thường không có quyền

┌────────────────────────────────────────────────────────────────────┐
│ Test Case ID: TC-INV-014 │
│ Test Case Name: PUT Bulk Stock - Non-Admin User Blocked │
│ Priority: HIGH │
│ Tester: [Điền tên] │
│ Date Tested: [Điền ngày] │
└────────────────────────────────────────────────────────────────────┘

**API Endpoint:** PUT {{base_url}}/api/products/bulk-stock
**Authentication:** User token (không phải Admin)
**Method:** PUT

**Request Body:**

```json
{
  "updates": [{ "productId": "{{productId1}}", "countInStock": 999 }]
}
```

**Mục đích kiểm thử:**
Kiểm tra user thường không thể cập nhật tồn kho hàng loạt.

**Kết quả mong đợi:**

- Status Code: 401 Unauthorized hoặc 403 Forbidden
- Error message về quyền admin

**Postman Tests Script:**

```javascript
pm.test('TC-INV-014: Status code is 401 or 403', () => {
  pm.expect(pm.response.code).to.be.oneOf([401, 403]);
});

pm.test('TC-INV-014: Error message about admin rights', () => {
  const jsonData = pm.response.json();
  pm.expect(jsonData.message.toLowerCase()).to.include('not authorized');
});
```

**KẾT QUẢ KIỂM THỬ THỰC TẾ:**
┌────────────────────────────────────────────────────────────────────┐
│ ☐ PASSED / ☐ FAILED │
├────────────────────────────────────────────────────────────────────┤
│ Status Code: [Điền sau khi test] │
│ Response Time: [Điền sau khi test] │
│ Error Message: [Điền sau khi test] │
└────────────────────────────────────────────────────────────────────┘

[Ảnh chụp màn hình Postman cho TC-INV-014]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 5.7.15. TC-INV-015: Cập nhật tồn kho - Số lượng lớn

┌────────────────────────────────────────────────────────────────────┐
│ Test Case ID: TC-INV-015 │
│ Test Case Name: PUT Update Stock - Large Quantity │
│ Priority: LOW │
│ Tester: [Điền tên] │
│ Date Tested: [Điền ngày] │
└────────────────────────────────────────────────────────────────────┘

**API Endpoint:** PUT {{base_url}}/api/products/:id/stock
**Authentication:** REQUIRED (Admin only)
**Method:** PUT

**Request Body:**

```json
{
  "countInStock": 999999
}
```

**Mục đích kiểm thử:**
Kiểm tra API xử lý khi cập nhật số lượng tồn kho rất lớn (boundary test).

**Kết quả mong đợi:**

- Status Code: 200 OK
- countInStock = 999999

**Postman Tests Script:**

```javascript
pm.test('TC-INV-015: Status code is 200', () => {
  pm.response.to.have.status(200);
});

pm.test('TC-INV-015: Large stock value accepted', () => {
  const product = pm.response.json();
  pm.expect(product.countInStock).to.eql(999999);
});
```

**KẾT QUẢ KIỂM THỬ THỰC TẾ:**
┌────────────────────────────────────────────────────────────────────┐
│ ☐ PASSED / ☐ FAILED │
├────────────────────────────────────────────────────────────────────┤
│ Status Code: [Điền sau khi test] │
│ Response Time: [Điền sau khi test] │
│ Stock Count: [Điền sau khi test] │
└────────────────────────────────────────────────────────────────────┘

[Ảnh chụp màn hình Postman cho TC-INV-015]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# TỔNG KẾT MODULE 5: QUẢN LÝ TỒN KHO

┌────────────────────────────────────────────────────────────────────┐
│ SUMMARY: Inventory Management Testing Results │
├────────────────────────────────────────────────────────────────────┤
│ Total Test Cases: 15 │
│ Passed: [Điền sau khi test] ✓ │
│ Failed: [Điền sau khi test] ✗ │
│ Pass Rate: [Điền sau khi test]% │
│ Bugs Found: [Điền sau khi test] │
│ Avg Response Time: [Điền sau khi test]ms │
├────────────────────────────────────────────────────────────────────┤
│ API Endpoints Coverage: │
│ ☐ GET /api/products/inventory [Admin] - [X/3] passed │
│ ☐ PUT /api/products/:id/stock [Admin] - [X/6] passed │
│ ☐ PUT /api/products/bulk-stock [Admin] - [X/5] passed │
└────────────────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## BẢNG TỔNG HỢP KẾT QUẢ

| Test Case  | Mô tả                        | Expected | Actual | Status |
| ---------- | ---------------------------- | -------- | ------ | ------ |
| TC-INV-001 | GET Inventory - Admin        | 200      |        | ☐      |
| TC-INV-002 | GET Inventory - User thường  | 401/403  |        | ☐      |
| TC-INV-003 | GET Inventory - Không token  | 401      |        | ☐      |
| TC-INV-004 | PUT Stock - Thành công       | 200      |        | ☐      |
| TC-INV-005 | PUT Stock = 0 (Hết hàng)     | 200      |        | ☐      |
| TC-INV-006 | PUT Stock âm (Negative)      | 400      |        | ☐      |
| TC-INV-007 | PUT Stock - SP không tồn tại | 404      |        | ☐      |
| TC-INV-008 | PUT Stock - ID không hợp lệ  | 400/404  |        | ☐      |
| TC-INV-009 | PUT Stock - User thường      | 401/403  |        | ☐      |
| TC-INV-010 | Bulk Stock - Thành công      | 200      |        | ☐      |
| TC-INV-011 | Bulk Stock - Partial Success | 200      |        | ☐      |
| TC-INV-012 | Bulk Stock - Mảng rỗng       | 400      |        | ☐      |
| TC-INV-013 | Bulk Stock - Thiếu updates   | 400      |        | ☐      |
| TC-INV-014 | Bulk Stock - User thường     | 401/403  |        | ☐      |
| TC-INV-015 | PUT Stock - Số lượng lớn     | 200      |        | ☐      |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## BUG SUMMARY - MODULE 5

┌────────────────────────────────────────────────────────────────────┐
│ Bug ID │ Severity │ Test Case │ Description │
├────────────────────────────────────────────────────────────────────┤
│ #INV-01 │ [?] │ TC-INV-006 │ [Điền nếu phát hiện bug] │
│ │ │ │ │
├────────────────────────────────────────────────────────────────────┤
│ #INV-02 │ [?] │ [?] │ [Điền nếu phát hiện bug] │
│ │ │ │ │
└────────────────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## KHUYẾN NGHỊ CẢI TIẾN - MODULE 5

### 1. Validation Layer

- Validate countInStock >= 0 (không cho phép số âm)
- Validate countInStock là số nguyên
- Thêm giới hạn max hợp lý (ví dụ: 1,000,000)

### 2. Business Logic

- Thêm cảnh báo khi stock thấp (< 10)
- Gửi notification khi hết hàng
- Log lịch sử thay đổi tồn kho

### 3. Code Example - Stock Validation:

```javascript
const validateStock = (req, res, next) => {
  const { countInStock } = req.body;

  if (countInStock === undefined || countInStock === null) {
    return res.status(400).json({
      message: 'Vui lòng cung cấp số lượng tồn kho',
    });
  }

  if (!Number.isInteger(Number(countInStock))) {
    return res.status(400).json({
      message: 'Số lượng tồn kho phải là số nguyên',
    });
  }

  if (Number(countInStock) < 0) {
    return res.status(400).json({
      message: 'Số lượng tồn kho không được âm',
    });
  }

  if (Number(countInStock) > 1000000) {
    return res.status(400).json({
      message: 'Số lượng tồn kho vượt quá giới hạn cho phép',
    });
  }

  next();
};
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## GHI CHÚ

- **Ngày test:** [Điền ngày]
- **Phiên bản:** [Điền version]
- **Môi trường:** [localhost / Render Production]
- **Người thực hiện:** [Điền tên]
- **Postman Collection:** QBShop_Inventory_Tests.postman_collection.json

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
