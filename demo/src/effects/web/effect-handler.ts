import type { EffectHandlers } from "../../../../src/types/runtime";
import type { EffectResult } from "../../../../src/types/effects/effect-result";
import type { NetworkEffect } from "../../../../src/types/effects/network";

import { handleNetworkEffect } from "./network-handler";

export const handleEffect: EffectHandlers["handle"] = async (effect) => {
  switch (effect.type) {
    case "network.post":
      return handleNetworkEffect(effect as NetworkEffect) as Promise<
        EffectResult<typeof effect>
      >;

    default:
      return {
        ok: false,
        error: "unsupported-effect",
      } as EffectResult<typeof effect>;
  }
};
