import express from "express";
const app = express();
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleWare from "./middlewares/error.js";

if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "backend/config/config.env" });
}

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err}`);
  console.log(`Shutting down due to uncaught expection`);
  process.exit(1);
});

//connection to database
connectDatabase();
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

//Import all routes
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/order.js";
import paymentRoutes from "./routes/payment.js";

app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes);

app.get("/test-error", (req, res, next) => {
  const error = new Error("Test error");
  error.statusCode = 400;
  next(error);
});

if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}
//Using error middleware
app.use(errorMiddleWare);

const server = app.listen(process.env.PORT, () => {
  console.log(
    `server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});

//handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err}`);
  console.log(`Shutting down server due to unhandled Promise Rejection`);
  server.close(() => {
    process.exit(1);
  });
});
