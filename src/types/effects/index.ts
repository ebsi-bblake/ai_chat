import { AudioEffect } from "./audio";
import { NetworkEffect } from "./network";
import { ScrollEffect } from "./scroll";
import { StorageEffect } from "./storage";

export type Result<T> = { ok: true; value: T } | { ok: false; error: unknown };

export type EffectResult = Result<unknown>;
export type Effect = AudioEffect | NetworkEffect | StorageEffect | ScrollEffect;
