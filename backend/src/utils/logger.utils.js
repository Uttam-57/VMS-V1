/**
 * @file logger.utils.js
 * @description Utility helper for utils feature.
 */
import winston from "winston"; // custom format
const customFormat = winston.format.printf(({ timestamp, level, message }) => {
  return `${level}: ${message} - { ${timestamp} }`;
});
const logger = winston.createLogger({
  // In development, log everything ('debug' and up). In prod, log 'http' and up (which includes Morgan HTTP request logs).
  level: process.env.NODE_ENV === "production" ? "http" : "debug",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss A",
    }),
  ),
  transports: [
    // 1. Console (With Colors & Custom Format)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({
          all: true,
        }),
        // Colorize the whole line
        customFormat, // Use your custom layout
      ),
    }),
    // 2. Files (No Colors, otherwise text files get weird symbols like \x1b[32m)
    new winston.transports.File({
      filename: "./src/logs/error.log",
      level: "error",
      format: customFormat,
    }),
    new winston.transports.File({
      filename: "./src/logs/combined.log",
      format: customFormat,
    }),
  ],
});
export default logger;
