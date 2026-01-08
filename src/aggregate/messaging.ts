import { Root, ID } from "../types/runtime";
import { Command, Event, Effect } from "../types";
import { MessageSent, CommandRejected } from "../types/events";
import { NetworkEffect } from "../types/effects/network";

const now = (): string => new Date().toISOString();

export const messagingAggregate = (
  root: Root,
  command: Command,
  ids: ID,
): {
  events: Event[];
  effects: Effect[];
} => {
  switch (command.type) {
    case "SendMessage": {
      if (!root.conversationActive || root.conversationId === null) {
        const rejected: CommandRejected = {
          type: "CommandRejected",
          category: "system",
          id: ids(),
          time: now(),
          data: {
            conversationId: root.conversationId ?? "unknown",
            reason: "no-active-conversation",
            command: command.type,
            avatar: command.data.avatar,
          },
        };

        return { events: [rejected], effects: [] };
      }

      if (command.data.prompt.trim().length === 0) {
        const rejected: CommandRejected = {
          type: "CommandRejected",
          category: "system",
          id: ids(),
          time: now(),
          data: {
            conversationId: root.conversationId,
            reason: "empty-message",
            command: command.type,
            avatar: command.data.avatar,
          },
        };

        return { events: [rejected], effects: [] };
      }

      const messageSentEvent: MessageSent = {
        type: "MessageSent",
        category: "message",
        id: ids(),
        time: now(),
        data: {
          conversationId: root.conversationId,
          prompt: command.data.prompt,
          avatar: command.data.avatar,
        },
      };

      const networkEffect: NetworkEffect = {
        type: "network.post",
        data: {
          conversationId: root.conversationId,
          prompt: command.data.prompt,
        },
      };

      return {
        events: [messageSentEvent],
        effects: [networkEffect],
      };
    }

    default:
      return { events: [], effects: [] };
  }
};
