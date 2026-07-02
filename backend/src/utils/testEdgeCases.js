/**
 * @file testEdgeCases.js
 * @description Utility helper for utils feature.
 */
import db from "../config/db.js";
import { updatePassStatusService } from "../features/gate_pass/gp.service.js";
import { v4 as uuidv4 } from "uuid";

async function testEdgeCases() {
  console.log("=== Running Edge Case Tests ===");

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Helper to create a dummy pass
  const createPass = async (type, passDate, from, to) => {
    const id = uuidv4();
    return db.formdata.create({
      data: {
        id,
        gatePassId: `TEST-${Math.floor(Math.random() * 10000)}`,
        passDate: passDate,
        mobileNo: "1234567890",
        name: "Test User",
        emailId: "test@test.com",
        photoUrl: "",
        status: "Approved",
        updatedAt: new Date(),
      },
    });
  };

  try {
    // Test 1: Single day pass - Future date (Should fail check-in)
    console.log("\nTest 1: Single Day Pass - Future Date");
    const futureSingle = await createPass("single", tomorrow);
    try {
      await updatePassStatusService(futureSingle.id, "Checked-In");
      console.error("❌ FAILED: Allowed check-in for future single day pass");
    } catch (e) {
      console.log("✅ PASSED: Blocked future check-in ->", e.message);
    }

    // Test 2: Single day pass - Past date (Should fail check-in)
    console.log("\nTest 2: Single Day Pass - Past Date");
    const pastSingle = await createPass("single", yesterday);
    try {
      await updatePassStatusService(pastSingle.id, "Checked-In");
      console.error("❌ FAILED: Allowed check-in for past single day pass");
    } catch (e) {
      console.log("✅ PASSED: Blocked past check-in ->", e.message);
    }

    // Test 3: Multi day pass - Future date range (Should fail check-in)
    console.log("\nTest 3: Multi Day Pass - Future Date");
    const futureMulti = await createPass(
      "multi",
      tomorrow,
      tomorrow,
      new Date(tomorrow.getTime() + 86400000),
    );
    try {
      await updatePassStatusService(futureMulti.id, "Checked-In");
      console.error("❌ FAILED: Allowed check-in for future multi day pass");
    } catch (e) {
      console.log("✅ PASSED: Blocked future check-in ->", e.message);
    }

    // Test 4: Multi day pass - Past date range (Should fail check-in)
    console.log("\nTest 4: Multi Day Pass - Past Date");
    const pastMulti = await createPass(
      "multi",
      yesterday,
      new Date(yesterday.getTime() - 86400000),
      yesterday,
    );
    try {
      await updatePassStatusService(pastMulti.id, "Checked-In");
      console.error("❌ FAILED: Allowed check-in for past multi day pass");
    } catch (e) {
      console.log("✅ PASSED: Blocked past check-in ->", e.message);
    }

    // Test 5: Single day pass - Today (Should pass check-in)
    console.log("\nTest 5: Single Day Pass - Today");
    const todaySingle = await createPass("single", today);
    try {
      await updatePassStatusService(todaySingle.id, "Checked-In");
      console.log("✅ PASSED: Allowed check-in for today's single day pass");
    } catch (e) {
      console.error("❌ FAILED: Blocked today check-in ->", e.message);
    }

    // Test 6: Multi day pass - Today (Should pass check-in)
    console.log("\nTest 6: Multi Day Pass - Today");
    const todayMulti = await createPass("multi", today, yesterday, tomorrow);
    try {
      await updatePassStatusService(todayMulti.id, "Checked-In");
      console.log("✅ PASSED: Allowed check-in for today's multi day pass");
    } catch (e) {
      console.error("❌ FAILED: Blocked today check-in ->", e.message);
    }

    // Cleanup
    await db.formdata.deleteMany({
      where: { name: "Test User" },
    });
    console.log("\n=== Edge Case Tests Complete ===");
  } catch (error) {
    console.error("Test execution failed:", error);
  } finally {
    await db.$disconnect();
  }
}

testEdgeCases();
