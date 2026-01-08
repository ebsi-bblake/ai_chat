import type { EffectResolver, ID } from "../../../../src/types/runtime";
import type { Effect } from "../../../../src/types/effects";
import type { EffectResult } from "../../../../src/types/effects/effect-result";
import type { NetworkResult } from "../../../../src/types/effects/network";

import { resolveNetworkResult } from "./network-resolver";

export const resolveEffect =
  (ids: ID): EffectResolver =>
  (effect: Effect, result: EffectResult<Effect>) => {
    switch (effect.type) {
      case "network.post":
        return resolveNetworkResult(ids)(result as NetworkResult);

      case "audio.synthesize":
        return []; // audio has no follow-up commands

      default:
        return [];
    }
  };
