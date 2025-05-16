import express from "express";
import { client } from "./redis.js";
import { Queue, QueueEvents, Worker } from "bullmq";
import { getAllUsers } from "./db.js";
import globalLimiter from "./globalLimiter.js";

const rateLimitMap = new Map();

// Rate limiter middleware (IP based)
const rateLimiter = (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.ip;
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recentRequests = timestamps.filter((ts) => now - ts < 1000);

  if (recentRequests.length >= 2) {
    return res.status(429).json({
      timestamps,
      error: "Rate limit exceeded: Max 2 requests per second",
    });
  }

  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  next();
};

// Load all users once
const users = await getAllUsers();

// Single queue and worker for all users
const queue = new Queue("walletQueue", {
  connection: client,
});
const queueEvents = new QueueEvents("walletQueue", {
  connection: client,
});

queueEvents.on("waiting", ({ jobId }) => {
  console.log(`Job ${jobId} is waiting`);
});

queueEvents.on("active", ({ jobId, prev }) => {
  console.log(`Job ${jobId} is active (prev: ${prev})`);
});

queueEvents.on("completed", ({ jobId, returnvalue }) => {
  console.log(`Job ${jobId} completed with result: ${returnvalue}`);
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
  console.log(`Job ${jobId} failed: ${failedReason}`);
});

// Worker with global rate limiter: max 2 jobs per second
const worker = new Worker(
  "walletQueue",
  async (job) => {
    const { userId: queryUserId } = job.data;
    let retryCount = 0;
    const maxRetries = 5;

    while (retryCount < maxRetries) {
      try {
        await globalLimiter.consume('users-api-global');

        const params = new URLSearchParams({ query: queryUserId });
        const response = await fetch(`http://localhost:8000/users?${params.toString()}`);
        const data = await response.json();

        return JSON.stringify(data);
      } catch (err) {
        if (err.msBeforeNext) {
          retryCount++;
          console.warn(`Rate limit hit (retry ${retryCount}). Retrying after ${err.msBeforeNext}ms`);
          await new Promise((resolve) => setTimeout(resolve, err.msBeforeNext));
        } else {
          throw err;
        }
      }
    }
  },
  {
    connection: client,
    concurrency: 1, // control how many jobs per worker
    limiter: {
      groupKey: "global",
      max: 2,
      duration: 1200,
    },
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job.id} failed: ${err.message}`);
});

const app = express();
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.json({ message: "Wallet Queue Service Running" });
});

// Search endpoint — expects userId query param (simulate user identity)
app.get("/search", async (req, res) => {
  const userId = req.query.userId
  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  const queries = [1, 2, 3];

  try {
    const jobs = await Promise.all(
      queries.map((query) => queue.add("sync", { userId: query }, {
        attempts: 3, // Retry failed jobs up to 3 times
        backoff: {
          type: 'exponential',
          delay: 1000, // Wait 1s, then 2s, then 4s
        },
        removeOnComplete: true, // Auto-remove successful jobs from Redis
        removeOnFail: false     // Keep failed jobs for inspection (optional)
      })
      )
    );

    return res.json({
      message: "Your data is processing in the background.",
      jobIds: jobs.map((job) => job.id),
      queueName: "walletQueue",
    });
  } catch (err) {
    console.error("Error processing search queries:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch results for a job ID, userId param needed to locate right queue
app.get("/results/:jobId", async (req, res) => {
  const jobId = req.params.jobId;
  const userId = req.query.userId

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    const job = await queue.getJob(jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const state = await job.getState();

    if (state === "completed") {
      const result = await job.returnvalue;
      return res.json({
        status: "completed",
        result: JSON.parse(result),
      });
    }

    return res.json({ status: state });
  } catch (err) {
    console.error("Error fetching job result:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Users endpoint with rateLimiter middleware
app.get("/users", rateLimiter, async (req, res) => {
  const query = req.query.query?.toString().toLowerCase();

  if (!query) {
    return res.status(400).json({ error: "Missing query in request" });
  }

  try {
    const result = users.find((user) => parseInt(user.id) === parseInt(query));
    return res.json(result);
  } catch (err) {
    console.error("Error calling /users:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
