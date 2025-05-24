// src/app.js
import dotenv from "dotenv";
import connectDB from "./src/config/database.js";
import express from "express";
import errorHandler from "./src/middleware/errorHandler.js";
import userRoutes from "./src/module/userModule/userRoutes.js";
import userProfileRoutes from "./src/module/userModule/userProfileRoutes.js";
import authRoutes from "./src/module/auth/authRoutes.js";
import notificationRoutes from "./src/module/notification/notificationRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import session from "express-session";
import passport from "passport";
import "./src/module/passport/passport.js";


// Load environment variables
dotenv.config();

// Create Express app
const app = express();

//Allow Cors
app.use(
  cors({
    origin: [`${process.env.localUrl}`, `${process.env.productionUrl}`], // <-- Your frontend origin
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());


app.use(session({
  secret: process.env.JWT_SECRET || "mysecret",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// Connect to database
connectDB();

// Routes
app.get("/api/check-auth", (req, res) => {
  console.log(req.cookies);

  if (req.cookies.access_token) {
    res.json({ isAuthenticated: true });
  } else {
    res.json({ isAuthenticated: false });
  }
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/user", userProfileRoutes);
app.use("/api/notifications", notificationRoutes);

// Home Route
app.get("/", (req, res) => {
  res.send("Hello Fitness-App!!");
});

app.use("*", (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
