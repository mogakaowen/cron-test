// import { createClient } from "redis";
// import dotenv from "dotenv";

// dotenv.config();

// // Create Redis client
// const client = createClient({
//   username: process.env.REDIS_USER,
//   password: process.env.REDIS_PASS,
//   socket: {
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT,
//   },
// });

// // Redis error handler
// client.on("error", (err) => {
//   console.error("Redis Client Error:", err);
// });

// // Connect to Redis
// await client.connect();

// export { client };

// redis.js
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const client = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT, 10),
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASS,
  maxRetriesPerRequest: null,
});

client.on("connect", () => {
  console.log("✅ Redis connected");
});

client.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

export { client };
