import { Worker } from "bullmq";
import { ParsePageQueueData } from "../types";
import { PARSE_PAGE_QUEUE_NAME } from "../queues/parsePage";
import { parsePageProcessor } from "../processors/parsePage";
import { redisConnection } from "../redis";

const worker = new Worker<ParsePageQueueData>(
  PARSE_PAGE_QUEUE_NAME,
  parsePageProcessor,
  { connection: redisConnection, concurrency: 5 }
);

worker.on("error", (err) => {
  console.log(err);
});

worker.on("failed", (err) => {
  if (!err) {
    return console.log({ err });
  }

  console.log(`ERROR`, {
    queueName: err.queueName,
    message: err.failedReason,
    data: err.data,
  });
});
