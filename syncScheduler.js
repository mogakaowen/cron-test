import { CronJob } from "cron";
import { addSyncJob } from "./syncQueue.js";
import { getAllUsers } from "./db.js";

const runSyncNow = async () => {
  console.log("🚀 Running immediate sync");

  const users = await getAllUsers();
  for (const user of users) {
    await addSyncJob(user.id);
  }

  console.log(`📥 Queued ${users.length} users for immediate sync`);
};

export const startCronJob = () => {
  // Run once on startup if you need
  runSyncNow();

  // Schedule every 5 minutes
  const job = new CronJob(
    "*/5 * * * *", // Every 5 minutes
    async () => {
      console.log("⏰ Running scheduled transaction sync");

      const users = await getAllUsers();
      for (const user of users) {
        await addSyncJob(user.id);
      }

      console.log(`📥 Queued ${users.length} users for sync`);
    },
    null,
    true // Start the cron job immediately
  );

  return job;
};
