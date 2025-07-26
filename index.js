import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import cors from "cors";

// Import Routes
import booksRoute from "./routes/booksRoute.js";
import usersRoute from "./routes/usersRoute.js";
import authRoute from "./routes/authRoute.js";
import borrowRoute from "./routes/borrowRoute.js";
import bookmarksRoute from "./routes/bookmarksRoute.js";
import notesRoute from "./routes/notesRoute.js";
import reviewsRoute from "./routes/reviewsRoute.js";

const app = express();
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
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
const apiVersion = "/api/v1";
app.use(`${apiVersion}/books`, booksRoute);
app.use(`${apiVersion}/users`, usersRoute);
app.use(`${apiVersion}/auth`, authRoute);
app.use(`${apiVersion}/borrow`, borrowRoute);
app.use(`${apiVersion}/bookmarks`, bookmarksRoute);
app.use(`${apiVersion}/notes`, notesRoute);
app.use(`${apiVersion}/reviews`, reviewsRoute);
