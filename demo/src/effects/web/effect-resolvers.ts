import type { EffectResolver, ID } from "../../../../src/types/runtime";
import type { Effect } from "../../../../src/types/effects";
import type { EffectResult } from "../../../../src/types/effects";
import type { NetworkResult } from "../../../../src/types/effects/network";

import { resolveNetworkResult } from "./network-resolver";
import { handleAudioEffect } from "./audio-handler";

export const resolveEffect =
  (ids: ID): EffectResolver =>
  (effect: Effect, result: EffectResult) => {
    switch (effect.type) {
      case "network.post":
      case "network.ws":
        return resolveNetworkResult(ids)(result as NetworkResult);

      case "audio.synthesize":
        return [];

      case "audio.stop":
        handleAudioEffect(effect);
        return [];

      case "storage.read":
      case "storage.write":
      default:
        return [];
    }
  };
