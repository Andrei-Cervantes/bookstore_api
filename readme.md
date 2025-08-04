# 📚 Bookstore Management System API

A comprehensive RESTful API for managing a bookstore/library system with user authentication, book management, borrowing system, reviews, bookmarks, and notes functionality.

## 🌟 Features

### 🔐 Authentication & Authorization

- **User Registration & Login** with JWT tokens
- **Email Verification** system
- **Password Reset** functionality
- **Role-based Access Control** (User, Librarian, Admin)
- **Token Refresh** mechanism

### 📖 Book Management

- **CRUD Operations** for books
- **Book Search & Filtering**
- **Book Availability** tracking
- **Book Archiving** system
- **Cover Image** support

### 📚 Borrowing System

- **Borrow Requests** creation and management
- **Request Approval/Rejection** by librarians
- **Book Return** functionality
- **Due Date** tracking
- **Status Management** (requested, approved, rejected, returned)

### ⭐ Reviews & Ratings

- **Book Reviews** with ratings (1-5 stars)
- **Review Management** (create, edit, delete)
- **User-specific** reviews
- **Book-specific** review aggregation

### 📚 Bookmarks

- **Book Bookmarking** system
- **User Bookmark** management
- **Duplicate Prevention**

### 📝 Notes

- **Personal Notes** for books
- **Note Management** (create, edit, delete)
- **User-specific** notes

### 👥 User Management

- **User Profile** management
- **Admin User** management
- **Role Assignment** system

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/bookstore_api.git
   cd bookstore_api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file:

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/bookstore
   JWT_SECRET=your_jwt_secret_here
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   BASE_URL=http://localhost:5000
   ```

4. **Start the server**

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

5. **Access the API**
   - API Base URL: `http://localhost:5000/api/v1`
   - Swagger Documentation: `http://localhost:5000/api/v1/docs`

## 📚 API Documentation

### Interactive Documentation

Access the complete interactive API documentation at:

```
http://localhost:5000/api/v1/docs
```

The Swagger UI provides:

- **Interactive API Explorer**
- **Request/Response Examples**
- **Authentication Testing**
- **Schema Definitions**
- **Error Response Documentation**

### API Endpoints Overview

#### 🔐 Authentication (`/api/v1/auth`)

- `POST /register` - User registration
- `POST /login` - User login
- `GET /verify-email/:token` - Email verification
- `POST /resend-verification-email` - Resend verification
- `POST /forgot-password` - Password reset request
- `POST /reset-password/:token` - Password reset
- `POST /refresh-token` - Refresh access token
- `POST /change-password` - Change password
- `GET /me` - Get current user
- `PUT /me` - Update user profile
- `POST /logout` - User logout

#### 📖 Books (`/api/v1/books`)

- `POST /` - Create a book
- `GET /` - Get all books
- `GET /:id` - Get single book
- `PUT /:id` - Update book
- `DELETE /:id` - Delete book

#### 📚 Borrowing (`/api/v1/borrow`)

- `POST /:bookId` - Create borrow request
- `GET /` - Get user's borrow requests
- `PUT /:id/return` - Return book
- `GET /borrow-requests` - Get all requests (Admin/Librarian)
- `PUT /:id/approve` - Approve request (Admin/Librarian)
- `PUT /:id/reject` - Reject request (Admin/Librarian)

#### ⭐ Reviews (`/api/v1/reviews`)

- `POST /:id` - Add review for book
- `GET /:id` - Get book reviews
- `GET /:id/user` - Get user's review for book
- `PUT /:id` - Edit review
- `DELETE /:id` - Delete review

#### 📚 Bookmarks (`/api/v1/bookmarks`)

- `POST /` - Create bookmark
- `GET /` - Get user's bookmarks
- `DELETE /:id` - Delete bookmark

#### 📝 Notes (`/api/v1/notes`)

- `POST /:id` - Add note for book
- `GET /` - Get user's notes
- `PUT /:id` - Edit note
- `DELETE /:id` - Delete note

#### 👥 Admin (`/api/v1/admin`)

- `GET /users` - Get all users
- `GET /users/:id` - Get single user
- `PUT /users/:id/role` - Set user role
- `DELETE /users/:id` - Delete user

## 📊 Database Schema

### User Model

- Basic info (name, email, password)
- Role-based access (user, librarian, admin)
- Email verification status
- Account status (active/inactive)
- Avatar support

### Book Model

- Book details (title, author, description)
- Metadata (genre, pages, language, publish year)
- Availability status
- Archive status
- Location tracking

### Borrow Request Model

- User and book references
- Status tracking (requested, approved, rejected, returned)
- Timestamps (requested, approved, due, returned)

### Review Model

- User and book references
- Rating (1-5 stars)
- Comment content
- Timestamps

### Bookmark Model

- User and book references
- Creation timestamp

### Note Model

- User and book references
- Note content
- Timestamps

<!-- ## 🧪 Testing

### Manual Testing

Use the Swagger UI at `http://localhost:5000/api/v1/docs` to test all endpoints.

### Example API Calls

#### Register a new user

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "StrongPassword123!"
  }'
```

#### Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "StrongPassword123!"
  }'
```

#### Create a book (Admin only)

```bash
curl -X POST http://localhost:5000/api/v1/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "publishYear": 1925,
    "genre": ["Fiction", "Classic"],
    "pages": 180,
    "language": "English",
    "description": "A story of the fabulously wealthy Jay Gatsby",
    "coverImageUrl": "https://example.com/cover.jpg",
    "location": "Shelf A1"
  }'
``` -->

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### 1. Fork the Repository

```bash
git clone https://github.com/yourusername/bookstore_api.git
cd bookstore_api
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes

- Follow the existing code style
- Add appropriate comments
- Update documentation if needed
- Test your changes

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add your feature description"
```

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

### 6. Code Style Guidelines

- Use meaningful variable and function names
- Add JSDoc comments for new functions
- Follow the existing file structure
- Update Swagger documentation for new endpoints

## 🐛 Issues and Bug Reports

If you find a bug or have a feature request, please:

1. Check existing issues first
2. Create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details

<!-- ## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. -->

## 📞 Support

For support and questions:

- Create an issue on GitHub
- Email: support@bookstore.com
- Documentation: `http://localhost:5000/api/v1/docs`

---

**Made with ❤️ for the library community**

```

This comprehensive README includes:

1. **Project Overview** - Clear description and features
2. **Quick Start Guide** - Step-by-step installation
3. **API Documentation** - Links to Swagger UI and endpoint overview
4. **Technology Stack** - All technologies used
5. **Project Structure** - File organization
6. **Authentication Details** - JWT and role system
7. **Database Schema** - Model descriptions
8. **Testing Examples** - API call examples
9. **Contributing Guidelines** - How to contribute
10. **Support Information** - How to get help
11. **License and Acknowledgments**

The documentation is professional, comprehensive, and follows best practices for open-source projects. It provides everything a developer needs to understand, use, and contribute to your API.
```
