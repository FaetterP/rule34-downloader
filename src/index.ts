import { getPagesQueue } from "./queues/getPages";
import { initializeDownloadFolders } from "./utils/folderManager";
import "./workers";

async function launch(categories: string[]) {
  initializeDownloadFolders();

  for (const category of categories) {
    getPagesQueue.add(`get pages '${categories}'`, { category });
  }
}

launch([]);
