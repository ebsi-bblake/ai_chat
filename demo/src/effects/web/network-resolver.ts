import type { NetworkResult } from "../../../../src/types/effects/network";
import type {
  Command,
  ReceiveTraces,
  StartAudio,
} from "../../../../src/types/commands";
import type { ID } from "../../../../src/types/runtime";

const now = (): string => new Date().toISOString();

export const resolveNetworkResult =
  (ids: ID) =>
  (result: NetworkResult): Command[] => {
    if (!result.ok) return [];

    const receiveTracesCommand: ReceiveTraces = {
      type: "ReceiveTraces",
      category: "command",
      id: ids(),
      time: now(),
      data: {
        conversationId: result.value.conversationId,
        avatar: "ai",
        traces: result.value.traces,
      },
    };

    const assistantText = result.value.traces
      .map((t: { content: string }) => t.content)
      .join(" ");

    const startAudioCommand: StartAudio = {
      type: "StartAudio",
      category: "command",
      id: ids(),
      time: now(),
      data: {
        conversationId: result.value.conversationId,
        audioSrc: assistantText,
        avatar: "ai",
      },
    };
    return [receiveTracesCommand, startAudioCommand];
  };
