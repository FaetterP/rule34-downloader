import { getPagesQueue } from "./queues/getPages";
import fs from "node:fs";
import "./workers";

async function launch(categories: string[]) {
  const downloadsFolder = `${__dirname}/../downloads`;
  if (!fs.existsSync(downloadsFolder)) {
    fs.mkdirSync(downloadsFolder);
  }

  for (const category of categories) {
    getPagesQueue.add(`get pages '${categories}'`, { category });
  }
}

launch([]);
