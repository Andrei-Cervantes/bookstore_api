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
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      security: [{ bearerAuth: [] }],
    },
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
