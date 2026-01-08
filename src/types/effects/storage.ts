import type { Result } from "./";
export type StorageEffect =
  | { type: "storage.write"; data: { key: string; value: string } }
  | { type: "storage.read"; data: { key: string } }
  | { type: "storage.delete"; data: { key: string } }
  | { type: "storage.clear"; data?: { prefix?: string } };

export type StorageReadResult = Result<{ value: string | null }>;
export type StorageWriteResult = Result<void>;
