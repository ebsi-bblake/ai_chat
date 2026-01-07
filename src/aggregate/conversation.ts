import { Aggregate, Root } from "../types/runtime";
import { Command, Event } from "../types/core";
import { ConversationCreated } from "../types/events/conversation";

const generateConversationId = (): string => crypto.randomUUID();

const now = (): string => new Date().toISOString();

export const conversationAggregate = (
  root: Root,
  command: Command,
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
        payload: {
          conversationId: generateConversationId(),
          time: now(),
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
