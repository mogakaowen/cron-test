import { Worker } from "bullmq";
import { client } from "./redis.js";
import { syncUserWalletTransactions } from "./syncWallet.js";
const startWorker = () => {
  console.log("Worker started =>");
  const worker = new Worker(
    "wallet-sync", // The name of the queue the worker listens to
    async (job) => {
      console.log("Job:", `${job.name} - ${job.data.userId}`);
      const { userId } = job.data; // Extract userId from the job data
      await syncUserWalletTransactions(userId); // Sync the user's wallet transactions
    },
    {
      connection: client, // Use the Redis client for BullMQ
      concurrency: 5, // The worker can process up to 5 jobs concurrently
    }
  );

  worker.on("completed", (job) => {
    console.log(`✅ Completed job for user ${job.data.userId}`);
  });

  worker.on("failed", (job, err) => {
    console.error(`❌ Job failed for user ${job.data.userId}:`, err);
  });

  return worker; // Return the worker instance
};

export default startWorker;
