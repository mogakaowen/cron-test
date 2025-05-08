import express from "express";
import { startCronJob } from "./syncScheduler.js";
import startWorker from "./syncWorker.js";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Wallet Sync Service Running");
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);

  // Start the worker first to ensure it is ready to process jobs
  startWorker();

  // Start the cron job to schedule jobs at the specified intervals
  startCronJob();
});
