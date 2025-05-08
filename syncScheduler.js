import { CronJob } from "cron";
import { addSyncJob } from "./syncQueue.js";
import { getAllUsers } from "./db.js";

export const startCronJob = () => {
  const job = new CronJob(
    "*/1 * * * *", // Runs every 3 minutes
    async () => {
      console.log("⏰ Running transaction sync cron");

      const users = await getAllUsers();
      for (const user of users) {
        await addSyncJob(user.id); // Add each user to the queue
      }

      console.log(`📥 Queued ${users.length} users for sync`);
    },
    null, // No onComplete function
    true // Start the cron job immediately
  );

  // No need to call job.start() again if `true` is passed in the constructor

  return job; // Return the cron job
};
