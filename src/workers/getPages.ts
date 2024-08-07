import { Worker } from "bullmq";
import { GetPagesQueueData } from "../types";
import { redisConnection } from "../redis";
import { getPagesProcessor } from "../processors/getPages";
import { GET_PAGES_QUEUE_NAME } from "../queues/getPages";

const worker = new Worker<GetPagesQueueData>(
  GET_PAGES_QUEUE_NAME,
  getPagesProcessor,
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
