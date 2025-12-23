# BÁO CÁO KIỂM THỬ API - HỆ THỐNG QB SHOP

## Thông tin chung

| Thông tin            | Chi tiết                              |
| -------------------- | ------------------------------------- |
| **Dự án**            | QB Shop - Hệ thống thương mại điện tử |
| **Công cụ kiểm thử** | Postman v11.x, Apache JMeter          |
| **Base URL**         | http://localhost:5000                 |
| **Ngày thực hiện**   | 21/12/2024                            |
| **Người thực hiện**  | Nhóm 7 - Lớp 20251IT6084005           |

## Tài khoản test

| Vai trò | Email           | Password |
| ------- | --------------- | -------- |
| Admin   | admin@email.com | 123456   |
| User    | john@email.com  | 123456   |

---

# 1. QUẢN LÝ SẢN PHẨM CƠ BẢN (CRUD)

## 1.1. Lấy danh sách sản phẩm (GET)

| ID     | Mô tả Test Case                     | Method | Endpoint                     | Auth | Request Body | Expected | Actual Status | Actual Result                                             | Kết quả |
| ------ | ----------------------------------- | ------ | ---------------------------- | ---- | ------------ | -------- | ------------- | --------------------------------------------------------- | ------- |
| TC_P01 | Lấy danh sách tất cả sản phẩm       | GET    | /api/products                | None | N/A          | 200 OK   | 200 OK        | `{"products":[...],"page":1,"pages":5}`                   | ✓ Pass  |
| TC_P02 | Lấy danh sách với phân trang page=2 | GET    | /api/products?pageNumber=2   | None | N/A          | 200 OK   | 200 OK        | `{"products":[...],"page":2,"pages":5}`                   | ✓ Pass  |
| TC_P03 | Tìm kiếm sản phẩm theo keyword      | GET    | /api/products?keyword=iphone | None | N/A          | 200 OK   | 200 OK        | `{"products":[{"name":"iPhone 14 Pro Max"...}],"page":1}` | ✓ Pass  |
| TC_P04 | Lấy top sản phẩm đánh giá cao       | GET    | /api/products/top            | None | N/A          | 200 OK   | 200 OK        | `[{"_id":"...","name":"iPhone 14","rating":4.5},...]`     | ✓ Pass  |

## 1.2. Lấy chi tiết sản phẩm theo ID

| ID     | Mô tả Test Case               | Method | Endpoint                               | Auth | Request Body | Expected | Actual Status | Actual Result                                                                     | Kết quả |
| ------ | ----------------------------- | ------ | -------------------------------------- | ---- | ------------ | -------- | ------------- | --------------------------------------------------------------------------------- | ------- |
| TC_P05 | Lấy chi tiết SP với ID hợp lệ | GET    | /api/products/6766a5d5...              | None | N/A          | 200 OK   | 200 OK        | `{"_id":"6766a5d5...","name":"Airpods Wireless","price":8900000,"brand":"Apple"}` | ✓ Pass  |
| TC_P06 | Lấy SP với ID không tồn tại   | GET    | /api/products/000000000000000000000000 | None | N/A          | 404      | 404 Not Found | `{"message":"Product not found"}`                                                 | ✓ Pass  |
| TC_P07 | Lấy SP với ID format sai      | GET    | /api/products/abc123                   | None | N/A          | 404      | 404 Not Found | `{"message":"Invalid ObjectId of: abc123"}`                                       | ✓ Pass  |

## 1.3. Thêm sản phẩm mới (POST)

| ID     | Mô tả Test Case                      | Method | Endpoint      | Auth        | Request Body                                                                                                                                                      | Expected | Actual Status    | Actual Result                                                                                        | Kết quả |
| ------ | ------------------------------------ | ------ | ------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------------- | ---------------------------------------------------------------------------------------------------- | ------- |
| TC_P08 | Thêm SP mới đầy đủ thông tin (Admin) | POST   | /api/products | Admin Token | `{"name":"Test Product API","price":15000000,"brand":"TestBrand","category":"Điện tử","countInStock":50,"description":"Mô tả test","image":"/images/sample.jpg"}` | 201      | 201 Created      | `{"_id":"6766b2c3...","name":"Test Product API","price":15000000,"createdAt":"2024-12-21T..."}`      | ✓ Pass  |
| TC_P09 | Thêm SP thiếu trường bắt buộc (name) | POST   | /api/products | Admin Token | `{"price":10000000,"brand":"Test"}`                                                                                                                               | 400      | 400 Bad Request  | `{"message":"Please provide all required fields: name, price, brand, category, description, image"}` | ✓ Pass  |
| TC_P10 | Thêm SP khi không có quyền Admin     | POST   | /api/products | User Token  | `{"name":"Test","price":5000000}`                                                                                                                                 | 401      | 401 Unauthorized | `{"message":"Not authorized as an admin"}`                                                           | ✓ Pass  |
| TC_P11 | Thêm SP khi chưa đăng nhập           | POST   | /api/products | None        | `{"name":"Test","price":1000000}`                                                                                                                                 | 401      | 401 Unauthorized | `{"message":"Not authorized, no token"}`                                                             | ✓ Pass  |

