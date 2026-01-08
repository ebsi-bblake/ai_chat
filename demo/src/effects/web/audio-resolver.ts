import type { AudioSynthesizeResult } from "../types";
import type { Command } from "../../../../src/types";
import type { ID } from "../../../../src/types/runtime";

const now = (): string => new Date().toISOString();

export const resolveAudioSynthesize =
  (ids: ID) =>
  (result: AudioSynthesizeResult): Command[] => {
    if (!result.ok) return [];

    return [
      {
        type: "StartAudio",
        category: "command",
        id: ids(),
        time: now(),
        data: {
          conversationId: result.value.conversationId,
          audioSrc: result.value.audioSrc,
          avatar: "ai",
        },
      },
    ];
  };
