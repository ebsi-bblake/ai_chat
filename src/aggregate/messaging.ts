import { Root } from "../types/runtime";
import { Command, Event } from "../types/core";
import { SendMessage } from "../types/commands/messaging";
import { MessageSent } from "../types/events/messaging";
import { CommandRejected } from "../types/commands/error";
import { NetworkEffect } from "../types/effects/network";
import { Effect } from "../types/core";

const now = (): string => {
  return new Date().toISOString();
};

const generateMessageId = (): string => {
  return crypto.randomUUID();
};

const generateRequestId = (): string => {
  return crypto.randomUUID();
};

export const messagingAggregate = (
  root: Root,
  command: Command,
): {
  events: Event[];
  effects: Effect[];
} => {
  switch (command.type) {
    case "SendMessage": {
      if (!root.conversationActive || root.conversationId === null) {
        const rejected: CommandRejected = {
          type: "CommandRejected",
          payload: {
            command,
            reason: "no-active-conversation",
          },
        };

        return {
          events: [rejected],
          effects: [],
        };
      }

      if (command.payload.text.trim().length === 0) {
        const rejected: CommandRejected = {
          type: "CommandRejected",
          payload: {
            command,
            reason: "empty-message",
          },
        };

        return {
          events: [rejected],
          effects: [],
        };
      }

      const messageId: string = generateMessageId();
      const requestId: string = generateRequestId();

      const messageSent: MessageSent = {
        type: "MessageSent",
        payload: {
          messageId,
          time: now(),
        },
      };

      const networkEffect: NetworkEffect = {
        type: "network.post",
        payload: {
          requestId,
          url: "/messages",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            conversationId: root.conversationId,
            messageId,
            text: command.payload.text,
          },
        },
      };

      return {
        events: [messageSent],
        effects: [networkEffect],
      };
    }

    default:
      return {
        events: [],
        effects: [],
      };
  }
};
