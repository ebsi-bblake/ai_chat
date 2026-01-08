import type { EffectHandlers } from "../../../../src/types/runtime";
import type { EffectResult } from "../../../../src/types/effects/effect-result";
import type { Effect } from "../../../../src/types/effects";

import { handleNetworkEffect } from "./network-handler";
import { handleAudioSynthesize } from "./audio-handler";

export const handleEffect: EffectHandlers["handle"] = async <T extends Effect>(
  effect: T,
): Promise<EffectResult<T>> => {
  switch (effect.type) {
    case "network.post":
      return (await handleNetworkEffect(effect as any)) as EffectResult<T>;

    case "audio.synthesize":
      return (await handleAudioSynthesize(effect as any)) as EffectResult<T>;

    default:
      return {
        ok: false,
        error: "unsupported-effect",
      } as EffectResult<T>;
  }
};