## 1.4. Cập nhật sản phẩm (PUT)

| ID     | Mô tả Test Case                   | Method | Endpoint                               | Auth        | Request Body                                                   | Expected | Actual Status    | Actual Result                                                                         | Kết quả |
| ------ | --------------------------------- | ------ | -------------------------------------- | ----------- | -------------------------------------------------------------- | -------- | ---------------- | ------------------------------------------------------------------------------------- | ------- |
| TC_P12 | Cập nhật SP với dữ liệu hợp lệ    | PUT    | /api/products/:id                      | Admin Token | `{"name":"SP Đã Cập Nhật","price":18000000,"countInStock":45}` | 200      | 200 OK           | `{"_id":"...","name":"SP Đã Cập Nhật","price":18000000,"updatedAt":"2024-12-21T..."}` | ✓ Pass  |
| TC_P13 | Cập nhật SP với ID không tồn tại  | PUT    | /api/products/000000000000000000000000 | Admin Token | `{"name":"Updated","price":5000000}`                           | 404      | 404 Not Found    | `{"message":"Product not found"}`                                                     | ✓ Pass  |
| TC_P14 | Cập nhật SP không có quyền Admin  | PUT    | /api/products/:id                      | User Token  | `{"price":1000000}`                                            | 401      | 401 Unauthorized | `{"message":"Not authorized as an admin"}`                                            | ✓ Pass  |
| TC_P15 | Cập nhật với price = 0 (Bug Test) | PUT    | /api/products/:id                      | Admin Token | `{"name":"Test Zero","price":0,"countInStock":0}`              | 200      | 200 OK           | `{"price":0,"countInStock":0}` ⚠️ BUG: Cho phép giá = 0                               | ⚠️ Bug  |

## 1.5. Xóa sản phẩm (DELETE)

| ID     | Mô tả Test Case              | Method | Endpoint                               | Auth        | Request Body | Expected | Actual Status    | Actual Result                              | Kết quả |
| ------ | ---------------------------- | ------ | -------------------------------------- | ----------- | ------------ | -------- | ---------------- | ------------------------------------------ | ------- |
| TC_P16 | Xóa SP với ID hợp lệ (Admin) | DELETE | /api/products/:id                      | Admin Token | N/A          | 200      | 200 OK           | `{"message":"Product removed"}`            | ✓ Pass  |
| TC_P17 | Xóa SP với ID không tồn tại  | DELETE | /api/products/000000000000000000000000 | Admin Token | N/A          | 404      | 404 Not Found    | `{"message":"Product not found"}`          | ✓ Pass  |
| TC_P18 | Xóa SP không có quyền Admin  | DELETE | /api/products/:id                      | User Token  | N/A          | 401      | 401 Unauthorized | `{"message":"Not authorized as an admin"}` | ✓ Pass  |
| TC_P19 | Xóa SP khi chưa đăng nhập    | DELETE | /api/products/:id                      | None        | N/A          | 401      | 401 Unauthorized | `{"message":"Not authorized, no token"}`   | ✓ Pass  |

---

# 2. QUẢN LÝ SẢN PHẨM NÂNG CAO

## 2.1. Thêm nhiều sản phẩm cùng lúc (Bulk Create)

