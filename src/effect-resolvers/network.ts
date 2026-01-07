import { Effect } from "../types/core";
import { EffectResult } from "../types/effects/effect-result";
import { Command } from "../types/core";
import { ReceiveTraces } from "../types/commands/messaging";
import { NetworkEffect } from "../types/effects/network";
import { NetworkResult } from "../types/effects/network";

export const resolveNetworkEffect = (
  effect: Effect,
  result: EffectResult<Effect>,
): Command[] => {
  if (effect.type !== "network.post") {
    return [];
  }

  const networkEffect: NetworkEffect = effect;
  const networkResult: NetworkResult = result as NetworkResult;

  if (!networkResult.ok) {
    throw new Error(
      `Network request failed: ${networkEffect.payload.requestId}`,
    );
  }

  const receiveTraces: ReceiveTraces = {
    type: "ReceiveTraces",
    payload: {
      traces: Array.isArray(networkResult.value.data)
        ? networkResult.value.data
        : [],
    },
  };

  return [receiveTraces];
};
