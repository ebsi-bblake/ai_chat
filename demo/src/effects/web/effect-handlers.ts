import type { EffectHandlers } from "../../../../src/types/runtime";
import type { EffectResult } from "../../../../src/types/effects/";

import { handleNetworkEffect } from "./network-handler";
import { handleAudioEffect } from "./audio-handler";
import { handleStorageEffect } from "./storage-handler";

export const handleEffect: EffectHandlers = async (
  effect,
): Promise<EffectResult> => {
  switch (effect.type) {
    case "network.post":
      return handleNetworkEffect(effect);

    case "audio.synthesize":
      return handleAudioEffect(effect);

    case "storage.write":
    case "storage.read":
    case "storage.delete":
    case "storage.clear":
      return handleStorageEffect(effect);

    default:
      return {
        ok: false,
        error: "unsupported-effect",
      };
  }
};
