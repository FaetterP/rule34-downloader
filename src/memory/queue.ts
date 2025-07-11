import {
  DownloadQueueData,
  ParsePageQueueData,
  GetPagesQueueData,
} from "../types";

type Handler<Data> = (data: Data) => Promise<void>;

export class InMemoryQueue<Data> {
  private queue: Data[] = [];
  private processing = false;
  private handler: Handler<Data> | null = null;

  setHandler(handler: Handler<Data>) {
    this.handler = handler;
    this.processNext();
  }

  async add(data: Data) {
    this.queue.push(data);
    this.processNext();
  }

  private async processNext() {
    if (this.processing || !this.handler) return;
    const data = this.queue.shift();
    if (!data) return;
    this.processing = true;
    try {
      await this.handler(data);
    } catch (e) {
      console.error("InMemoryQueue job failed", e);
    }
    this.processing = false;
    if (this.queue.length > 0) {
      this.processNext();
    }
  }
}

export const getPagesQueue = new InMemoryQueue<GetPagesQueueData>();
export const parsePageQueue = new InMemoryQueue<ParsePageQueueData>();
export const downloadQueue = new InMemoryQueue<DownloadQueueData>();
