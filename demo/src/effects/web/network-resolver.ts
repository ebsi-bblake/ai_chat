import type { NetworkResult } from "../../../../src/types/effects/network";
import type { Command, ReceiveTraces } from "../../../../src/types/commands";
import type { ID } from "../../../../src/types/runtime";

const now = (): string => new Date().toISOString();

export const resolveNetworkResult =
  (ids: ID) =>
  (result: NetworkResult): Command[] => {
    if (!result.ok) return [];

    const cmd: ReceiveTraces = {
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

    return [cmd];
  };