| ID      | Mô tả Test Case                      | Method | Endpoint           | Auth        | Request Body                                                                                                                                                                                                                                                                                                                                                | Expected | Actual Status    | Actual Result                                                                                                                                                                                                                              | Kết quả |
| ------- | ------------------------------------ | ------ | ------------------ | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| TC_PA01 | Bulk Create - Tất cả SP hợp lệ       | POST   | /api/products/bulk | Admin Token | `{"products":[{"name":"Bulk SP 1","price":500000,"brand":"Bulk","category":"Test","countInStock":20,"description":"Bulk 1"},{"name":"Bulk SP 2","price":750000,"brand":"Bulk","category":"Test","countInStock":15,"description":"Bulk 2"},{"name":"Bulk SP 3","price":1000000,"brand":"Bulk","category":"Test","countInStock":30,"description":"Bulk 3"}]}` | 201      | 201 Created      | `{"message":"Đã tạo 3 sản phẩm thành công, 0 thất bại","results":{"success":[{"_id":"...","name":"Bulk SP 1"},{"_id":"...","name":"Bulk SP 2"},{"_id":"...","name":"Bulk SP 3"}],"failed":[]}}`                                            | ✓ Pass  |
| TC_PA02 | Bulk Create - Một số SP thiếu trường | POST   | /api/products/bulk | Admin Token | `{"products":[{"name":"Valid","price":500000,"brand":"B","category":"C","description":"OK"},{"name":"No Price","brand":"B","category":"C"},{"price":100000,"brand":"B"}]}`                                                                                                                                                                                  | 201      | 201 Created      | `{"message":"Đã tạo 1 sản phẩm thành công, 2 thất bại","results":{"success":[{"_id":"...","name":"Valid"}],"failed":[{"name":"No Price","error":"Thiếu thông tin bắt buộc"},{"name":"Không có tên","error":"Thiếu thông tin bắt buộc"}]}}` | ✓ Pass  |
| TC_PA03 | Bulk Create - Mảng rỗng              | POST   | /api/products/bulk | Admin Token | `{"products":[]}`                                                                                                                                                                                                                                                                                                                                           | 400      | 400 Bad Request  | `{"message":"Vui lòng cung cấp danh sách sản phẩm"}`                                                                                                                                                                                       | ✓ Pass  |
| TC_PA04 | Bulk Create - Không có quyền Admin   | POST   | /api/products/bulk | User Token  | `{"products":[{"name":"Test","price":100000}]}`                                                                                                                                                                                                                                                                                                             | 401      | 401 Unauthorized | `{"message":"Not authorized as an admin"}`                                                                                                                                                                                                 | ✓ Pass  |

## 2.2. Import sản phẩm từ Excel

| ID      | Mô tả Test Case                      | Method | Endpoint                   | Auth        | Request Body                                                                                                                                                                                                                                       | Expected | Actual Status   | Actual Result                                                                                                                                                                                | Kết quả |
| ------- | ------------------------------------ | ------ | -------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| TC_PA05 | Import Excel - Cột tiếng Anh         | POST   | /api/products/import-excel | Admin Token | `{"products":[{"name":"Excel EN 1","price":450000,"brand":"Excel","category":"Import","countInStock":100,"description":"EN"},{"Name":"Excel EN 2","Price":550000,"Brand":"Excel","Category":"Import","Stock":80,"Description":"EN2"}]}`            | 201      | 201 Created     | `{"message":"Import thành công 2 sản phẩm, 0 thất bại","results":{"success":[{"_id":"...","name":"Excel EN 1"},{"_id":"...","name":"Excel EN 2"}],"failed":[]}}`                             | ✓ Pass  |
| TC_PA06 | Import Excel - Cột tiếng Việt        | POST   | /api/products/import-excel | Admin Token | `{"products":[{"Tên sản phẩm":"SP Tiếng Việt 1","Giá":350000,"Thương hiệu":"VN","Danh mục":"Test","Số lượng":60,"Mô tả":"VN1"},{"Tên sản phẩm":"SP Tiếng Việt 2","Giá":420000,"Thương hiệu":"VN","Danh mục":"Test","Số lượng":45,"Mô tả":"VN2"}]}` | 201      | 201 Created     | `{"message":"Import thành công 2 sản phẩm, 0 thất bại","results":{"success":[{"_id":"...","name":"SP Tiếng Việt 1"},{"_id":"...","name":"SP Tiếng Việt 2"}],"failed":[]}}`                   | ✓ Pass  |
| TC_PA07 | Import Excel - Thiếu trường bắt buộc | POST   | /api/products/import-excel | Admin Token | `{"products":[{"name":"OK","price":200000,"brand":"B","category":"C","description":"OK"},{"name":"No Price","brand":"B"},{"price":100000,"brand":"B"}]}`                                                                                           | 201      | 201 Created     | `{"message":"Import thành công 1 sản phẩm, 2 thất bại","results":{"success":[{"_id":"...","name":"OK"}],"failed":[{"error":"Thiếu thông tin bắt buộc (tên, giá, thương hiệu, danh mục)"}]}}` | ✓ Pass  |
| TC_PA08 | Import Excel - Dữ liệu rỗng          | POST   | /api/products/import-excel | Admin Token | `{"products":[]}`                                                                                                                                                                                                                                  | 400      | 400 Bad Request | `{"message":"Không có dữ liệu sản phẩm từ file Excel"}`                                                                                                                                      | ✓ Pass  |

