import { Job } from "bullmq";
import { ParsePageQueueData } from "../types";
import { getImagesFromPage } from "../api";
import { downloadQueue } from "../queues/download";

export async function parsePageProcessor(job: Job<ParsePageQueueData>) {
  const { category, page } = job.data;

  const xml = await getImagesFromPage(category, page);

  const startIndex = page * 100;
  const endIndex = startIndex + xml.posts.post.length;
  console.log(
    `${job.queueName}: saving '${category}' ${startIndex}-${endIndex} files`
  );

  for (const imageData of xml.posts.post) {
    const { file_url, id: file_id } = imageData["$"];
    await downloadQueue.add(`download ${file_url}`, {
      file_id,
      file_url,
      category,
    });
  }
}
