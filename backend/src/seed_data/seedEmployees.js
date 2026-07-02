/**
 * @file seedEmployees.js
 * @description module for seed_data feature.
 */
import dotenv from "dotenv";
dotenv.config();

import db from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import {
  employeeSeedRecords,
  getDepartmentNamesFromEmployeeSeed,
} from "./employeeMasterRecords.js";

async function main() {
  await db.connectDB();
  console.log("✅  Connected to Database via Prisma Client");

  // Clear existing data for employees and departments
  await db.employee.deleteMany();
  await db.department.deleteMany();
  console.log("🗑️   Cleared existing employees and departments data");

  // Insert departments
  const departmentNames = getDepartmentNamesFromEmployeeSeed();
  for (const name of departmentNames) {
    await db.department.create({
      data: { id: uuidv4(), name, status: "active" },
    });
  }

  // Insert employees
  for (const emp of employeeSeedRecords) {
    await db.employee.create({
      data: { id: uuidv4(), ...emp },
    });
  }

  console.log(`\n📊  Seeded successfully:`);
  console.log(
    `    Department    → ${departmentNames.length} records (from employee seed)`,
  );
  console.log(`    Employee      → ${employeeSeedRecords.length} records`);
  console.log(
    `\n✅  Total: ${departmentNames.length + employeeSeedRecords.length} records inserted`,
  );
}

main()
  .catch((err) => {
    console.error("❌  seedEmployees failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
    console.log("🔌  Disconnected from Database");
  });