---

# 3. QUẢN LÝ NGƯỜI DÙNG

## 3.1. Xác thực (Authentication)

| ID     | Mô tả Test Case               | Method | Endpoint          | Auth       | Request Body                                         | Expected | Actual Status    | Actual Result                                                                                     | Kết quả |
| ------ | ----------------------------- | ------ | ----------------- | ---------- | ---------------------------------------------------- | -------- | ---------------- | ------------------------------------------------------------------------------------------------- | ------- |
| TC_U01 | Đăng nhập thành công (Admin)  | POST   | /api/users/auth   | None       | `{"email":"admin@email.com","password":"123456"}`    | 200      | 200 OK           | `{"_id":"6766a5d5...","name":"Admin User","email":"admin@email.com","isAdmin":true}` + Cookie jwt | ✓ Pass  |
| TC_U02 | Đăng nhập thành công (User)   | POST   | /api/users/auth   | None       | `{"email":"john@email.com","password":"123456"}`     | 200      | 200 OK           | `{"_id":"6766a5d6...","name":"John Doe","email":"john@email.com","isAdmin":false}`                | ✓ Pass  |
| TC_U03 | Đăng nhập sai mật khẩu        | POST   | /api/users/auth   | None       | `{"email":"admin@email.com","password":"wrongpass"}` | 401      | 401 Unauthorized | `{"message":"Invalid email or password"}`                                                         | ✓ Pass  |
| TC_U04 | Đăng nhập email không tồn tại | POST   | /api/users/auth   | None       | `{"email":"notexist@email.com","password":"123456"}` | 401      | 401 Unauthorized | `{"message":"Invalid email or password"}`                                                         | ✓ Pass  |
| TC_U05 | Đăng xuất                     | POST   | /api/users/logout | User Token | N/A                                                  | 200      | 200 OK           | `{"message":"Logged out successfully"}`                                                           | ✓ Pass  |

## 3.2. Quản lý User (Admin)

| ID     | Mô tả Test Case                 | Method | Endpoint                            | Auth        | Request Body                                                          | Expected | Actual Status    | Actual Result                                                                                                                                               | Kết quả |
| ------ | ------------------------------- | ------ | ----------------------------------- | ----------- | --------------------------------------------------------------------- | -------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| TC_U06 | Admin lấy danh sách users       | GET    | /api/users                          | Admin Token | N/A                                                                   | 200      | 200 OK           | `[{"_id":"...","name":"Admin User","email":"admin@email.com","isAdmin":true},{"_id":"...","name":"John Doe","email":"john@email.com","isAdmin":false},...]` | ✓ Pass  |
| TC_U07 | User thường lấy danh sách users | GET    | /api/users                          | User Token  | N/A                                                                   | 401      | 401 Unauthorized | `{"message":"Not authorized as an admin"}`                                                                                                                  | ✓ Pass  |
| TC_U08 | Lấy user theo ID                | GET    | /api/users/:id                      | Admin Token | N/A                                                                   | 200      | 200 OK           | `{"_id":"6766a5d6...","name":"John Doe","email":"john@email.com","isAdmin":false}`                                                                          | ✓ Pass  |
| TC_U09 | Lấy user với ID không tồn tại   | GET    | /api/users/000000000000000000000000 | Admin Token | N/A                                                                   | 404      | 404 Not Found    | `{"message":"User not found"}`                                                                                                                              | ✓ Pass  |
| TC_U10 | Admin cập nhật user             | PUT    | /api/users/:id                      | Admin Token | `{"name":"Updated Name","email":"updated@email.com","isAdmin":false}` | 200      | 200 OK           | `{"_id":"...","name":"Updated Name","email":"updated@email.com","isAdmin":false}`                                                                           | ✓ Pass  |
| TC_U11 | Admin xóa user thường           | DELETE | /api/users/:id                      | Admin Token | N/A                                                                   | 200      | 200 OK           | `{"message":"User removed"}`                                                                                                                                | ✓ Pass  |
| TC_U12 | Admin xóa tài khoản Admin       | DELETE | /api/users/:adminId                 | Admin Token | N/A                                                                   | 400      | 400 Bad Request  | `{"message":"Can not delete admin user"}`                                                                                                                   | ✓ Pass  |

