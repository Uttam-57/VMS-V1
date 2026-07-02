/**
 * @file seedCompany.js
 * @description Seeding script for CompanyRegister (Super Admin credentials).
 */
import dotenv from "dotenv";
dotenv.config();

import db from "../config/db.js";

async function main() {
  await db.connectDB();
  console.log("✅  Connected to Database via Prisma Client");

  const companyId = "default";

  // Upsert the default company register details
  const company = await db.companyregister.upsert({
    where: { id: companyId },
    update: {
      companyFullName: "Default Company",
      companyShortName: "DC",
      companyContactNo: "1234567890",
      logoUrl: "",
      hostName: "smtp.gmail.com",
      portNo: 587,
      userEmailId: "admin@gmail.com",
      emailPassword: "12345", // Password for superadmin login
      startTime: "09:00",
      endTime: "19:00",
      updatedAt: new Date(),
    },
    create: {
      id: companyId,
      companyFullName: "Default Company",
      companyShortName: "DC",
      companyContactNo: "1234567890",
      logoUrl: "",
      hostName: "smtp.gmail.com",
      portNo: 587,
      userEmailId: "admin@gmail.com",
      emailPassword: "12345", // Password for superadmin login
      startTime: "09:00",
      endTime: "19:00",
      updatedAt: new Date(),
    },
  });

  console.log("\n📊  Seeded Company Register successfully:");
  console.log(`    ID            → ${company.id}`);
  console.log(`    Company Name  → ${company.companyFullName}`);
  console.log(`    Super Admin   → ${company.userEmailId}`);
  console.log(`    Password      → ${company.emailPassword}`);
  console.log(`\n✅  Super Admin login credentials successfully configured!`);
}

main()
  .catch((err) => {
    console.error("❌  seedCompany failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
    console.log("🔌  Disconnected from Database");
  });
