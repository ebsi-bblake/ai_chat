import type {
  NetworkEffect,
  NetworkResult,
} from "../../../../src/types/effects/network";

export const handleNetworkEffect = async (
  effect: NetworkEffect,
): Promise<NetworkResult> => {
  try {
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma3:4b",
        messages: [
          {
            role: "user",
            content: String((effect.data as any).prompt),
          },
        ],
        stream: false,
      }),
    });

    const data = await response.json();

    return {
      ok: true,
      value: {
        conversationId: (effect.data as any).conversationId,
        traces: [data.message],
      },
    };
  } catch (error) {
    return { ok: false, error };
  }
};
