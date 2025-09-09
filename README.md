# CRUD Backend API

A comprehensive RESTful API built with Node.js, Express.js, and MongoDB that provides full CRUD (Create, Read, Update, Delete) operations for user management.

## 🚀 Features

- **Complete CRUD Operations**: Create, Read, Update, Delete users
- **Data Validation**: Comprehensive input validation using express-validator
- **Error Handling**: Centralized error handling middleware
- **Security**: Helmet.js for security headers, CORS configuration
- **Password Hashing**: Secure password storage using bcryptjs
- **Pagination**: Built-in pagination for user listings
- **Search & Filtering**: Search users by name/email, filter by role/status
- **Soft Delete**: Option for both soft delete and permanent delete
- **Health Check**: API health monitoring endpoint
- **Request Logging**: Morgan logging for development

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## ⚡ Quick Start

### 1. Clone & Install

\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd crud-backend

# Install dependencies
npm install
\`\`\`

### 2. Environment Setup

Create a \`.env\` file in the root directory:

\`\`\`env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crud_database
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
NODE_ENV=development
\`\`\`

### 3. Start MongoDB

Make sure MongoDB is running on your system:

\`\`\`bash
# For Windows
net start MongoDB

# For macOS (using brew)
brew services start mongodb-community

# For Linux
sudo systemctl start mongod
\`\`\`

### 4. Run the Application

\`\`\`bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
\`\`\`

The server will start on http://localhost:5000

## 📚 API Documentation

### Base URL
\`\`\`
http://localhost:5000/api
\`\`\`

### Endpoints

#### Health Check
- **GET** \`/api/health\` - Check server status

#### Users CRUD Operations

#### 1. Get All Users
\`\`\`http
GET /api/users
\`\`\`

**Query Parameters:**
- \`page\` (number): Page number (default: 1)
- \`limit\` (number): Items per page (default: 10)
- \`search\` (string): Search by name or email
- \`role\` (string): Filter by role ('user' or 'admin')
- \`isActive\` (boolean): Filter by active status

**Example:**
\`\`\`http
GET /api/users?page=1&limit=5&search=john&role=user&isActive=true
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "count": 5,
  "total": 25,
  "page": 1,
  "pages": 5,
  "data": [
    {
      "_id": "60d5ec49f1b2c8b1f8e4e1a1",
      "name": "John Doe",
      "email": "john@example.com",
      "age": 25,
      "role": "user",
      "isActive": true,
      "createdAt": "2021-06-25T10:30:00.000Z",
      "updatedAt": "2021-06-25T10:30:00.000Z"
    }
  ]
}
\`\`\`

#### 2. Get Single User
\`\`\`http
GET /api/users/:id
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c8b1f8e4e1a1",
    "name": "John Doe",
    "email": "john@example.com",
    "age": 25,
    "role": "user",
    "isActive": true,
    "createdAt": "2021-06-25T10:30:00.000Z",
    "updatedAt": "2021-06-25T10:30:00.000Z"
  }
}
\`\`\`

#### 3. Create New User
\`\`\`http
POST /api/users
Content-Type: application/json
\`\`\`

**Request Body:**
\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "age": 25,
  "role": "user"
}
\`\`\`

**Validation Rules:**
- \`name\`: Required, 2-50 characters
- \`email\`: Required, valid email format
- \`password\`: Required, min 6 characters, must contain uppercase, lowercase, and number
- \`age\`: Optional, 0-120
- \`role\`: Optional, 'user' or 'admin' (default: 'user')

#### 4. Update User
\`\`\`http
PUT /api/users/:id
Content-Type: application/json
\`\`\`

**Request Body:** (all fields optional)
\`\`\`json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "age": 26,
  "role": "admin",
  "isActive": true
}
\`\`\`

#### 5. Soft Delete User
\`\`\`http
DELETE /api/users/:id
\`\`\`

Sets \`isActive\` to \`false\` instead of removing the record.

#### 6. Permanent Delete User
\`\`\`http
DELETE /api/users/:id/permanent
\`\`\`

Permanently removes the user from the database.

#### 7. Activate User
\`\`\`http
PATCH /api/users/:id/activate
\`\`\`

Reactivates a soft-deleted user by setting \`isActive\` to \`true\`.

## 🧪 Testing with cURL

### Create a new user:
\`\`\`bash
curl -X POST http://localhost:5000/api/users \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123",
    "age": 28,
    "role": "user"
  }'
\`\`\`

### Get all users:
\`\`\`bash
curl http://localhost:5000/api/users
\`\`\`

### Update a user:
\`\`\`bash
curl -X PUT http://localhost:5000/api/users/USER_ID \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Jane Smith",
    "age": 29
  }'
\`\`\`

## 🏗️ Project Structure

\`\`\`
crud-backend/
├── config/
│   ├── database.js          # Database connection
│   └── config.js           # Application configuration
├── middleware/
│   ├── errorHandler.js     # Global error handling
│   └── validation.js       # Input validation middleware
├── models/
│   └── User.js             # User MongoDB schema
├── routes/
│   └── users.js            # User routes
├── .gitignore              # Git ignore file
├── package.json            # Dependencies and scripts
├── README.md               # Project documentation
└── server.js               # Main application file
\`\`\`

## 🛠️ Built With

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security middleware
- **cors** - Cross-origin resource sharing
- **morgan** - HTTP request logger
- **dotenv** - Environment variable management

## 🔒 Security Features

- Password hashing with bcryptjs
- Input validation and sanitization
- Security headers with Helmet.js
- CORS configuration
- Error message sanitization
- MongoDB injection prevention

## 📈 Performance Features

- Pagination for large datasets
- Database indexing on email field
- Efficient query filtering
- Request logging for monitoring

## 🚀 Deployment

### Using PM2 (Production)

\`\`\`bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start server.js --name "crud-backend"

# Monitor the application
pm2 monit
\`\`\`

### Environment Variables for Production

\`\`\`env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-production-mongodb-uri
JWT_SECRET=your-super-secure-production-secret
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Support

If you have any questions or need help, please create an issue in the repository.
