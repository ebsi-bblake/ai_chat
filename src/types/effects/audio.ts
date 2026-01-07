export type AudioEffect =
  | { type: "audio.play"; payload: { url: string; volume?: number } }
  | { type: "audio.pause" }
  | { type: "audio.stop" };

export type AudioResult = Result<void>;
