import { Queue } from "bullmq";

// Redis Configuration
export const redisConfig = {
  host: "127.0.0.1",
  port: 6379,
};


// Define a queue for highlight extraction jobs
export const highlightQueue = new Queue("highlightQueue", {
  connection: redisConfig,
});
