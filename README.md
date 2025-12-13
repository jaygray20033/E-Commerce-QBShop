# QBShop - Full Stack Ecommerce Platform

A modern, feature-rich ecommerce application built with React and Node.js that enables users to discover, purchase, and track products with secure payment processing.

## 🌟 Features

### User Features

- **User Authentication**: Secure registration and login with JWT token-based authentication
- **Product Browsing**: Browse products with filtering, searching, and pagination
- **Shopping Cart**: Add/remove products, persistent cart storage
- **Order Management**: Place orders, view order history, and track order status
- **User Profile**: Manage personal information and view order history
- **Payment Processing**: Integrated PayPal and VNPay payment gateways
- **Product Reviews**: Read and view product ratings from other users
- **Responsive Design**: Fully responsive UI using Bootstrap for all devices
- **Multi-language Support**: Built-in internationalization support

### Admin Features

- **Product Management**: Create, edit, delete, and upload product images
- **User Management**: View all users, edit user roles, delete users
- **Order Management**: View all orders, update order status, manage deliveries
- **Inventory Management**: Track stock levels, low stock alerts, and manage product inventory
- **Admin Dashboard**: Comprehensive dashboard for managing the platform

## 🛠 Tech Stack

### Frontend

- **React 18**: JavaScript library for building user interfaces
- **Redux Toolkit**: State management solution
- **React Router v6**: Client-side routing
- **Bootstrap 5**: CSS framework for responsive design
- **Axios**: HTTP client for API calls
- **React Helmet Async**: SEO management
- **React Toastify**: Toast notifications
- **PayPal React SDK**: PayPal payment integration

### Backend

- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT (jsonwebtoken)**: Authentication tokens
- **Bcryptjs**: Password encryption
- **Multer**: File upload handling
- **Dotenv**: Environment variable management

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- npm or yarn package manager

### Installation

#### 1. Clone the repository

\`\`\`bash
git clone https://github.com/jaygray20033/QBShop.git
cd QBShop
\`\`\`

#### 2. Backend Setup

\`\`\`bash
cd backend

# Install dependencies

npm install

# Create .env file and add environment variables

# DATABASE_URL, JWT_SECRET, PAYPAL_CLIENT_ID, VNPAY_TMN_CODE, etc.

# Run seeder (optional - to populate sample data)

npm run seed

# Start backend server

npm start
\`\`\`

#### 3. Frontend Setup

\`\`\`bash
cd frontend

# Install dependencies

npm install

# Start development server

npm start
\`\`\`

The application will open at `http://localhost:3000`

## 📡 API Endpoints

### Authentication

- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Products

- `GET /api/products` - Get all products (with pagination and filtering)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders

- `POST /api/orders` - Create new order
- `GET /api/orders/myorders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/deliver` - Update order delivery status (Admin)
- `GET /api/orders` - Get all orders (Admin)

### Users (Admin)

- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user details (Admin)
- `PUT /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

## 🔐 Authentication & Security

- JWT tokens for secure authentication
- Bcryptjs for password hashing
- Protected routes for authenticated users
- Admin-only routes for administrative functions
- CORS configuration for secure API access
- HTTP-only cookies for token storage

## 💳 Payment Integration

### PayPal

- Client integration using PayPal React SDK
- Secure payment processing
- Transaction verification

### VNPay

- Vietnamese payment gateway integration
- Automatic payment status updates
- Order confirmation after successful payment

## 📦 Database Models

### User Model

- Email, password (hashed), name
- Role (user/admin)
- Profile information
- Order history

### Product Model

- Name, description, price
- Image upload
- Stock quantity
- Category
- Rating and reviews

### Order Model

- User reference
- Order items (product, quantity, price)
- Shipping address
- Payment method
- Order status
- Delivery date

## 🎯 Key Functionalities

1. **User Management**: Register, login, profile management
2. **Product Catalog**: Browse, search, filter products
3. **Shopping Cart**: Persistent cart with local storage
4. **Checkout Process**: Multi-step checkout with shipping and payment
5. **Order Processing**: Order creation, status tracking, delivery management
6. **Payment Processing**: Multiple payment methods integration
7. **Admin Panel**: Complete management dashboard
8. **File Upload**: Product image uploads with validation

## 🌐 Environment Variables

Backend `.env` file requirements:
\`\`\`
DATABASE_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=development
PAYPAL_CLIENT_ID=your_paypal_client_id
VNPAY_TMN_CODE=your_vnpay_tmncode
VNPAY_HASH_SECRET=your_vnpay_hash_secret
VNPAY_RETURN_URL=http://localhost:3000/api/vnpay/return
\`\`\`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bug reports and feature requests.

## 👨‍💼 Author

**Bùi Đình Quyết**

- Email: buidinhquyet2005@gmail.com
- GitHub: [@jaygray20033](https://github.com/jaygray20033)
- Phone: 0392552705

## 📜 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by real-world ecommerce requirements
- Community contributions and feedback
