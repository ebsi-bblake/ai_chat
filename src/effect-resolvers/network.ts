import { Effect } from "../types/effects";
import { EffectResult } from "../types/effects/effect-result";
import { Command, ReceiveTraces } from "../types/commands";
import { NetworkResult } from "../types/effects/network";
import { EffectResolver } from "../types/runtime";

const now = (): string => new Date().toISOString();

export const resolveNetworkEffect: EffectResolver = (
  effect: Effect,
  result: EffectResult<Effect>,
): Command[] => {
  if (effect.type !== "network.post") {
    return [];
  }

  const networkResult = result as NetworkResult;

  if (!networkResult.ok) {
    return [];
  }

  const data = networkResult.value.data as {
    conversationId: string;
    traces?: unknown[];
  };

  const receiveTraces: ReceiveTraces = {
    type: "ReceiveTraces",
    category: "command",
    id: crypto.randomUUID(),
    time: now(),
    data: {
      conversationId: data.conversationId,
      avatar: "ai",
      traces: Array.isArray(data.traces) ? data.traces : [],
    },
  };

  return [receiveTraces];
};
