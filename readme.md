# E-commerce Platform

Welcome to our E-commerce platform! This repository contains the source code for a feature-rich e-commerce application built using Node.js, Express.js, MongoDB, and Redis. This README provides an overview of the project, installation instructions, and information about the available API routes.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Features](#features)
- [API Routes](#api-routes)
- [Bull Board](#bull-board)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

Before you can run the application, make sure you have the following installed on your system:

- Node.js (at least version 12)
- MongoDB
- Redis

### Installation

1. Clone the repository to your local machine:

git clone https://github.com/your-username/e-commerce-platform.git

2. Install the required dependencies:

cd e-commerce-platform
npm install

3. Create a `.env` file in the root directory and set the following environment variables:

MONGO_URI=your-mongodb-uri
REDIS_URL=your-redis-url
ADMIN_EMAIL_SRV=your-admin-email-service
PASS=your-email-service-password
SECRET=your-session-secret

4. Start the development server:

npm run dev

The application should now be running on `http://localhost:3000`.

## Features

Our e-commerce platform provides a wide range of features, including:

- User authentication (signup, login, logout, password reset)
- Product management (create, update, delete, view products)
- Cart functionality (add, delete items, view cart)
- Order management (create, update status, view orders)
- Wishlist (add, remove, view wishlist)
- Admin dashboard with advanced features (total orders, sales revenue, top selling products)
- Real-time notifications using Bull and Redis

## API Routes

The following are the available API routes for the e-commerce platform:

- **User Routes**

  - `/api/auth/signup`: User registration
  - `/api/auth/login`: User login
  - `/api/auth/logout`: User logout
  - `/api/auth/currentuser`: Get current user details
  - `/api/auth/updateuser`: Update user profile
  - `/api/auth/resetpassword`: Initiate password reset process
  - `/api/auth/forgotpassword`: Forgot password route

- **Product Routes**

  - `/api/products`: Create a new product
  - `/api/products/:id`: Update an existing product
  - `/api/products`: Get all products
  - `/api/products/:id`: Get a specific product by ID
  - `/api/products/category/:category`: Get products by category

- **Cart Routes**

  - `/api/cart/add`: Add a product to the cart
  - `/api/cart/delete/:id`: Delete a product from the cart

- **Order Routes**

  - `/api/orders`: Create a new order
  - `/api/orders/actions`: Update order status
  - `/api/orders/:id`: Get a specific order by ID

- **Wishlist Routes**

  - `/api/wishlist/add/:id`: Add a product to the wishlist
  - `/api/wishlist/remove/:id`: Remove a product from the wishlist

- **Admin Routes**
  - `/api/admin/orders/actions/:id`: Update order status (for admins)
  - `/api/admin/orders/sales-revenue`: Get total sales revenue within a specified time period
  - `/api/admin/products/top-selling`: Get top-selling products
  - `/api/admin/orders/specific-orders`: Get orders based on specified parameters

## Bull Board

We have also integrated Bull Board for managing background jobs and real-time notifications. To access Bull Board, navigate to `/admin/queues` on your local development server.

## Contributing

We welcome contributions to our e-commerce platform! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request.

## Note

Please be aware that this is a backend-only project, and no payment gateway has been implemented. The focus is on providing a solid foundation for an e-commerce platform, allowing users to manage products, carts, orders, and more. You will need to integrate a payment gateway separately if you plan to use this project for a complete e-commerce application.

Thank you for checking out our E-commerce Platform! We hope it proves to be a useful and feature-rich foundation for your e-commerce projects. Happy coding!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details