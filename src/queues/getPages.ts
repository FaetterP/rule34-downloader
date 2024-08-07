import { Queue } from "bullmq";
import { GetPagesQueueData } from "../types";
import { redisConnection } from "../redis";

export const GET_PAGES_QUEUE_NAME = "get-pages";

export const getPagesQueue = new Queue<GetPagesQueueData>(
  GET_PAGES_QUEUE_NAME,
  {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: 5,
      backoff: { type: "exponential", delay: 2000 },
    },
  }
);
