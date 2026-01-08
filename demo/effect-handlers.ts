import type { EffectHandlers } from "../src/types/runtime";
import type { EffectResult } from "../src/types/effects/effect-result";
import type {
  NetworkEffect,
  NetworkResult,
} from "../src/types/effects/network";

export const handleEffect: EffectHandlers["handle"] = async (effect) => {
  if (effect.type !== "network.post") {
    return {
      ok: false,
      error: "unsupported-effect",
    } as EffectResult<typeof effect>;
  }

  const e = effect as NetworkEffect;

  try {
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma3:4b",
        messages: [
          { role: "user", content: String((e.payload as any).prompt) },
        ],
        stream: false,
      }),
    });

    const data = await response.json();

    const result: NetworkResult = {
      ok: true,
      value: {
        conversationId: (e.payload as any).conversationId,
        traces: [data.message],
      },
    };

    return result as EffectResult<typeof effect>;
  } catch (error) {
    return {
      ok: false,
      error,
    } as EffectResult<typeof effect>;
  }
};
