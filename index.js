import express from "express";
import CONFIG from "./config.js";
import mongoose from "mongoose";
import cors from "cors";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

// Import Routes
import {
  booksRoute,
  adminRoute,
  authRoute,
  borrowRoute,
  bookmarksRoute,
  notesRoute,
  reviewsRoute,
} from "./routes/index.js";

const app = express();

// Swagger configurations
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library Management System API",
      version: "1.0.0",
      description: "A RESTful API for a Library Management System",
    },
    servers: [
      {
        url: `http://localhost:${CONFIG.PORT}`,
        description: "Local Development Server",
      },
    ],
    components: {
      schemas: {
        Book: {
          type: "object",
          required: [
            "title",
            "author",
            "publishYear",
            "genre",
            "pages",
            "language",
            "description",
            "coverImageUrl",
            "location",
          ],
          properties: {
            _id: {
              type: "string",
              description: "Auto-generated book ID",
            },
            title: {
              type: "string",
              description: "Book title",
            },
            author: {
              type: "string",
              description: "Book author",
            },
            publishYear: {
              type: "number",
              description: "Year the book was published",
            },
            genre: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Book genres",
            },
            pages: {
              type: "number",
              description: "Number of pages",
            },
            language: {
              type: "string",
              description: "Book language",
            },
            description: {
              type: "string",
              description: "Book description",
            },
            coverImageUrl: {
              type: "string",
              description: "URL to book cover image",
            },
            location: {
              type: "string",
              description: "Physical location of the book",
            },
            availability: {
              type: "boolean",
              default: true,
              description: "Whether the book is available for borrowing",
            },
            isArchived: {
              type: "boolean",
              default: false,
              description: "Whether the book is archived",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        User: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            _id: {
              type: "string",
              description: "Auto-generated user ID",
            },
            username: {
              type: "string",
              description: "Username",
            },
            email: {
              type: "string",
              description: "Email address",
            },
            password: {
              type: "string",
              description: "Password",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              description: "User role",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        Borrow: {
          type: "object",
          required: ["bookId", "userId", "borrowDate", "returnDate"],
          properties: {
            _id: {
              type: "string",
              description: "Auto-generated borrow ID",
            },
            bookId: {
              type: "string",
              description: "ID of the borrowed book",
            },
            userId: {
              type: "string",
              description: "ID of the borrowing user",
            },
            borrowDate: {
              type: "string",
              format: "date-time",
              description: "Date when the book was borrowed",
            },
            returnDate: {
              type: "string",
              format: "date-time",
              description: "Date when the book should be returned",
            },
            status: {
              type: "string",
              enum: ["pending", "approved", "rejected", "returned"],
              description: "Borrow status",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        Bookmark: {
          type: "object",
          required: ["bookId", "userId"],
          properties: {
            _id: {
              type: "string",
              description: "Auto-generated bookmark ID",
            },
            bookId: {
              type: "string",
              description: "ID of the book bookmarked",
            },
            userId: {
              type: "string",
              description: "ID of the user who bookmarked",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        Note: {
          type: "object",
          required: ["bookId", "userId", "content"],
          properties: {
            _id: {
              type: "string",
              description: "Auto-generated note ID",
            },
            bookId: {
              type: "string",
              description: "ID of the book the note is for",
            },
            userId: {
              type: "string",
              description: "ID of the user who wrote the note",
            },
            content: {
              type: "string",
              description: "Content of the note",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        Review: {
          type: "object",
          required: ["bookId", "userId", "rating", "comment"],
          properties: {
            _id: {
              type: "string",
              description: "Auto-generated review ID",
            },
            bookId: {
              type: "string",
              description: "ID of the book reviewed",
            },
            userId: {
              type: "string",
              description: "ID of the user who wrote the review",
            },
            rating: {
              type: "integer",
              minimum: 1,
              maximum: 5,
              description: "Rating (1-5)",
            },
            comment: {
              type: "string",
              description: "Review comment",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        Pagination: {
          type: "object",
          required: ["page", "itemsPerPage"],
          properties: {
            page: {
              type: "integer",
              minimum: 1,
              description: "Page number",
            },
            itemsPerPage: {
              type: "integer",
              description: "Number of items per page",
            },
          },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: "Books", description: "Book management operations" },
      { name: "Admin", description: "Admin operations" },
      { name: "Auth", description: "Authentication operations" },
      { name: "Borrow", description: "Borrow operations" },
      { name: "Bookmarks", description: "Bookmark operations" },
      { name: "Notes", description: "Note operations" },
      { name: "Reviews", description: "Review operations" },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

mongoose
  .connect(CONFIG.MONGO_URI)
  .then(() => {
    console.log("App connected to database");
    app.listen(CONFIG.PORT, () => {
      console.log(`App is listening to port: ${CONFIG.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

// Swagger UI setup
app.use(
  `${CONFIG.API_VERSION}/docs`,
  swaggerUI.serve,
  swaggerUI.setup(swaggerSpec)
);

// Middleware for parsing request body
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(`${CONFIG.API_VERSION}/books`, booksRoute);
app.use(`${CONFIG.API_VERSION}/admin`, adminRoute);
app.use(`${CONFIG.API_VERSION}/auth`, authRoute);
app.use(`${CONFIG.API_VERSION}/borrow`, borrowRoute);
app.use(`${CONFIG.API_VERSION}/bookmarks`, bookmarksRoute);
app.use(`${CONFIG.API_VERSION}/notes`, notesRoute);
app.use(`${CONFIG.API_VERSION}/reviews`, reviewsRoute);
