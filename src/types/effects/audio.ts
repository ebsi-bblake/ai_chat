import type { Result } from "./result";
export type AudioEffect =
  | { type: "audio.play"; payload: Record<string, string> }
  | { type: "audio.pause" }
  | { type: "audio.stop" };

export type AudioResult = Result<void>;
