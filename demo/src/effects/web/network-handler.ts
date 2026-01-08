import type {
  NetworkEffect,
  NetworkResult,
} from "../../../../src/types/effects/network";

let socket: WebSocket | null = null;

export const handleNetworkEffect = async (
  effect: NetworkEffect,
): Promise<NetworkResult> => {
  switch (effect.type) {
    case "network.post":
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

    case "network.ws":
      if (!socket) {
        socket = new WebSocket("ws://localhost:11434/api/chat");
      }

      socket.send(
        JSON.stringify({
          prompt: effect.data.prompt,
          conversationId: effect.data.conversationId,
        }),
      );

      return { ok: true, value: null } as const;

    default:
      return { ok: false, error: "unsupported-network-effect" };
  }
};
