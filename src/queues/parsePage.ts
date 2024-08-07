import { Queue } from "bullmq";
import { ParsePageQueueData } from "../types";
import { redisConnection } from "../redis";

export const PARSE_PAGE_QUEUE_NAME = "parse-page";

export const parsePageQueue = new Queue<ParsePageQueueData>(
  PARSE_PAGE_QUEUE_NAME,
  {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: 5,
      backoff: { type: "exponential", delay: 2000 },
    },
  }
);
