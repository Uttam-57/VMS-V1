/**
 * @file db.js
 * @description Configuration for database connection using Prisma Client and MariaDB Driver Adapter.
 */
import "dotenv/config";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import logger from "../utils/logger.utils.js";

let adapterConfig = process.env.DATABASE_URL;

if (process.env.DATABASE_URL) {
  try {
    const url = new URL(process.env.DATABASE_URL);
    const sslcert = url.searchParams.get("sslcert");

    if (sslcert) {
      const config = {
        host: url.hostname,
        port: url.port ? parseInt(url.port, 10) : 3306,
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        database: url.pathname.substring(1),
        ssl: {
          ca: fs.readFileSync(path.resolve(sslcert)),
        },
      };
      adapterConfig = config;
    }
  } catch (error) {
    logger.error(`Failed to parse DATABASE_URL for adapter: ${error.message}`);
  }
}

const db = new PrismaClient({
  adapter: new PrismaMariaDb(adapterConfig),
  log: ["error", "warn"],
});

db.connectDB = async () => {
  try {
    await db.$connect();
    logger.info("Database Connected via Prisma Client");
  } catch (error) {
    logger.error(`Error connecting to Database via Prisma: ${error.message}`);
    process.exit(1);
  }
};

db.pool = {
  end: async () => {
    await db.$disconnect();
  },
};

export default db;
export { db };
