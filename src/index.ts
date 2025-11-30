import "dotenv/config";
import { initializeDownloadFolders } from "./utils/folderManager";

const QUEUE_MODE = process.env.QUEUE_MODE || "memory";
const TAGS = process.env.TAGS ? process.env.TAGS.split(",") : [];

function runMemory(categories: string[]) {
  require("./memory/workers");
  const { getPagesQueue } = require("./memory/queue");
  console.log("In-memory queues enabled");
  for (const category of categories) {
    getPagesQueue.add({ category });
  }
}

function runRedis(categories: string[]) {
  require("./workers");
  const { getPagesQueue } = require("./queues/getPages");
  console.log("Redis queues enabled");
  for (const category of categories) {
    getPagesQueue.add(`get-pages-${category}`, { category });
  }
}

async function launch(categories: string[]) {
  initializeDownloadFolders();

  if (QUEUE_MODE === "memory") {
    runMemory(categories);
  } else {
    runRedis(categories);
  }
}

launch(TAGS);
