import express from "express";
import CONFIG from "./config.js";
import mongoose from "mongoose";
import cors from "cors";

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
