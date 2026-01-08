import type { Result } from "./";
export type AudioEffect =
  | { type: "audio.play"; data: Record<string, string> }
  | { type: "audio.pause" }
  | { type: "audio.stop" }
  | {
      type: "audio.synthesize";
      data: { conversationId: string; audioSrc: string };
    };
export type AudioResult = Result<AudioEffect>;
