import { Effect } from "./index";
import { NetworkEffect, NetworkResult } from "./network";
import {
  StorageEffect,
  StorageReadResult,
  StorageWriteResult,
} from "./storage";
import { AudioEffect, AudioResult } from "./audio";

export type EffectResult<T extends Effect> = T extends NetworkEffect
  ? NetworkResult
  : T extends { type: "storage.read" }
    ? StorageReadResult
    : T extends StorageEffect
      ? StorageWriteResult
      : T extends AudioEffect
        ? AudioResult
        : never;
