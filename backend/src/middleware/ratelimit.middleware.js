/**
 * @file ratelimit.middleware.js
 * @description Middleware for middleware feature.
 */
import express_rate_limit from "express-rate-limit";
export const apiLimiter = express_rate_limit({
  windowMs: 15 * 60 * 1000,
  // 15 minutes
  max: 1000,
  // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
export const authLimiter = express_rate_limit({
  windowMs: 60 * 60 * 1000,
  // 1 hour window
  max: 10,
  // start blocking after 10 requests
  message:
    "Too many accounts created from this IP, please try again after an hour",
});
export default { apiLimiter, authLimiter };
