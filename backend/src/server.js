/**
 * @file server.js
 * @description Entry point for the backend server.
 */
import env from "./config/env.js";
import app from "./app.js";
import db from "./config/db.js";
import logger from "./utils/logger.utils.js";

process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  logger.error(err.name, err.message);
  process.exit(1);
});

await db.connectDB();

const port = env.PORT || 5000;
const server = app.listen(port, () => {
  logger.info(`App running on port ${port}...`);
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  logger.error("UNHANDLED REJECTION! 💥 Shutting down...");
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
