export type BulkResult = {
  cookie: number;
  results: { message: string; status: string }[];
};
