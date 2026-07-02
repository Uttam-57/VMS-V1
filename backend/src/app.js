/**
 * @file app.js
 * @description module for src feature.
 */
import express from "express";
import cors from "cors";
import sanitize_middleware from "./middleware/sanitize.middleware.js";
import ratelimit_middleware from "./middleware/ratelimit.middleware.js";
import morgan from "morgan";
import logger from "./utils/logger.utils.js";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./features/auth/auth.routes.js";
import gp_routes from "./features/gate_pass/gp.routes.js";
import master_routes from "./features/master/master.routes.js";
import report_routes from "./features/report/report.routes.js";
import userRoutes from "./features/user/user.routes.js";
import roleRoutes from "./features/role/role.routes.js";
import cookieParser from "cookie-parser";
const app = express();

// Trust reverse proxy (e.g., Render, AWS ALB, Nginx) for secure cookies
app.set("trust proxy", 1);

// 1. GLOBAL MIDDLEWARES
// Implement CORS as the very first middleware to allow preflight requests
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      return callback(null, true);
    },
    credentials: true,
  }),
);

// Set security HTTP headers
app.use(sanitize_middleware.securityHeaders);
app.use("/api", ratelimit_middleware.apiLimiter);
app.use(
  express.json({
    limit: "10kb",
  }),
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  }),
);
app.use(cookieParser());
app.use(sanitize_middleware.sanitizeInput);
// Development logging
const stream = {
  write: (message) => logger.http(message.trim()),
};
// 3. Apply Morgan WITH the stream option attached!
app.use(
  morgan(
    "[:method]|| :url ||Status::status ||ResponseTime: { :response-time ms }  ||Device: { :user-agent }",
    {
      stream: stream,
    },
  ),
);
// Data sanitization against XSS
logger.info(`Routing requested`);
// 2. ROUTES
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/capture", gp_routes);
app.use("/api/v1/master", master_routes);
app.use("/api/v1/report", report_routes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/role", roleRoutes);

// 3. ERROR HANDLING MIDDLEWARE
app.use(errorHandler);
export default app;
