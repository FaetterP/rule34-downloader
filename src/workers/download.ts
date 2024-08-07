import { Worker } from "bullmq";
import { DownloadQueueData } from "../types";
import { DOWNLOADING_QUEUE_NAME } from "../queues/download";
import { redisConnection } from "../redis";
import { getDownloadProcessor } from "../processors/download";

const count = 5;

for (let i = 1; i <= count; i++) {
  const workerName = `${DOWNLOADING_QUEUE_NAME}_${i}`;
  console.log(`Create worker '${workerName}'`);

  const worker = new Worker<DownloadQueueData>(
    DOWNLOADING_QUEUE_NAME,
    getDownloadProcessor(workerName),
    { connection: redisConnection, name: workerName }
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
      workerName: workerName,
      message: err.failedReason,
      data: err.data,
    });
  });
}
