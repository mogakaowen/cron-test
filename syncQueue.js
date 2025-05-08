import { Queue } from "bullmq";
import { client } from "./redis.js";

// Set up the sync queue using the Redis client
const syncQueue = new Queue("wallet-sync", { connection: client });

// Function to add sync jobs to the queue
async function addSyncJob(userId) {
  console.log("Queue started: userId =>", userId);
  await syncQueue.add("sync-user", { userId });
}

export { addSyncJob, syncQueue };