## 3.3. Profile cá nhân

| ID     | Mô tả Test Case      | Method | Endpoint           | Auth       | Request Body                                              | Expected | Actual Status | Actual Result                                                                      | Kết quả |
| ------ | -------------------- | ------ | ------------------ | ---------- | --------------------------------------------------------- | -------- | ------------- | ---------------------------------------------------------------------------------- | ------- |
| TC_U13 | Lấy profile của mình | GET    | /api/users/profile | User Token | N/A                                                       | 200      | 200 OK        | `{"_id":"6766a5d6...","name":"John Doe","email":"john@email.com","isAdmin":false}` | ✓ Pass  |
| TC_U14 | Cập nhật profile     | PUT    | /api/users/profile | User Token | `{"name":"John Updated","email":"johnupdated@email.com"}` | 200      | 200 OK        | `{"_id":"...","name":"John Updated","email":"johnupdated@email.com"}`              | ✓ Pass  |

---

# 4. QUẢN LÝ ĐƠN HÀNG

## 4.1. Tạo và xem đơn hàng

| ID     | Mô tả Test Case                 | Method | Endpoint         | Auth       | Request Body                                                                                                                                                                                                                                                                                                                           | Expected | Actual Status    | Actual Result                                                                                                                                                           | Kết quả |
| ------ | ------------------------------- | ------ | ---------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| TC_O01 | Tạo đơn hàng mới                | POST   | /api/orders      | User Token | `{"orderItems":[{"_id":"6766a5d5...","name":"Airpods","qty":2,"image":"/images/airpods.jpg","price":8900000}],"shippingAddress":{"address":"123 Nguyễn Trãi","city":"Hà Nội","postalCode":"100000","country":"Vietnam"},"paymentMethod":"VNPay","itemsPrice":17800000,"taxPrice":1780000,"shippingPrice":30000,"totalPrice":19610000}` | 201      | 201 Created      | `{"_id":"6766c1a2...","user":"6766a5d6...","orderItems":[...],"totalPrice":19610000,"isPaid":false,"isDelivered":false,"createdAt":"2024-12-21T..."}`                   | ✓ Pass  |
| TC_O02 | Tạo đơn hàng với giỏ hàng rỗng  | POST   | /api/orders      | User Token | `{"orderItems":[],"shippingAddress":{...},"totalPrice":0}`                                                                                                                                                                                                                                                                             | 400      | 400 Bad Request  | `{"message":"Không có mặt hàng trong đơn hàng"}`                                                                                                                        | ✓ Pass  |
| TC_O03 | Tạo đơn hàng khi chưa đăng nhập | POST   | /api/orders      | None       | `{"orderItems":[...],"totalPrice":1000000}`                                                                                                                                                                                                                                                                                            | 401      | 401 Unauthorized | `{"message":"Not authorized, no token"}`                                                                                                                                | ✓ Pass  |
| TC_O04 | Lấy đơn hàng theo ID            | GET    | /api/orders/:id  | User Token | N/A                                                                                                                                                                                                                                                                                                                                    | 200      | 200 OK           | `{"_id":"6766c1a2...","user":{"_id":"...","name":"John Doe","email":"john@email.com"},"orderItems":[...],"shippingAddress":{...},"totalPrice":19610000,"isPaid":false}` | ✓ Pass  |
| TC_O05 | Lấy đơn hàng của tôi            | GET    | /api/orders/mine | User Token | N/A                                                                                                                                                                                                                                                                                                                                    | 200      | 200 OK           | `[{"_id":"6766c1a2...","totalPrice":19610000,"isPaid":false,"createdAt":"2024-12-21T..."},...]`                                                                         | ✓ Pass  |

## 4.2. Quản lý đơn hàng (Admin)

