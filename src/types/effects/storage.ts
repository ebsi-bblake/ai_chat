export type StorageEffect =
  | { type: "storage.write"; payload: { key: string; value: string } }
  | { type: "storage.read"; payload: { key: string } }
  | { type: "storage.delete"; payload: { key: string } }
  | { type: "storage.clear"; payload?: { prefix?: string } };

export type StorageReadResult = Result<{ value: string | null }>;
export type StorageWriteResult = Result<void>;
