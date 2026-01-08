import { Root, ID } from "../types/runtime";
import { Command, Event } from "../types";
import { MessageTextReceived } from "../types/events";

const now = (): string => new Date().toISOString();

type AssistantTrace = {
  role: "assistant";
  content: string;
  ids: ID;
};

export const tracesAggregate = (
  _root: Root,
  command: Command,
  ids: ID,
): {
  events: Event[];
  effects: [];
} => {
  switch (command.type) {
    case "LoadEvents":
      return {
        events: command.data.events,
        effects: [],
      };

    case "ReceiveTraces": {
      const trace = command.data.traces.find(
        (t): t is AssistantTrace =>
          typeof t === "object" &&
          t !== null &&
          (t as any).role === "assistant" &&
          typeof (t as any).content === "string",
      );

      if (!trace) {
        return { events: [], effects: [] };
      }

      const event: MessageTextReceived = {
        type: "MessageTextReceived",
        category: "message",
        id: ids(),
        time: now(),
        data: {
          conversationId: command.data.conversationId,
          avatar: command.data.avatar,
          text: trace.content,
        },
      };

      return {
        events: [event],
        effects: [],
      };
    }

    default:
      return { events: [], effects: [] };
  }
};
