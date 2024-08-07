export type GetPagesQueueData = {
  category: string;
};

export type ParsePageQueueData = {
  category: string;
  page: number;
};

export type DownloadQueueData = {
  file_url: string;
  category: string;
  file_id: number;
};
