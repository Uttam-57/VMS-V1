/**
 * @file script.js
 * @description module for seed_data feature.
 */
import logger_utils from "../utils/logger.utils.js";
import dotenv from "dotenv";
dotenv.config();

import db from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

// ─────────────────────────────────────────────────────────────
// VISITOR TYPE
// ─────────────────────────────────────────────────────────────
const visitorTypes = [
  { name: "Guest", description: "Personal or informal visitor" },
  { name: "Vendor", description: "Supplier or service provider" },
  { name: "Client", description: "Business client or customer" },
  { name: "Contractor", description: "External contractor or freelancer" },
  { name: "Government", description: "Government official or inspector" },
];
// ─────────────────────────────────────────────────────────────
// PURPOSE
// ─────────────────────────────────────────────────────────────
const purposes = [
  { name: "Meeting", description: "Scheduled business meeting" },
  { name: "Delivery", description: "Package or goods delivery" },
  { name: "Interview", description: "Job interview or HR discussion" },
  {
    name: "Site Inspection",
    description: "Inspection of premises or equipment",
  },
  { name: "Maintenance", description: "Repair or maintenance work" },
  {
    name: "Training",
    description: "Attending or conducting a training session",
  },
  { name: "Personal Visit", description: "Visiting an employee personally" },
];
// ─────────────────────────────────────────────────────────────
// VISITING AREA
// ─────────────────────────────────────────────────────────────
const visitingAreas = [
  {
    name: "Reception",
    floor: "Ground",
    description: "Main entrance and reception desk",
  },
  {
    name: "Conference Room A",
    floor: "1st",
    description: "Large meeting room for up to 20 people",
  },
  {
    name: "Conference Room B",
    floor: "1st",
    description: "Small meeting room for up to 8 people",
  },
  {
    name: "HR Department",
    floor: "2nd",
    description: "Human resources office",
  },
  {
    name: "Finance Department",
    floor: "2nd",
    description: "Accounts and finance office",
  },
  {
    name: "IT Department",
    floor: "3rd",
    description: "Information technology office",
  },
  {
    name: "Server Room",
    floor: "3rd",
    description: "Restricted — authorised personnel only",
  },
  {
    name: "Warehouse",
    floor: "Ground",
    description: "Storage and logistics area",
  },
  {
    name: "Cafeteria",
    floor: "Ground",
    description: "Common dining and break area",
  },
  {
    name: "Director's Office",
    floor: "4th",
    description: "Executive and management suite",
  },
];
// ─────────────────────────────────────────────────────────────
// CARRY WITH
// ─────────────────────────────────────────────────────────────
const carryWithItems = [
  { name: "Laptop", description: "Personal or work laptop" },
  { name: "Mobile Phone", description: "Personal mobile device" },
  { name: "Camera", description: "Photography or video camera" },
  { name: "USB Drive", description: "External storage device" },
  { name: "Tablet", description: "iPad or Android tablet" },
  { name: "Toolbox", description: "Hand tools for maintenance work" },
  {
    name: "Delivery Package",
    description: "Parcel or boxed goods for delivery",
  },
  { name: "Documents", description: "Printed files, contracts or reports" },
  { name: "Bag / Backpack", description: "Personal carry bag" },
  { name: "ID Card", description: "Government or company issued ID" },
  { name: "Firearm", description: "Licensed firearm — security personnel" },
  { name: "Medical Equipment", description: "Medical devices or supplies" },
];

// ─────────────────────────────────────────────────────────────
// SEED RUNNER
// ─────────────────────────────────────────────────────────────
const seed = async () => {
  try {
    await db.connectDB();
    console.log("✅  Connected to Database via Prisma Client");

    // Clear existing data
    await db.carrywith.deleteMany();
    await db.visitingarea.deleteMany();
    await db.purpose.deleteMany();
    await db.visitortype.deleteMany();
    console.log("🗑️   Cleared existing master data");

    // Insert fresh data
    for (const item of visitorTypes) {
      await db.visitortype.create({
        data: {
          id: uuidv4(),
          ...item,
          status: "active",
        },
      });
    }
    for (const item of purposes) {
      await db.purpose.create({
        data: {
          id: uuidv4(),
          ...item,
          status: "active",
        },
      });
    }
    for (const item of visitingAreas) {
      await db.visitingarea.create({
        data: {
          id: uuidv4(),
          ...item,
          status: "active",
        },
      });
    }
    for (const item of carryWithItems) {
      await db.carrywith.create({
        data: {
          id: uuidv4(),
          ...item,
          status: "active",
        },
      });
    }

    console.log(`\n📊  Seeded successfully:`);
    console.log(`    VisitorType   → ${visitorTypes.length} records`);
    console.log(`    Purpose       → ${purposes.length} records`);
    console.log(`    VisitingArea  → ${visitingAreas.length} records`);
    console.log(`    CarryWith     → ${carryWithItems.length} records`);
    console.log(
      `\n✅  Total: ${visitorTypes.length + purposes.length + visitingAreas.length + carryWithItems.length} records inserted`,
    );
  } catch (err) {
    console.error("❌  Seed failed:", err);
    process.exit(1);
  } finally {
    await db.$disconnect();
    console.log("🔌  Disconnected from Database");
  }
};
seed();
