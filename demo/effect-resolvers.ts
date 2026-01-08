import type { EffectResolver, ID } from "../src/types/runtime";
import type { Effect } from "../src/types/effects";
import type { EffectResult } from "../src/types/effects/effect-result";
import type { NetworkResult } from "../src/types/effects/network";
import type { Command, ReceiveTraces } from "../src/types/commands";

const now = (): string => new Date().toISOString();

export const resolveEffect =
  (ids: ID): EffectResolver =>
  (effect: Effect, result: EffectResult<Effect>): Command[] => {
    switch (effect.type) {
      case "network.post": {
        const r = result as NetworkResult;
        if (!r.ok) return [];

        const cmd: ReceiveTraces = {
          type: "ReceiveTraces",
          category: "command",
          id: ids(),
          time: now(),
          data: {
            conversationId: r.value.conversationId,
            avatar: "ai",
            traces: r.value.traces,
          },
        };

        return [cmd];
      }

      default:
        return [];
    }
  };
