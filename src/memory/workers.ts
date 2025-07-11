import { getPagesQueue, parsePageQueue, downloadQueue } from "./queue";
import { getPagesCount, getImagesFromPage } from "../api";
import { getNewDownloadPath, getIdsFilePath } from "../utils/folderManager";
import fs from "fs";
import Downloader from "nodejs-file-downloader";

getPagesQueue.setHandler(async ({ category }) => {
  if (!category) return;
  const pagesCount = await getPagesCount(category);
  for (let page = 0; page < pagesCount; page++) {
    parsePageQueue.add({ category, page });
  }
});

parsePageQueue.setHandler(async ({ category, page }) => {
  const xml = await getImagesFromPage(category, page);
  const startIndex = page * 100;
  const endIndex = startIndex + xml.posts.post.length;
  console.log(
    `parsePage: saving '${category}' ${startIndex}-${endIndex} files`
  );
  for (const imageData of xml.posts.post) {
    const { file_url, id: file_id } = imageData["$"];
    await downloadQueue.add({ file_id, file_url, category });
  }
});

downloadQueue.setHandler(async ({ category, file_id, file_url }) => {
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
    console.log(`download: file '${category}' ${file_id} already downloaded`);
    return;
  }
  const type = file_url.split(".").at(-1);
  console.log(`download: downloading '${category}' ${file_url}`);
  const downloader = new Downloader({
    url: file_url,
    directory: downloadPath,
    fileName: `${file_id}.${type}`,
  });
  await downloader.download();
  fs.appendFileSync(idsFile, `${file_id}\n`);
});
