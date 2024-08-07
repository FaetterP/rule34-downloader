import { getPagesQueue } from "./queues/getPages";
import "./workers"

async function launch(categories: string[]) {
  for (const category of categories) {
    getPagesQueue.add(`get pages '${categories}'`, { category });
  }
}

launch([]);
