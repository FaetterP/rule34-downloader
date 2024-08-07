import { Queue } from "bullmq";
import { DownloadQueueData } from "../types";
import { redisConnection } from "../redis";

export const DOWNLOADING_QUEUE_NAME = "downloads";

export const downloadQueue = new Queue<DownloadQueueData>(
  DOWNLOADING_QUEUE_NAME,
  {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: 5,
      backoff: { type: "exponential", delay: 2000 },
    },
  }
);
