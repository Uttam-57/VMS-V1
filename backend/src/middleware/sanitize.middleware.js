/**
 * @file sanitize.middleware.js
 * @description Middleware for middleware feature.
 */
import helmet from "helmet"; // Custom sanitization if needed can be placed here, though express-mongo-sanitize
// is usually applied globally in app.js.
export const securityHeaders = helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
});
const cleanObject = (obj) => {
  if (typeof obj !== "object" || obj === null) return;
  for (let key in obj) {
    if (typeof obj[key] === "string") {
      obj[key] = obj[key].replace(/<[^>]*>?/gm, ""); // simple strip tags
    } else if (typeof obj[key] === "object") {
      cleanObject(obj[key]);
    }
  }
};
const sanitizeInput = (req, res, next) => {
  cleanObject(req.body);
  cleanObject(req.query);
  cleanObject(req.params);
  next();
};

export { sanitizeInput };

export default { sanitizeInput, securityHeaders };
