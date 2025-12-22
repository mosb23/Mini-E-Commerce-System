# Mini E-Commerce System

A full-stack e-commerce application built with Django REST Framework backend and React frontend. This system allows users to browse products, manage inventory, and place orders with customer information tracking.

## Project Description

This Mini E-Commerce System is a complete web application that demonstrates a modern e-commerce workflow. The application features:

- **Product Management**: Browse and view product details including name, description, price, and stock availability
- **Order Processing**: Create orders with multiple products, track customer information, and automatically manage inventory
- **Stock Management**: Real-time stock updates when orders are placed
- **RESTful API**: Clean and well-structured API endpoints for all operations
- **Modern UI**: Responsive React frontend with Tailwind CSS styling

The system uses a decoupled architecture with a Django backend serving REST APIs and a React frontend consuming those APIs, making it scalable and maintainable.

## Technology Used

### Backend
- **Django 6.0** - High-level Python web framework
- **Django REST Framework 3.16.1** - Powerful toolkit for building Web APIs
- **SQLite** - Lightweight database for data storage
- **django-cors-headers 4.3.1** - Handles Cross-Origin Resource Sharing (CORS) for API access
- **Python 3.13** - Programming language

### Frontend
- **React 19.2.3** - JavaScript library for building user interfaces
- **React DOM 19.2.3** - React renderer for web
- **Tailwind CSS 3.4.1** - Utility-first CSS framework for styling
- **Lucide React 0.562.0** - Icon library
- **React Scripts 5.0.1** - Configuration and scripts for Create React App

### Development Tools
- **PostCSS** - CSS transformation tool
- **Autoprefixer** - CSS vendor prefixing

## Project Structure

```
Mini-E-Commerce-System/
│
├── Backend/                    # Django backend application
│   ├── ecommerce/              # Main Django project configuration
│   │   ├── __init__.py
│   │   ├── settings.py        # Django settings
│   │   ├── urls.py            # Main URL routing
│   │   ├── wsgi.py            # WSGI configuration
│   │   └── asgi.py            # ASGI configuration
│   │
│   ├── store/                  # Main application module
│   │   ├── models.py          # Database models (Product, Order, OrderItem)
│   │   ├── views.py           # API view classes
│   │   ├── serializers.py     # DRF serializers
│   │   ├── urls.py            # API endpoint routing
│   │   ├── admin.py           # Django admin configuration
│   │   └── migrations/        # Database migrations
│   │
│   ├── manage.py              # Django management script
│   ├── requirements.txt       # Python dependencies
│   └── db.sqlite3             # SQLite database file
│
├── frontend/                   # React frontend application
│   ├── public/                # Static public files
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── ...
│   │
│   ├── src/                   # React source code
│   │   ├── api/              # API integration functions
│   │   │   └── api.js        # API calls to backend
│   │   ├── components/       # React components
│   │   │   └── PlantShop.js  # Main shop component
│   │   ├── App.js            # Main App component
│   │   ├── App.css           # App styles
│   │   ├── index.js          # Entry point
│   │   └── index.css         # Global styles
│   │
│   ├── package.json          # Node.js dependencies
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   └── postcss.config.js     # PostCSS configuration
│
├── .gitignore                 # Git ignore rules
└── README.md                  # Project documentation
```

## API Endpoints

All API endpoints are prefixed with `/api/`. The base URL is `http://127.0.0.1:8000/api/`.

### Products

#### Get All Products
- **Endpoint**: `GET /api/products/`
- **Description**: Retrieve a list of all available products
- **Response**: Array of product objects
- **Example Response**:
```json
[
  {
    "id": 1,
    "name": "Product Name",
    "description": "Product description",
    "price": "29.99",
    "stock": 30
  }
]
```

#### Get Product Details
- **Endpoint**: `GET /api/products/<id>/`
- **Description**: Retrieve detailed information about a specific product
- **Parameters**: `id` (integer) - Product ID
- **Response**: Single product object
- **Example Response**:
```json
{
  "id": 1,
  "name": "Product Name",
  "description": "Product description",
  "price": "29.99",
  "stock": 30
}
```

#### Create Product
- **Endpoint**: `POST /api/products/create/`
- **Description**: Create a new product (Admin/Management operation)
- **Request Body**:
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": "39.99",
  "stock": 50
}
```
- **Response**: Created product object with status 201

### Orders

#### Get All Orders
- **Endpoint**: `GET /api/orders/`
- **Description**: Retrieve a list of all orders
- **Response**: Array of order objects with items
- **Example Response**:
```json
[
  {
    "id": 1,
    "created_at": "2024-01-15T10:30:00Z",
    "total_price": "89.97",
    "customer_name": "John Doe",
    "customer_phone": "1234567890",
    "customer_address": "123 Main St, City, Country",
    "items": [
      {
        "id": 1,
        "product": 1,
        "quantity": 2
      }
    ]
  }
]
```

#### Create Order
- **Endpoint**: `POST /api/orders/create/`
- **Description**: Create a new order with multiple products. Automatically updates product stock.
- **Request Body**:
```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 2,
      "quantity": 1
    }
  ],
  "customer_name": "John Doe",
  "customer_phone": "1234567890",
  "customer_address": "123 Main St, City, Country"
}
```
- **Response**: Created order object with status 201
- **Error Responses**:
  - `400 Bad Request`: If items array is empty, customer information is missing, product doesn't exist, or insufficient stock
- **Example Error Response**:
```json
{
  "error": "Insufficient stock for Product Name. Available: 5, Requested: 10"
}
```

### Admin Panel
- **Endpoint**: `GET /admin/`
- **Description**: Django admin interface for managing products, orders, and order items
- **Access**: Requires admin credentials

## Getting Started

### Prerequisites
- Python 3.13 or higher
- Node.js and npm
- pip (Python package manager)

### Backend Setup

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Run database migrations:
```bash
python manage.py migrate
```

6. Create a superuser (optional, for admin access):
```bash
python manage.py createsuperuser
```

7. Start the development server:
```bash
python manage.py runserver
```

The backend will be available at `http://127.0.0.1:8000/`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000/`

## Features

- ✅ Product listing and details
- ✅ Order creation with multiple items
- ✅ Automatic stock management
- ✅ Customer information tracking
- ✅ RESTful API architecture
- ✅ Responsive UI design
- ✅ CORS enabled for frontend-backend communication

## License

This project is open source and available for educational purposes.
