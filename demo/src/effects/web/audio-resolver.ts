import type { Command } from "../../../../src/types";
import type { EffectResult } from "../../../../src/types/effects";
import type { ID } from "../../../../src/types/runtime";

type AudioSynthesizeValue = {
  conversationId: string;
  audioSrc: string;
};

const now = (): string => new Date().toISOString();

export const resolveAudioSynthesize =
  (ids: ID) =>
  (result: EffectResult): Command[] => {
    if (!result.ok) return [];

    const value = result.value as AudioSynthesizeValue;

    return [
      {
        type: "StartAudio",
        category: "command",
        id: ids(),
        time: now(),
        data: {
          conversationId: value.conversationId,
          audioSrc: value.audioSrc,
          avatar: "ai",
        },
      },
    ];
  };