| ID     | Mô tả Test Case                    | Method | Endpoint                | Auth        | Request Body | Expected | Actual Status    | Actual Result                                                                                                         | Kết quả |
| ------ | ---------------------------------- | ------ | ----------------------- | ----------- | ------------ | -------- | ---------------- | --------------------------------------------------------------------------------------------------------------------- | ------- |
| TC_O06 | Admin lấy tất cả đơn hàng          | GET    | /api/orders             | Admin Token | N/A          | 200      | 200 OK           | `[{"_id":"...","user":{"_id":"...","name":"John Doe"},"totalPrice":19610000,"isPaid":false,"isDelivered":false},...]` | ✓ Pass  |
| TC_O07 | Admin cập nhật đã giao hàng        | PUT    | /api/orders/:id/deliver | Admin Token | N/A          | 200      | 200 OK           | `{"_id":"6766c1a2...","isDelivered":true,"deliveredAt":"2024-12-21T14:30:00.000Z"}`                                   | ✓ Pass  |
| TC_O08 | User cập nhật trạng thái giao hàng | PUT    | /api/orders/:id/deliver | User Token  | N/A          | 401      | 401 Unauthorized | `{"message":"Not authorized as an admin"}`                                                                            | ✓ Pass  |

## 4.3. Thanh toán VNPay

| ID     | Mô tả Test Case               | Method | Endpoint                       | Auth       | Request Body | Expected | Actual Status   | Actual Result                                                                                                                                     | Kết quả |
| ------ | ----------------------------- | ------ | ------------------------------ | ---------- | ------------ | -------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| TC_O09 | Tạo URL thanh toán VNPay      | POST   | /api/orders/:id/vnpay          | User Token | N/A          | 200      | 200 OK          | `{"paymentUrl":"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=1961000000&vnp_Command=pay&vnp_CreateDate=...&vnp_SecureHash=..."}` | ✓ Pass  |
| TC_O10 | Tạo URL cho đơn đã thanh toán | POST   | /api/orders/:paidOrderId/vnpay | User Token | N/A          | 400      | 400 Bad Request | `{"message":"Đơn hàng đã thanh toán"}`                                                                                                            | ✓ Pass  |

---

# 5. QUẢN LÝ KHO

## 5.1. Xem thông tin tồn kho

| ID     | Mô tả Test Case                | Method | Endpoint                | Auth        | Request Body | Expected | Actual Status    | Actual Result                                                                                                                                                                       | Kết quả |
| ------ | ------------------------------ | ------ | ----------------------- | ----------- | ------------ | -------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| TC_W01 | Admin xem tổng quan tồn kho    | GET    | /api/products/inventory | Admin Token | N/A          | 200      | 200 OK           | `{"products":[{"_id":"...","name":"Airpods","countInStock":10,"price":8900000},...],"stats":{"totalProducts":48,"outOfStock":3,"lowStock":8,"inStock":37,"totalValue":2450000000}}` | ✓ Pass  |
| TC_W02 | User xem tồn kho (không quyền) | GET    | /api/products/inventory | User Token  | N/A          | 401      | 401 Unauthorized | `{"message":"Not authorized as an admin"}`                                                                                                                                          | ✓ Pass  |

## 5.2. Cập nhật tồn kho

| ID     | Mô tả Test Case                     | Method | Endpoint                 | Auth        | Request Body                                                                                                | Expected | Actual Status   | Actual Result                                                                                                                                                                           | Kết quả |
| ------ | ----------------------------------- | ------ | ------------------------ | ----------- | ----------------------------------------------------------------------------------------------------------- | -------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| TC_W03 | Cập nhật tồn kho 1 SP               | PUT    | /api/products/:id/stock  | Admin Token | `{"countInStock":100}`                                                                                      | 200      | 200 OK          | `{"_id":"6766a5d5...","name":"Airpods","countInStock":100}`                                                                                                                             | ✓ Pass  |
| TC_W04 | Cập nhật tồn kho hàng loạt          | PUT    | /api/products/bulk-stock | Admin Token | `{"updates":[{"productId":"6766a5d5...","countInStock":50},{"productId":"6766a5d6...","countInStock":75}]}` | 200      | 200 OK          | `{"message":"Đã cập nhật 2 sản phẩm, 0 thất bại","results":{"success":[{"_id":"...","name":"Airpods","countInStock":50},{"_id":"...","name":"iPhone","countInStock":75}],"failed":[]}}` | ✓ Pass  |
| TC_W05 | Cập nhật tồn kho - ID không tồn tại | PUT    | /api/products/bulk-stock | Admin Token | `{"updates":[{"productId":"000000000000000000000000","countInStock":50}]}`                                  | 200      | 200 OK          | `{"message":"Đã cập nhật 0 sản phẩm, 1 thất bại","results":{"success":[],"failed":[{"productId":"000000000000000000000000","error":"Không tìm thấy sản phẩm"}]}}`                       | ✓ Pass  |
| TC_W06 | Cập nhật tồn kho - Mảng rỗng        | PUT    | /api/products/bulk-stock | Admin Token | `{"updates":[]}`                                                                                            | 400      | 400 Bad Request | `{"message":"Vui lòng cung cấp danh sách cập nhật"}`                                                                                                                                    | ✓ Pass  |

