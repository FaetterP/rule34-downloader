import { Job } from "bullmq";
import { GetPagesQueueData } from "../types";
import { getPagesCount } from "../api";
import { parsePageQueue } from "../queues/parsePage";

export async function getPagesProcessor(job: Job<GetPagesQueueData>) {
  const { category } = job.data;
  if (!category) return;

  const pagesCount = await getPagesCount(category);

  for (let page = 0; page < pagesCount; page++) {
    parsePageQueue.add(`parse ${category} ${page}`, { category, page });
  }
}
