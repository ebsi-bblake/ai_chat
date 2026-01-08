import { Root, ID } from "../types/runtime";
import { Command, Event } from "../types";
import { ConversationCreated } from "../types/events";

const now = (): string => new Date().toISOString();

export const conversationAggregate = (
  root: Root,
  command: Command,
  ids: ID,
): {
  events: Event[];
  effects: [];
} => {
  switch (command.type) {
    case "CreateConversation": {
      if (root.conversationActive) {
        return { events: [], effects: [] };
      }

      const event: ConversationCreated = {
        type: "ConversationCreated",
        category: "session",
        id: ids(),
        time: now(),
        data: {
          conversationId: ids(),
          avatar: command.data.avatar,
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