---

# 6. KIỂM THỬ PHI CHỨC NĂNG (Non-Functional Testing)

## 6.1. Kiểm thử Hiệu năng (Performance Testing)

### Mục tiêu

Kiểm tra khả năng chịu tải của API `GET /api/products` - API được gọi nhiều nhất trong hệ thống.

### Công cụ

- Apache JMeter 5.6.3
- Postman Collection Runner

### Kịch bản kiểm thử

| Kịch bản    | Số Users | Ramp-up | Duration | Mô tả                      |
| ----------- | -------- | ------- | -------- | -------------------------- |
| Load Test 1 | 100      | 10s     | 60s      | Kiểm tra tải bình thường   |
| Load Test 2 | 500      | 30s     | 120s     | Kiểm tra tải cao           |
| Stress Test | 1000     | 60s     | 180s     | Kiểm tra giới hạn hệ thống |

### Kết quả mong đợi

- Thời gian phản hồi trung bình (Avg Response Time): < 500ms
- Tỷ lệ lỗi (Error Rate): < 1%
- Throughput: > 100 requests/second

### Kết quả thực tế (Postman Collection Runner - 100 iterations)

| Metric            | Giá trị | Đánh giá         |
| ----------------- | ------- | ---------------- |
| Total Requests    | 100     | -                |
| Avg Response Time | 245ms   | ✓ Pass (< 500ms) |
| Min Response Time | 89ms    | -                |
| Max Response Time | 892ms   | -                |
| Error Rate        | 0%      | ✓ Pass (< 1%)    |
| Success Rate      | 100%    | ✓ Pass           |

**Nhận xét:** API hoạt động ổn định với 100 requests liên tiếp, thời gian phản hồi trung bình 245ms đạt yêu cầu.

---

## 6.2. Kiểm thử Bảo mật & Độ ổn định (Security & Stability)

### Mục tiêu

Ngăn chặn việc spam request liên tục vào API, bảo vệ tài nguyên server.

### Giải pháp đề xuất

Áp dụng kỹ thuật Rate Limiting (Token Bucket) - Giới hạn 100 requests/phút/IP.

### Kịch bản kiểm thử

| ID        | Mô tả Test Case            | Kịch bản                      | Expected | Actual Status | Actual Result                     | Kết quả          |
| --------- | -------------------------- | ----------------------------- | -------- | ------------- | --------------------------------- | ---------------- |
| TC_SEC_01 | Gửi request trong giới hạn | Gửi 50 requests trong 1 phút  | 200 OK   | 200 OK        | Tất cả requests trả về thành công | ✓ Pass           |
| TC_SEC_02 | Gửi request vượt giới hạn  | Gửi 150 requests trong 1 phút | 429      | 200 OK        | Chưa implement Rate Limiting      | ⚠️ Cần cải thiện |

### Kiểm thử SQL Injection

| ID        | Mô tả Test Case             | Endpoint                              | Payload                                    | Expected                 | Actual Status    | Actual Result                                             | Kết quả |
| --------- | --------------------------- | ------------------------------------- | ------------------------------------------ | ------------------------ | ---------------- | --------------------------------------------------------- | ------- |
| TC_SEC_03 | SQL Injection trong search  | GET /api/products?keyword=' OR '1'='1 | `' OR '1'='1`                              | Không trả về tất cả data | 200 OK           | `{"products":[],"page":1,"pages":0}` - Không bị injection | ✓ Pass  |
| TC_SEC_04 | NoSQL Injection trong login | POST /api/users/auth                  | `{"email":{"$gt":""},"password":"123456"}` | 401                      | 401 Unauthorized | `{"message":"Invalid email or password"}`                 | ✓ Pass  |

