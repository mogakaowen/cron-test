# BullMQ Cron Job Scheduler

A robust Node.js application that demonstrates how to implement scheduled background jobs using BullMQ, cron, and Redis. This project provides a practical example of wallet transaction synchronization between a local database and an external service.

## 🚀 Features

- **Scheduled Job Processing**: Automatically runs tasks at specified intervals using cron
- **Queue Management**: Handles background jobs efficiently with BullMQ
- **Concurrent Processing**: Processes multiple jobs simultaneously
- **Error Handling**: Robust error handling for failed jobs
- **Redis Integration**: Uses Redis as a reliable message broker

## 🛠️ Technologies

- **[BullMQ](https://docs.bullmq.io/)**: A robust job and task queue library for Node.js, powered by Redis
- **[cron](https://github.com/kelektiv/node-cron)**: A simple Node.js module for scheduling cron jobs
- **[Redis](https://redis.io/)**: A high-performance in-memory data structure store used as the backend for BullMQ
- **[Express](https://expressjs.com/)**: A minimal web framework for Node.js
- **[ioredis](https://github.com/luin/ioredis)**: A robust, performance-focused Redis client for Node.js

## 📋 Project Structure

```
├── index.js           # Entry point - Express server setup
├── syncScheduler.js   # Cron job scheduler that adds jobs to the queue
├── syncQueue.js       # Queue configuration for BullMQ
├── syncWorker.js      # Worker that processes jobs from the queue
├── syncWallet.js      # Business logic for wallet transaction synchronization
├── db.js              # Mock database functions (replace with real DB in production)
├── redis.js           # Redis client configuration
└── .env               # Environment variables for Redis connection
```

## 🔧 Setup and Installation

1. **Clone the repository**

```bash
git clone https://github.com/mogakaowen/cron-test.git
cd cron-test
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory with the following variables:

```
REDIS_USER=your_redis_username
REDIS_PASS=your_redis_password
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
```

4. **Start the application**

```bash
npm start
```

## 🔄 How It Works

1. **Cron Job Scheduling**: The application uses the `cron` package to schedule jobs at regular intervals (currently set to run every minute).

2. **Job Queue**: When the cron job runs, it fetches all users from the database and adds them to a BullMQ queue for processing.

3. **Worker Processing**: A BullMQ worker listens to the queue and processes jobs as they arrive, with support for concurrent processing (up to 5 jobs simultaneously).

4. **Wallet Synchronization**: For each user, the worker:
   - Fetches local transactions from the database
   - Fetches transactions from an external service (IntaSend)
   - Identifies missing transactions
   - Inserts missing transactions into the local database

## 📝 Customization

- **Cron Schedule**: Modify the cron expression in `syncScheduler.js` to change the job frequency
- **Concurrency**: Adjust the `concurrency` option in `syncWorker.js` to control parallel processing
- **Business Logic**: Update the `syncWallet.js` file to implement your specific synchronization logic

## 📚 Additional Resources

- [BullMQ Documentation](https://docs.bullmq.io/)
- [Cron Syntax Reference](https://crontab.guru/)
- [Redis Documentation](https://redis.io/documentation)
