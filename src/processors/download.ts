import { Job } from "bullmq";
import { DownloadQueueData } from "../types";
import fs from "fs";
import Downloader from "nodejs-file-downloader";
import { getNewDownloadPath, getIdsFilePath } from "../utils/folderManager";

export function getDownloadProcessor(workerName: string) {
  return async function downloadProcessor(job: Job<DownloadQueueData>) {
    const { category, file_id, file_url } = job.data;
    const idsFile = getIdsFilePath(category);
    const downloadPath = getNewDownloadPath(category);
    
    if (!fs.existsSync(idsFile)) {
      fs.mkdirSync(downloadPath, { recursive: true });
      fs.closeSync(fs.openSync(idsFile, "w"));
    }
    const notDownload = fs
      .readFileSync(idsFile, { encoding: "utf8" })
      .split("\n");

    if (notDownload.includes(`${file_id}`)) {
      console.log(
        `${workerName}: file '${category}' ${file_id} already downloaded`
      );
      return;
    }

    const type = job.data.file_url.split(".").at(-1);

    console.log(`${workerName}: downloading '${category}' ${file_url}`);
    const downloader = new Downloader({
      url: job.data.file_url,
      directory: downloadPath,
      fileName: `${file_id}.${type}`,
    });

    await downloader.download();

    fs.appendFileSync(idsFile, `${file_id}\n`);
  };
}