### Kiểm thử XSS

| ID        | Mô tả Test Case        | Endpoint           | Payload                                                        | Expected                     | Actual Status | Actual Result                           | Kết quả |
| --------- | ---------------------- | ------------------ | -------------------------------------------------------------- | ---------------------------- | ------------- | --------------------------------------- | ------- |
| TC_SEC_05 | XSS trong tên sản phẩm | POST /api/products | `{"name":"<script>alert('XSS')</script>","price":1000000,...}` | Lưu dạng text, không execute | 201 Created   | Lưu nguyên string, không execute script | ✓ Pass  |

---

# 7. TỔNG HỢP KẾT QUẢ KIỂM THỬ

## 7.1. Bảng tổng hợp theo Module

| Module                    | Tổng TC | Pass   | Fail  | Bug   | Tỷ lệ Pass |
| ------------------------- | ------- | ------ | ----- | ----- | ---------- |
| 1. Quản lý SP cơ bản      | 19      | 18     | 0     | 1     | 94.7%      |
| 2. Quản lý SP nâng cao    | 8       | 8      | 0     | 0     | 100%       |
| 3. Quản lý Người dùng     | 14      | 14     | 0     | 0     | 100%       |
| 4. Quản lý Đơn hàng       | 10      | 10     | 0     | 0     | 100%       |
| 5. Quản lý Kho            | 6       | 6      | 0     | 0     | 100%       |
| 6. Kiểm thử phi chức năng | 5       | 4      | 0     | 1     | 80%        |
| **TỔNG CỘNG**             | **62**  | **60** | **0** | **2** | **96.8%**  |

## 7.2. Danh sách Bug phát hiện

| Bug ID  | Test Case | Mô tả                                                                 | Mức độ | Trạng thái |
| ------- | --------- | --------------------------------------------------------------------- | ------ | ---------- |
| BUG_001 | TC_P15    | Cho phép cập nhật price = 0, countInStock = 0 do lỗi logic validation | Medium | Open       |
| BUG_002 | TC_SEC_02 | Chưa implement Rate Limiting để chống spam request                    | Low    | Open       |

## 7.3. Nhận xét và Đánh giá

### Điểm mạnh

- ✓ API hoạt động ổn định với các chức năng CRUD cơ bản
- ✓ Xác thực và phân quyền (Authentication & Authorization) hoạt động chính xác
- ✓ Validation dữ liệu đầu vào được xử lý tốt
- ✓ Error handling rõ ràng với message mô tả chi tiết bằng tiếng Việt
- ✓ Hỗ trợ các tính năng nâng cao như Bulk Create và Import Excel
- ✓ Tích hợp thanh toán VNPay hoạt động đúng
- ✓ Bảo mật tốt với SQL/NoSQL Injection và XSS

### Khuyến nghị cải thiện

- ⚠️ Thêm validation không cho phép price = 0 hoặc âm
- ⚠️ Implement Rate Limiting để chống DDoS/spam
- ⚠️ Thêm logging chi tiết cho các thao tác quan trọng
- ⚠️ Bổ sung test cases cho edge cases phức tạp hơn

---

## 7.4. Môi trường kiểm thử

| Thông tin       | Chi tiết                      |
| --------------- | ----------------------------- |
| Base URL        | http://localhost:5000         |
| Database        | MongoDB Atlas (Test Database) |
| Công cụ         | Postman v11.x                 |
| OS              | Windows 11                    |
| Node.js         | v18.x                         |
| Ngày thực hiện  | 21/12/2024                    |
| Người thực hiện | Nhóm 7 - Lớp 20251IT6084005   |

---

# PHỤ LỤC

## A. Postman Collection

File Collection đầy đủ: `testing/QBShop_ALL_API_Tests.postman_collection.json`

## B. Hướng dẫn chạy test

1. Import file collection vào Postman
2. Chạy request "0.1 Đăng nhập Admin" để lấy token
3. Chạy Collection Runner với tất cả requests
4. Xem kết quả trong tab "Test Results"

## C. Ghi chú

- Các ID trong bảng là ID mẫu, thay bằng ID thực tế khi test
- Kết quả "Actual Result" được lấy từ response thực tế của Postman
- Bug được đánh dấu với icon ⚠️
