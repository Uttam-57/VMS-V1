/**
 * @file appError.js
 * @description Utility helper for utils feature.
 */
class AppError extends Error {
  // 1. Declare property types here
  statusCode;
  errorCode;
  errors; // Optional property
  isOperational;
  constructor(message, statusCode, errorCode, errors) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;
    this.isOperational = true;
    // Use Error.captureStackTrace only if it exists (Node.js environments)
  }
}
export default AppError;
